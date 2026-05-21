<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ExpertAccountCreated;
use App\Models\Expert;
use App\Models\ExpertApplication;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ExpertApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ExpertApplication::query()->orderByDesc('created_at');

        if ($search = trim((string) $request->query('search', ''))) {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like): void {
                $q->where('name_i18n->en', 'like', $like)
                    ->orWhere('name_i18n->fr', 'like', $like)
                    ->orWhere('name_i18n->ar', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('country', 'like', $like)
                    ->orWhere('city_i18n->en', 'like', $like)
                    ->orWhere('city_i18n->fr', 'like', $like)
                    ->orWhere('city_i18n->ar', 'like', $like)
                    ->orWhere('title_i18n->en', 'like', $like)
                    ->orWhere('title_i18n->fr', 'like', $like)
                    ->orWhere('title_i18n->ar', 'like', $like)
                    ->orWhere('expertise_i18n->en', 'like', $like)
                    ->orWhere('expertise_i18n->fr', 'like', $like)
                    ->orWhere('expertise_i18n->ar', 'like', $like)
                    ->orWhere('status', 'like', $like);
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return Inertia::render('admin/experts/applications', [
            'applications' => $query->paginate(15)->withQueryString(),
            'filters' => [
                'search' => $request->query('search', ''),
                'status' => $request->query('status', ''),
            ],
            'kpis' => [
                'total' => ExpertApplication::query()->count(),
                'pending' => ExpertApplication::query()->where('status', 'pending')->count(),
                'accepted' => ExpertApplication::query()->where('status', 'accepted')->count(),
                'denied' => ExpertApplication::query()->where('status', 'denied')->count(),
            ],
        ]);
    }

    public function review(Request $request, ExpertApplication $application): RedirectResponse
    {
        $data = $request->validate([
            'decision' => ['required', 'in:accepted,denied'],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        if ($application->status !== 'pending') {
            return back()->with('error', 'This application has already been reviewed.');
        }

        $credentialPayload = null;
        $mailFailed = false;

        DB::transaction(function () use ($application, $data, $request, &$credentialPayload): void {
            $expertId = $application->expert_id;

            if ($data['decision'] === 'accepted') {
                $account = $this->createOrResolveExpertUser($application);
                $expert = $this->createExpertFromApplication($application, $account['user']);
                $expertId = $expert->id;

                $credentialPayload = [
                    'user' => $account['user'],
                    'temporary_password' => $account['temporary_password'],
                    'new_account' => $account['new_account'],
                ];
            }

            $application->update([
                'status' => $data['decision'],
                'admin_notes' => $data['admin_notes'] ?? null,
                'reviewed_at' => now(),
                'reviewed_by_id' => $request->user()?->id,
                'expert_id' => $expertId,
            ]);
        });

        if ($credentialPayload !== null) {
            try {
                /** @var User $targetUser */
                $targetUser = $credentialPayload['user'];

                Mail::to($targetUser->email)->send(new ExpertAccountCreated(
                    user: $targetUser,
                    temporaryPassword: $credentialPayload['temporary_password'],
                    isNewAccount: (bool) $credentialPayload['new_account'],
                ));
            } catch (\Throwable $e) {
                report($e);
                $mailFailed = true;
            }
        }

        if ($mailFailed) {
            return back()->with('warning', 'Application was accepted, but the access email could not be sent. Please verify mail settings and retry.');
        }

        return back()->with('success', 'Application reviewed successfully.');
    }

    public function show(ExpertApplication $application): Response
    {
        $application->load(['reviewedBy:id,name,email', 'expert:id,on_front']);

        return Inertia::render('admin/experts/application-show', [
            'application' => $application,
        ]);
    }

    /**
     * @return array{user: User, temporary_password: string|null, new_account: bool}
     */
    private function createOrResolveExpertUser(ExpertApplication $application): array
    {
        $existing = User::query()
            ->where('email', $application->email)
            ->first();

        if ($existing) {
            if ($existing->role !== 'admin' && $existing->role !== 'expert') {
                $existing->role = 'expert';
                $existing->save();
            }

            return [
                'user' => $existing,
                'temporary_password' => null,
                'new_account' => false,
            ];
        }

        $temporaryPassword = Str::password(12);

        $nameI18n = $this->resolveTri($application->name_i18n, '', 'Expert');

        $user = User::query()->create([
            'name' => $nameI18n['en'],
            'email' => $application->email,
            'password' => $temporaryPassword,
            'role' => 'expert',
            'email_verified_at' => now(),
        ]);

        return [
            'user' => $user,
            'temporary_password' => $temporaryPassword,
            'new_account' => true,
        ];
    }

    private function createExpertFromApplication(ExpertApplication $application, User $user): Expert
    {
        if ($application->expert_id) {
            $expert = Expert::query()->findOrFail($application->expert_id);

            $updates = [];
            if ($expert->user_id === null) {
                $updates['user_id'] = $user->id;
            }
            if ($expert->status !== 'published') {
                $updates['status'] = 'published';
            }
            if ((! is_string($expert->email) || trim($expert->email) === '') && is_string($application->email)) {
                $updates['email'] = trim($application->email);
            }
            if ((! is_string($expert->image) || trim($expert->image) === '') && is_string($application->image_path)) {
                $updates['image'] = trim($application->image_path);
            }

            if ($updates !== []) {
                $expert->update($updates);
            }

            return $expert;
        }

        $name = $this->resolveTri($application->name_i18n, '', 'Expert');
        $title = $this->resolveTri($application->title_i18n, '', 'Expert');
        $bio = $this->resolveTri($application->bio_i18n, '', '');
        $expertiseText = $this->resolveTri($application->expertise_i18n, '', '');
        $cityI18n = $this->resolveTri(
            is_array($application->city_i18n) ? $application->city_i18n : null,
            '',
            ''
        );

        $topicsByLocale = [
            'en' => $this->extractTopics((string) $expertiseText['en']),
            'fr' => $this->extractTopics((string) $expertiseText['fr']),
            'ar' => $this->extractTopics((string) $expertiseText['ar']),
        ];

        $topicTags = $this->buildLocalizedTopics($topicsByLocale);
        $languages = is_array($application->languages)
            ? array_values(array_unique(array_filter(array_map(static fn (mixed $item): string => trim((string) $item), $application->languages))))
            : [];

        $socials = is_array($application->socials) ? $application->socials : [];
        $linkedin = trim((string) ($socials['linkedin'] ?? ''));
        $twitter = trim((string) ($socials['twitter'] ?? ''));
        $instagram = trim((string) ($socials['instagram'] ?? ''));
        $portfolio = trim((string) ($socials['portfolio'] ?? ''));

        // Keep compatibility with the directory UI by ensuring at least one expertise tag.
        if ($topicTags === []) {
            $topicTags = [[
                'en' => 'Expert',
                'fr' => 'Experte',
                'ar' => 'خبيرة',
            ]];
        }

        return Expert::query()->create([
            'user_id' => $user->id,
            'name' => $name,
            'title' => $title,
            'bio_i18n' => $bio,
            'expertise' => $topicTags,
            'city_i18n' => $cityI18n,
            'region_scope' => $application->region_scope ?: null,
            'country' => $application->country ?: 'Morocco',
            'languages' => $languages,
            'status' => 'published',
            'email' => $application->email,
            'phone' => $application->phone ?: null,
            'image' => $application->image_path ?: null,
            'socials' => [
                'linkedin' => $linkedin,
                'twitter' => $twitter,
                'instagram' => $instagram,
                'portfolio' => $portfolio,
            ],
            'cv_path' => $application->cv_path ?: null,
            'last_activity_at' => now(),
        ]);
    }

    /**
     * @return list<string>
     */
    private function extractTopics(string $raw): array
    {
        $items = preg_split('/[,;\n]+/', $raw) ?: [];

        $topics = [];
        foreach ($items as $item) {
            $topic = trim($item);
            if ($topic === '') {
                continue;
            }

            $topics[] = Str::limit($topic, 64, '');
        }

        return array_values(array_unique(array_slice($topics, 0, 6)));
    }

    /**
     * @param  array<string, mixed>|null  $value
     * @return array{en: string, fr: string, ar: string}
     */
    private function resolveTri(?array $value, string $fallback, string $default = ''): array
    {
        $fallback = trim($fallback);
        $base = $fallback !== '' ? $fallback : $default;

        $en = trim((string) ($value['en'] ?? $base));
        $fr = trim((string) ($value['fr'] ?? $en));
        $ar = trim((string) ($value['ar'] ?? $en));

        return [
            'en' => $en,
            'fr' => $fr,
            'ar' => $ar,
        ];
    }

    /**
     * @param  array{en: list<string>, fr: list<string>, ar: list<string>}  $topicsByLocale
     * @return list<array{en: string, fr: string, ar: string}>
     */
    private function buildLocalizedTopics(array $topicsByLocale): array
    {
        $rows = [];
        $max = max(
            count($topicsByLocale['en']),
            count($topicsByLocale['fr']),
            count($topicsByLocale['ar']),
        );

        for ($i = 0; $i < $max; $i++) {
            $en = trim((string) ($topicsByLocale['en'][$i] ?? ''));
            if ($en === '') {
                continue;
            }

            $rows[] = [
                'en' => $en,
                'fr' => trim((string) ($topicsByLocale['fr'][$i] ?? $en)),
                'ar' => trim((string) ($topicsByLocale['ar'][$i] ?? $en)),
            ];
        }

        return $rows;
    }

}
