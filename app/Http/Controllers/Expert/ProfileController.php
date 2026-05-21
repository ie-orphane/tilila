<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\Expert;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $expert = $this->resolveExpert($request);

        return Inertia::render('expert/profile-edit', [
            'expert' => $this->expertToForm($expert),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $expert = $this->resolveExpert($request);
        $data = $this->validated($request);
        $cvPath = $expert->cv_path;

        if ($request->hasFile('cv')) {
            $existingCvPath = trim((string) ($cvPath ?? ''));
            if ($existingCvPath !== '') {
                Storage::disk('public')->delete($existingCvPath);
            }
            $cvPath = $this->storeCvFromUpload($request->file('cv'));
        }

        if ($request->hasFile('profile_image')) {
            if ($expert->image) {
                Storage::disk('public')->delete($expert->image);
            }
            $data['image'] = $this->storeProfileImageFromUpload(
                $request->file('profile_image'),
            );
        }
        unset($data['profile_image']);

        $expert->update([
            ...$data,
            'cv_path' => $cvPath,
            'last_activity_at' => now(),
        ]);

        return back()->with('success', 'Your expert profile has been updated.');
    }

    private function resolveExpert(Request $request): Expert
    {
        return Expert::query()->where('user_id', $request->user()->id)->firstOrFail();
    }

    /**
     * @return array<string, mixed>
     */
    private function expertToForm(Expert $expert): array
    {
        $socials = is_array($expert->socials) ? $expert->socials : [];

        return [
            'id' => $expert->id,
            'name' => $this->triLangValue($expert->name),
            'title' => $this->triLangValue($expert->title),
            'expertise' => $this->expertiseToForm($expert->expertise),
            'bio' => $this->triLangValue($expert->bio_i18n),
            'country' => (string) ($expert->country ?? ''),
            'city' => $this->resolveCityForForm($expert),
            'languages' => $expert->languages ?? [],
            'email' => (string) ($expert->email ?? ''),
            'phone' => trim((string) ($expert->phone ?? '')),
            'linkedin_url' => trim((string) ($socials['linkedin'] ?? '')),
            'twitter_url' => trim((string) ($socials['twitter'] ?? '')),
            'instagram_url' => trim((string) ($socials['instagram'] ?? '')),
            'portfolio_url' => trim((string) ($socials['portfolio'] ?? '')),
            'image_url' => $expert->image_url,
            'cv_url' => $this->cvUrl($expert->cv_path),
        ];
    }

    /**
     * @return array<string, string>
     */
    private function triLangValue(mixed $value): array
    {
        if (is_array($value)) {
            return [
                'en' => trim((string) ($value['en'] ?? '')),
                'fr' => trim((string) ($value['fr'] ?? '')),
                'ar' => trim((string) ($value['ar'] ?? '')),
            ];
        }

        $text = trim((string) ($value ?? ''));

        return ['en' => $text, 'fr' => '', 'ar' => ''];
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $validated = $request->validate([
            'name' => ['required', 'array'],
            'name.en' => ['required', 'string', 'max:255'],
            'name.fr' => ['required', 'string', 'max:255'],
            'name.ar' => ['required', 'string', 'max:255'],
            'title' => ['required', 'array'],
            'title.en' => ['required', 'string', 'max:500'],
            'title.fr' => ['required', 'string', 'max:500'],
            'title.ar' => ['required', 'string', 'max:500'],
            'expertise' => ['required', 'array'],
            'expertise.en' => ['required', 'string', 'max:2000'],
            'expertise.fr' => ['required', 'string', 'max:2000'],
            'expertise.ar' => ['required', 'string', 'max:2000'],
            'bio' => ['required', 'array'],
            'bio.en' => ['required', 'string', 'max:5000'],
            'bio.fr' => ['required', 'string', 'max:5000'],
            'bio.ar' => ['required', 'string', 'max:5000'],
            'country' => ['nullable', 'string', 'max:120'],
            'city' => ['nullable', 'array'],
            'city.en' => ['nullable', 'string', 'max:120'],
            'city.fr' => ['nullable', 'string', 'max:120'],
            'city.ar' => ['nullable', 'string', 'max:120'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:16'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:64'],
            'linkedin_url' => ['nullable', 'url', 'max:2048'],
            'twitter_url' => ['nullable', 'url', 'max:2048'],
            'instagram_url' => ['nullable', 'url', 'max:2048'],
            'portfolio_url' => ['nullable', 'url', 'max:2048'],
            'profile_image' => ['nullable', 'file', 'max:5120', 'mimes:jpeg,png,webp,gif'],
        ]);

        if ($request->hasFile('cv')) {
            $request->validate([
                'cv' => ['required', 'file', 'max:5120', 'mimes:pdf,doc,docx'],
            ]);
        }

        $validated['name'] = $this->triLangValue($validated['name'] ?? []);
        $validated['title'] = $this->triLangValue($validated['title'] ?? []);
        $validated['expertise'] = $this->triLangValue($validated['expertise'] ?? []);
        $validated['bio'] = $this->triLangValue($validated['bio'] ?? []);
        $validated['country'] = trim((string) ($validated['country'] ?? ''));
        $validated['city'] = $this->triLangValue($validated['city'] ?? []);
        $validated['languages'] = array_values(array_unique(array_filter(array_map(
            static fn (string $value): string => trim($value),
            $validated['languages'] ?? []
        ))));
        $validated['email'] = trim((string) ($validated['email'] ?? ''));
        $validated['phone'] = trim((string) ($validated['phone'] ?? ''));
        $validated['linkedin_url'] = trim((string) ($validated['linkedin_url'] ?? ''));
        $validated['twitter_url'] = trim((string) ($validated['twitter_url'] ?? ''));
        $validated['instagram_url'] = trim((string) ($validated['instagram_url'] ?? ''));
        $validated['portfolio_url'] = trim((string) ($validated['portfolio_url'] ?? ''));

        $validated['bio_i18n'] = $validated['bio'];
        $validated['expertise'] = $this->buildLocalizedTopics([
            'en' => $this->extractTopics($validated['expertise']['en']),
            'fr' => $this->extractTopics($validated['expertise']['fr']),
            'ar' => $this->extractTopics($validated['expertise']['ar']),
        ]);
        $validated['socials'] = [
            'linkedin' => $validated['linkedin_url'],
            'twitter' => $validated['twitter_url'],
            'instagram' => $validated['instagram_url'],
            'portfolio' => $validated['portfolio_url'],
        ];

        unset(
            $validated['portfolio_url'],
            $validated['linkedin_url'],
            $validated['twitter_url'],
            $validated['instagram_url'],
            $validated['bio']
        );
        $validated['city_i18n'] = $validated['city'];
        unset($validated['city']);

        return $validated;
    }

    /**
     * Persist CV file on public disk.
     */
    private function storeCvFromUpload(UploadedFile $file): string
    {
        return $file->store('experts/cv', 'public');
    }

    private function cvUrl(?string $path): ?string
    {
        $path = trim((string) ($path ?? ''));
        if ($path === '') {
            return null;
        }

        return Storage::disk('public')->exists($path) ? Storage::url($path) : null;
    }

    /**
     * @return array{en: string, fr: string, ar: string}
     */
    private function resolveCityForForm(Expert $expert): array
    {
        $cityFromColumn = is_array($expert->city_i18n) ? $expert->city_i18n : null;
        if ($cityFromColumn !== null) {
            return $this->triLangValue($cityFromColumn);
        }

        return $this->triLangValue(['en' => '', 'fr' => '', 'ar' => '']);
    }

    /**
     * @param  list<array{en?: string, fr?: string, ar?: string}>|null  $expertise
     * @return array{en: string, fr: string, ar: string}
     */
    private function expertiseToForm(?array $expertise): array
    {
        if (! is_array($expertise)) {
            return $this->triLangValue(['en' => '', 'fr' => '', 'ar' => '']);
        }

        $values = ['en' => [], 'fr' => [], 'ar' => []];
        foreach ($expertise as $topic) {
            if (! is_array($topic)) {
                continue;
            }
            $values['en'][] = trim((string) ($topic['en'] ?? ''));
            $values['fr'][] = trim((string) ($topic['fr'] ?? ''));
            $values['ar'][] = trim((string) ($topic['ar'] ?? ''));
        }

        return [
            'en' => implode(', ', array_filter($values['en'])),
            'fr' => implode(', ', array_filter($values['fr'])),
            'ar' => implode(', ', array_filter($values['ar'])),
        ];
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

        return array_values(array_unique(array_slice($topics, 0, 8)));
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

    /**
     * Persist profile image on the public disk and return the stored path.
     */
    private function storeProfileImageFromUpload(UploadedFile $file): string
    {
        return $file->store('experts', 'public');
    }
}
