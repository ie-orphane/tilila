<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class HeroSlideController extends Controller
{
    public function index(): Response
    {
        $slides = HeroSlide::query()
            ->ordered()
            ->get()
            ->map(fn (HeroSlide $s) => [
                'id' => $s->id,
                'slide_key' => $s->slide_key,
                'is_active' => $s->is_active,
                'sort_order' => $s->sort_order,
                'display_mode' => $s->display_mode,
                'image_url' => $s->image_url,
                'title_before' => $s->title_before,
                'title_accent' => $s->title_accent,
            ]);

        return Inertia::render('admin/hero-slides/index', [
            'slides' => $slides,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/hero-slides/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('hero_slides', 'public');
        }

        // Auto-assign sort_order to the end when the admin leaves it at the default 0.
        if (! $request->filled('sort_order') || (int) $request->input('sort_order') === 0) {
            $data['sort_order'] = (int) (HeroSlide::query()->max('sort_order') ?? -1) + 1;
        }

        HeroSlide::query()->create($data);

        return redirect()->route('admin.hero-slides.index')->with('success', 'Hero slide created.');
    }

    public function edit(HeroSlide $heroSlide): Response
    {
        return Inertia::render('admin/hero-slides/edit', [
            'slide' => array_merge($heroSlide->toArray(), ['image_url' => $heroSlide->image_url]),
        ]);
    }

    public function update(Request $request, HeroSlide $heroSlide): RedirectResponse
    {
        $data = $this->validated($request, $heroSlide);

        if ($request->hasFile('image')) {
            if ($heroSlide->image_path && ! str_starts_with((string) $heroSlide->image_path, '/')) {
                Storage::disk('public')->delete((string) $heroSlide->image_path);
            }
            $data['image_path'] = $request->file('image')->store('hero_slides', 'public');
        }

        $heroSlide->update($data);

        return redirect()->route('admin.hero-slides.index')->with('success', 'Hero slide updated.');
    }

    public function destroy(HeroSlide $heroSlide): RedirectResponse
    {
        if ($heroSlide->image_path && ! str_starts_with((string) $heroSlide->image_path, '/')) {
            Storage::disk('public')->delete((string) $heroSlide->image_path);
        }
        $heroSlide->delete();

        return redirect()->route('admin.hero-slides.index')->with('success', 'Hero slide deleted.');
    }

    public function toggle(HeroSlide $heroSlide): RedirectResponse
    {
        $heroSlide->update(['is_active' => ! $heroSlide->is_active]);

        return redirect()->route('admin.hero-slides.index')->with('success', 'Hero slide status updated.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'ordered_ids' => 'required|array',
            'ordered_ids.*' => 'required|integer|exists:hero_slides,id',
        ]);

        foreach ($request->input('ordered_ids') as $position => $id) {
            HeroSlide::query()->where('id', $id)->update(['sort_order' => $position]);
        }

        return redirect()->route('admin.hero-slides.index')->with('success', 'Order saved.');
    }

    /** @return array<string, mixed> */
    private function validated(Request $request, ?HeroSlide $slide = null): array
    {
        $slideKeyRule = $slide
            ? ['required', 'string', 'max:64', Rule::unique('hero_slides', 'slide_key')->ignore($slide->id)]
            : ['required', 'string', 'max:64', Rule::unique('hero_slides', 'slide_key')];

        $pathPrefixRule = $slide
            ? ['nullable', 'string', 'max:255', Rule::unique('hero_slides', 'path_prefix')->ignore($slide->id)]
            : ['nullable', 'string', 'max:255', Rule::unique('hero_slides', 'path_prefix')];

        $validated = $request->validate([
            'slide_key'   => $slideKeyRule,
            'path_prefix' => $pathPrefixRule,
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'display_mode' => 'required|string|in:normal,banner_image',
            'image_contain' => 'boolean',
            'banner_image_contain' => 'boolean',
            'image_position' => 'nullable|string|max:32',
            'image_bg' => 'nullable|string|max:64',
            'image' => 'nullable|image|max:8192',

            'image_alt' => 'nullable|array',
            'image_alt.en' => 'nullable|string|max:255',
            'image_alt.fr' => 'nullable|string|max:255',
            'image_alt.ar' => 'nullable|string|max:255',

            'badge' => 'nullable|array',
            'badge.en' => 'nullable|string|max:255',
            'badge.fr' => 'nullable|string|max:255',
            'badge.ar' => 'nullable|string|max:255',

            'kicker' => 'nullable|array',
            'kicker.en' => 'nullable|string|max:255',
            'kicker.fr' => 'nullable|string|max:255',
            'kicker.ar' => 'nullable|string|max:255',

            'title_before' => 'nullable|array',
            'title_before.en' => 'nullable|string|max:255',
            'title_before.fr' => 'nullable|string|max:255',
            'title_before.ar' => 'nullable|string|max:255',

            'title_accent' => 'nullable|array',
            'title_accent.en' => 'nullable|string|max:255',
            'title_accent.fr' => 'nullable|string|max:255',
            'title_accent.ar' => 'nullable|string|max:255',

            'description' => 'nullable|array',
            'description.en' => 'nullable|string|max:2000',
            'description.fr' => 'nullable|string|max:2000',
            'description.ar' => 'nullable|string|max:2000',

            'card_line' => 'nullable|array',
            'card_line.en' => 'nullable|string|max:500',
            'card_line.fr' => 'nullable|string|max:500',
            'card_line.ar' => 'nullable|string|max:500',

            'ctas' => 'nullable|array',
            'ctas.*.label' => 'required|array',
            'ctas.*.label.en' => 'required|string|max:255',
            'ctas.*.label.fr' => 'required|string|max:255',
            'ctas.*.label.ar' => 'required|string|max:255',
            'ctas.*.url' => 'nullable|string|max:2048',
            'ctas.*.style' => 'required|string|in:primary,secondary',
            'ctas.*.is_active' => 'boolean',
        ], [], [
            'ctas.*.label.en' => 'CTA label (EN)',
            'ctas.*.label.fr' => 'CTA label (FR)',
            'ctas.*.label.ar' => 'CTA label (AR)',
        ]);

        // Require at least one title locale for normal slides
        if (($validated['display_mode'] ?? 'normal') === 'normal') {
            $tb = $validated['title_before'] ?? [];
            $ta = $validated['title_accent'] ?? [];
            $hasBefore = ! empty(array_filter([$tb['en'] ?? '', $tb['fr'] ?? '', $tb['ar'] ?? '']));
            $hasAccent = ! empty(array_filter([$ta['en'] ?? '', $ta['fr'] ?? '', $ta['ar'] ?? '']));
            if (! $hasBefore && ! $hasAccent) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'title_before.en' => ['A title is required for normal display mode slides.'],
                ]);
            }
        }

        // Require every language's label per CTA (also rejects whitespace-only values).
        foreach (($validated['ctas'] ?? []) as $i => $cta) {
            $label = $cta['label'] ?? [];
            foreach (['en', 'fr', 'ar'] as $lang) {
                if (trim((string) ($label[$lang] ?? '')) === '') {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        "ctas.{$i}.label.{$lang}" => ['A label is required in all languages (EN, FR, AR) for each CTA.'],
                    ]);
                }
            }
        }

        unset($validated['image']);

        return $validated;
    }
}
