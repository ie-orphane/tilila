<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class HeroSlide extends Model
{
    protected $fillable = [
        'slide_key',
        'path_prefix',
        'is_active',
        'sort_order',
        'display_mode',
        'image_contain',
        'banner_image_contain',
        'image_position',
        'image_bg',
        'image_path',
        'image_alt',
        'badge',
        'kicker',
        'title_before',
        'title_accent',
        'description',
        'card_line',
        'ctas',
    ];

    protected $appends = ['image_url'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'image_contain' => 'boolean',
            'banner_image_contain' => 'boolean',
            'image_alt' => 'array',
            'badge' => 'array',
            'kicker' => 'array',
            'title_before' => 'array',
            'title_accent' => 'array',
            'description' => 'array',
            'card_line' => 'array',
            'ctas' => 'array',
        ];
    }

    /** @param Builder<HeroSlide> $query */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    /** @param Builder<HeroSlide> $query */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('id');
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_path) {
            return null;
        }

        if (preg_match('#^https?://#', (string) $this->image_path)) {
            return $this->image_path;
        }

        // Assets served directly from /public (e.g. /assets/hero.png) are not in storage
        if (str_starts_with((string) $this->image_path, '/')) {
            return $this->image_path;
        }

        return Storage::url($this->image_path);
    }

    /**
     * Returns the camelCase shape that HeroCarousel.jsx expects.
     *
     * @return array<string, mixed>
     */
    public function toCarouselArray(): array
    {
        $ctas = is_array($this->ctas) ? $this->ctas : [];

        return [
            'key' => $this->slide_key,
            'pathPrefix' => $this->path_prefix,
            'imageSrc' => $this->image_url,
            'imageAlt' => $this->image_alt ?? ['en' => '', 'fr' => '', 'ar' => ''],
            'bannerImage' => $this->display_mode === 'banner_image',
            'bannerImageContain' => $this->banner_image_contain,
            'imageContain' => $this->image_contain,
            'imageBg' => $this->image_bg,
            'imagePosition' => $this->image_position,
            'badge' => $this->badge,
            'cardKicker' => $this->kicker,
            'titleBefore' => $this->title_before,
            'titleAccent' => $this->title_accent,
            'description' => $this->description,
            'cardLine' => $this->card_line,
            'ctas' => $ctas,
        ];
    }
}
