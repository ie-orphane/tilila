<?php

namespace App\Http\Controllers;

use App\Models\Expert;
use App\Models\ExpertOfMonth;
use Inertia\Inertia;
use Inertia\Response;

class ExpertController extends Controller
{
    public function index(): Response
    {
        $expertOfMonthEntry = ExpertOfMonth::query()
            ->with('expert')
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->first();

        $expertOfMonth = null;
        if ($expertOfMonthEntry && $expertOfMonthEntry->expert?->isPublished()) {
            $expertOfMonth = [
                'month' => $expertOfMonthEntry->month,
                'year' => $expertOfMonthEntry->year,
                'video_url' => $expertOfMonthEntry->video_url,
                'expert' => $expertOfMonthEntry->expert->toDirectoryArray(),
            ];
        }

        $featured = Expert::query()
            ->where('status', 'published')
            ->where('on_front', true)
            ->orderBy('id')
            ->get()
            ->map(fn (Expert $e) => $e->toDirectoryArray());

        $experts = Expert::query()
            ->where('status', 'published')
            ->orderBy('id')
            ->get()
            ->map(fn (Expert $e) => $e->toDirectoryArray());

        return Inertia::render('experts/index', [
            'experts' => $experts,
            'featuredExperts' => $featured,
            'expertOfMonth' => $expertOfMonth,
        ]);
    }

    public function show(Expert $expert): Response
    {
        abort_unless($expert->isPublished(), 404);

        $details = $this->detailsFromExpert($expert);

        return Inertia::render('experts/[id]', [
            'id' => $expert->id,
            'expert' => $expert->toDirectoryArray(),
            'details' => $details,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function detailsFromExpert(Expert $expert): array
    {
        $bio = $this->normalizeTri($expert->bio_i18n);
        $socials = is_array($expert->socials) ? $expert->socials : [];
        $expertise = is_array($expert->expertise) ? $expert->expertise : [];

        return [
            'bio' => $bio === null ? [] : [$bio],
            'socials' => array_merge([
                'linkedin' => '',
                'twitter' => '',
                'instagram' => '',
                'portfolio' => '',
            ], $socials),
            'expertise' => array_values(array_filter(array_map(
                fn (mixed $topic): ?array => $this->expertiseItemFromTopic($topic),
                $expertise,
            ))),
        ];
    }

    /**
     * @param  array<string, mixed>|null  $value
     * @return array{en: string, fr: string, ar: string}|null
     */
    private function normalizeTri(?array $value): ?array
    {
        if (! is_array($value)) {
            return null;
        }

        return [
            'en' => trim((string) ($value['en'] ?? '')),
            'fr' => trim((string) ($value['fr'] ?? '')),
            'ar' => trim((string) ($value['ar'] ?? '')),
        ];
    }

    /**
     * @return array{title: array{en: string, fr: string, ar: string}}|null
     */
    private function expertiseItemFromTopic(mixed $topic): ?array
    {
        $tri = is_array($topic) ? $this->normalizeTri($topic) : null;
        if ($tri === null) {
            return null;
        }

        if ($tri['en'] === '' && $tri['fr'] === '' && $tri['ar'] === '') {
            return null;
        }

        return ['title' => $tri];
    }
}
