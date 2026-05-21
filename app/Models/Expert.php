<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Expert extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'title',
        'bio_i18n',
        'expertise',
        'city_i18n',
        'country',
        'region_scope',
        'languages',
        'status',
        'on_front',
        'email',
        'phone',
        'image',
        'socials',
        'cv_path',
        'last_activity_at',
    ];

    /**
     * Storage path is internal; public consumers use `image_url`.
     *
     * @var list<string>
     */
    protected $hidden = ['image'];

    /**
     * @var list<string>
     */
    protected $appends = ['image_url'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'name' => 'array',
            'title' => 'array',
            'bio_i18n' => 'array',
            'expertise' => 'array',
            'city_i18n' => 'array',
            'languages' => 'array',
            'socials' => 'array',
            'on_front' => 'boolean',
            'last_activity_at' => 'datetime',
        ];
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Public URL for the stored profile image (`image` = relative path on the public disk).
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: function (): ?string {
                $path = $this->attributes['image'] ?? null;
                if (! is_string($path) || $path === '' || ! Storage::disk('public')->exists($path)) {
                    return null;
                }

                $path = str_replace('\\', '/', $path);

                return '/storage/'.ltrim($path, '/');
            }
        );
    }

    protected static function booted(): void
    {
        static::deleting(function (Expert $expert): void {
            $path = $expert->getAttributes()['image'] ?? null;
            if (is_string($path) && $path !== '') {
                Storage::disk('public')->delete($path);
            }
        });
    }

    /**
     * Shape expected by public React experts directory.
     *
     * @return array<string, mixed>
     */
    public function toDirectoryArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'title' => $this->title,
            'expertise' => $this->expertise ?? [],
            'city_i18n' => $this->city_i18n,
            'country' => $this->country,
            'region_scope' => $this->region_scope,
            'languages' => $this->languages ?? [],
            'on_front' => (bool) $this->on_front,
            'image' => $this->image_url,
            'email' => $this->email,
        ];
    }
}
