<?php

namespace App\Http\Controllers;

use App\Models\ExpertApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ExpertApplicationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('experts/become');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name_i18n' => ['required', 'array'],
            'name_i18n.en' => ['nullable', 'string', 'max:255'],
            'name_i18n.fr' => ['required', 'string', 'max:255'],
            'name_i18n.ar' => ['nullable', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('expert_applications', 'email')->where(
                    fn ($q) => $q->where('status', 'pending')
                ),
            ],
            'phone' => ['nullable', 'string', 'max:64'],
            'region_scope' => ['required', 'string', 'in:maroc,afrique,diaspora'],
            'country' => ['required', 'string', 'max:120'],
            'city' => ['required', 'array'],
            'city.en' => ['nullable', 'string', 'max:120'],
            'city.fr' => ['required', 'string', 'max:120'],
            'city.ar' => ['nullable', 'string', 'max:120'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:16'],
            'title_i18n' => ['required', 'array'],
            'title_i18n.en' => ['nullable', 'string', 'max:255'],
            'title_i18n.fr' => ['required', 'string', 'max:255'],
            'title_i18n.ar' => ['nullable', 'string', 'max:255'],
            'expertise_i18n' => ['required', 'array'],
            'expertise_i18n.en' => ['nullable', 'string', 'max:2000'],
            'expertise_i18n.fr' => ['required', 'string', 'max:2000'],
            'expertise_i18n.ar' => ['nullable', 'string', 'max:2000'],
            'bio_i18n' => ['required', 'array'],
            'bio_i18n.en' => ['nullable', 'string', 'max:5000'],
            'bio_i18n.fr' => ['required', 'string', 'max:5000'],
            'bio_i18n.ar' => ['nullable', 'string', 'max:5000'],
            'linkedin_url' => ['nullable', 'url', 'max:2048'],
            'twitter_url' => ['nullable', 'url', 'max:2048'],
            'instagram_url' => ['nullable', 'url', 'max:2048'],
            'portfolio_url' => ['nullable', 'url', 'max:2048'],
            'locale' => ['nullable', 'string', 'max:8'],
            'cv' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'profile_image' => ['required', 'file', 'mimes:jpeg,png,webp,gif', 'max:5120'],
        ], [
            'email.unique' => 'You already have a pending application with this email.',
        ]);

        $cvPath = null;
        if ($request->hasFile('cv')) {
            $cvPath = $request->file('cv')->store('expert-applications/cv', 'public');
        }

        $imagePath = null;
        if ($request->hasFile('profile_image')) {
            $imagePath = $request->file('profile_image')
                ->store('expert-applications/images', 'public');
        }

        $nameI18n = $this->normalizeTri($data['name_i18n'] ?? null);
        $titleI18n = $this->normalizeTri($data['title_i18n'] ?? null);
        $expertiseI18n = $this->normalizeTri($data['expertise_i18n'] ?? null);
        $bioI18n = $this->normalizeTri($data['bio_i18n'] ?? null);
        $cityI18n = $this->normalizeTri($data['city'] ?? null, '');
        $socials = [
            'linkedin' => trim((string) ($data['linkedin_url'] ?? '')),
            'twitter' => trim((string) ($data['twitter_url'] ?? '')),
            'instagram' => trim((string) ($data['instagram_url'] ?? '')),
            'portfolio' => trim((string) ($data['portfolio_url'] ?? '')),
        ];
        $languages = array_values(array_unique(array_filter(array_map(
            static fn (string $item): string => trim($item),
            $data['languages'] ?? [],
        ))));

        ExpertApplication::query()->create([
            'name_i18n' => $nameI18n,
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'region_scope' => $data['region_scope'] ?? null,
            'country' => $data['country'] ?? null,
            'city_i18n' => $cityI18n,
            'languages' => $languages,
            'title_i18n' => $titleI18n,
            'expertise_i18n' => $expertiseI18n,
            'bio_i18n' => $bioI18n,
            'socials' => $socials,
            'cv_path' => $cvPath,
            'image_path' => $imagePath,
            'locale' => $data['locale'] ?? null,
            'ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 1000),
            'status' => 'pending',
        ]);

        return back()->with('success', 'Your expert request was submitted successfully.');
    }

    /**
     * @param  array<string, mixed>|null  $value
     * @return array{en: string, fr: string, ar: string}
     */
    private function normalizeTri(?array $value, string $fallback = ''): array
    {
        $en = trim((string) ($value['en'] ?? $fallback));
        $fr = trim((string) ($value['fr'] ?? ''));
        $ar = trim((string) ($value['ar'] ?? ''));

        if ($fr === '') {
            $fr = $en;
        }
        if ($ar === '') {
            $ar = $en;
        }

        return [
            'en' => $en,
            'fr' => $fr,
            'ar' => $ar,
        ];
    }
}
