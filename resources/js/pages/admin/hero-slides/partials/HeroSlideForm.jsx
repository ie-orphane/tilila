import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function emptyTri() {
    return { en: '', fr: '', ar: '' };
}

function emptyCta() {
    return { label: emptyTri(), url: '', style: 'primary', is_active: true };
}

function TriLangInputs({ idPrefix, label, value, onChange, required = false, requiredAll = false, error, errors }) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{label}</p>
            <div className="grid gap-3 sm:grid-cols-3">
                {['en', 'fr', 'ar'].map((lang) => {
                    const langError = errors?.[lang];
                    return (
                        <div key={lang} className="space-y-1.5">
                            <Label htmlFor={`${idPrefix}-${lang}`}>
                                {lang.toUpperCase()}
                                {(requiredAll || (required && lang === 'en')) ? ' *' : ''}
                            </Label>
                            <Input
                                id={`${idPrefix}-${lang}`}
                                value={value?.[lang] ?? ''}
                                onChange={(e) =>
                                    onChange({ ...(value ?? {}), [lang]: e.target.value })
                                }
                            />
                            {langError && <InputError message={langError} />}
                        </div>
                    );
                })}
            </div>
            {error && <InputError message={error} />}
        </div>
    );
}

function TriLangTextareas({ idPrefix, label, value, onChange }) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{label}</p>
            <div className="grid gap-3 sm:grid-cols-3">
                {['en', 'fr', 'ar'].map((lang) => (
                    <div key={lang} className="space-y-1.5">
                        <Label htmlFor={`${idPrefix}-${lang}`}>
                            {lang.toUpperCase()}
                        </Label>
                        <textarea
                            id={`${idPrefix}-${lang}`}
                            className={cn(
                                'flex min-h-[96px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground',
                                'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                            )}
                            value={value?.[lang] ?? ''}
                            onChange={(e) =>
                                onChange({ ...(value ?? {}), [lang]: e.target.value })
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function HeroSlideForm({
    mode = 'create',
    data,
    setData,
    errors,
    submitLabel = 'Save',
    processing = false,
    onSubmit,
}) {
    const [imagePreview, setImagePreview] = React.useState(data.image_url ?? null);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('image', file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const isBanner = data.display_mode === 'banner_image';
    const isNormal = !isBanner;

    // CTA helpers
    const addCta = () => setData('ctas', [...(data.ctas ?? []), emptyCta()]);
    const removeCta = (i) => setData('ctas', (data.ctas ?? []).filter((_, idx) => idx !== i));
    const updateCta = (i, patch) =>
        setData('ctas', (data.ctas ?? []).map((c, idx) => (idx === i ? { ...c, ...patch } : c)));

    const KNOWN_SLIDE_KEYS = [
        'home', 'about', 'tililab', 'tilila', 'gouvernance',
        'experts', 'events', 'opportunities', 'media',
    ];

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-6" encType="multipart/form-data">
            {/* Identity */}
            <Card>
                <CardHeader>
                    <CardTitle>Identity</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="slide_key">
                                Slide key <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="slide_key"
                                value={data.slide_key ?? ''}
                                onChange={(e) => setData('slide_key', e.target.value)}
                                disabled={mode === 'edit'}
                                placeholder="e.g. experts"
                            />
                            {mode === 'edit' && (
                                <p className="text-xs text-muted-foreground">
                                    The slide key cannot be changed after creation — it is the routing anchor.
                                </p>
                            )}
                            {KNOWN_SLIDE_KEYS.includes(data.slide_key ?? '') && mode === 'edit' && (
                                <p className="text-xs text-amber-600">
                                    This is a built-in slide key. Deleting this slide will blank the hero on its route.
                                </p>
                            )}
                            <InputError message={errors?.slide_key} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sort_order">Sort order</Label>
                            <Input
                                id="sort_order"
                                type="number"
                                min="0"
                                value={data.sort_order ?? 0}
                                onChange={(e) => setData('sort_order', Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="path_prefix">Page URL prefix</Label>
                        <Input
                            id="path_prefix"
                            value={data.path_prefix ?? ''}
                            onChange={(e) => setData('path_prefix', e.target.value || null)}
                            placeholder="/about"
                        />
                        <p className="text-xs text-muted-foreground">
                            The URL prefix of the page where this slide should appear (e.g. <code>/about</code>, <code>/experts</code>). Use <code>/</code> for the home page. Leave blank to hide from all pages.
                        </p>
                        <InputError message={errors?.path_prefix} />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={Boolean(data.is_active)}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="h-4 w-4 rounded border-input accent-beta-blue"
                        />
                        <Label htmlFor="is_active">Active (visible on site)</Label>
                    </div>
                </CardContent>
            </Card>

            {/* Display options */}
            <Card>
                <CardHeader>
                    <CardTitle>Display options</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <div className="space-y-2">
                        <Label htmlFor="display_mode">Display mode</Label>
                        <select
                            id="display_mode"
                            className="flex h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={data.display_mode ?? 'normal'}
                            onChange={(e) => setData('display_mode', e.target.value)}
                        >
                            <option value="normal">Normal (image + text overlay)</option>
                            <option value="banner_image">Banner image (image only)</option>
                        </select>
                        <InputError message={errors?.display_mode} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {isNormal && (
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="image_contain"
                                    checked={Boolean(data.image_contain)}
                                    onChange={(e) => setData('image_contain', e.target.checked)}
                                    className="h-4 w-4 rounded border-input accent-beta-blue"
                                />
                                <Label htmlFor="image_contain">Image contain (don't crop)</Label>
                            </div>
                        )}

                        {isBanner && (
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="banner_image_contain"
                                    checked={Boolean(data.banner_image_contain)}
                                    onChange={(e) => setData('banner_image_contain', e.target.checked)}
                                    className="h-4 w-4 rounded border-input accent-beta-blue"
                                />
                                <Label htmlFor="banner_image_contain">Contain banner image</Label>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="image_position">Image position</Label>
                            <select
                                id="image_position"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={data.image_position ?? ''}
                                onChange={(e) => setData('image_position', e.target.value || null)}
                            >
                                <option value="">Center (default)</option>
                                <option value="right">Right</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_bg">Image background</Label>
                            <select
                                id="image_bg"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={data.image_bg ?? ''}
                                onChange={(e) => setData('image_bg', e.target.value || null)}
                            >
                                <option value="">Dark (default)</option>
                                <option value="white">White</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Image upload */}
            <Card>
                <CardHeader>
                    <CardTitle>Image</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {imagePreview && (
                        <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-border bg-muted">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-48 w-full object-contain"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="image">Upload image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <p className="text-xs text-muted-foreground">Max 8 MB. Accepted: JPEG, PNG, WebP, GIF.</p>
                        <InputError message={errors?.image} />
                    </div>
                    {data.image_url && !data.image && (
                        <p className="text-xs text-muted-foreground">
                            Current: <a href={data.image_url} target="_blank" rel="noreferrer" className="underline">{data.image_url}</a>
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Text content — shown for normal slides */}
            {isNormal && (
                <Card>
                    <CardHeader>
                        <CardTitle>Text content</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <TriLangInputs
                            idPrefix="badge"
                            label="Badge"
                            value={data.badge}
                            onChange={(v) => setData('badge', v)}
                        />
                        <TriLangInputs
                            idPrefix="kicker"
                            label="Kicker (small eyebrow text)"
                            value={data.kicker}
                            onChange={(v) => setData('kicker', v)}
                        />
                        <TriLangInputs
                            idPrefix="title_before"
                            label="Title — main part"
                            value={data.title_before}
                            onChange={(v) => setData('title_before', v)}
                            required
                            error={errors?.['title_before.en']}
                        />
                        <TriLangInputs
                            idPrefix="title_accent"
                            label="Title — accent (highlighted in blue)"
                            value={data.title_accent}
                            onChange={(v) => setData('title_accent', v)}
                        />
                        <TriLangTextareas
                            idPrefix="description"
                            label="Description"
                            value={data.description}
                            onChange={(v) => setData('description', v)}
                        />
                        <TriLangInputs
                            idPrefix="card_line"
                            label="Card line (small sub-text below description)"
                            value={data.card_line}
                            onChange={(v) => setData('card_line', v)}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Image alt text */}
            <Card>
                <CardHeader>
                    <CardTitle>Image alt text</CardTitle>
                </CardHeader>
                <CardContent>
                    <TriLangInputs
                        idPrefix="image_alt"
                        label="Image alt text (for screen readers)"
                        value={data.image_alt}
                        onChange={(v) => setData('image_alt', v)}
                    />
                </CardContent>
            </Card>

            {/* CTAs */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Call-to-action buttons</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={addCta}>
                        <Plus className="size-4" />
                        Add CTA
                    </Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    {(data.ctas ?? []).length === 0 && (
                        <p className="text-sm text-muted-foreground">No CTAs yet. Click "Add CTA" to add one.</p>
                    )}
                    {(data.ctas ?? []).map((cta, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-4 rounded-xl border border-border p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <GripVertical className="size-4 text-muted-foreground" />
                                    CTA {i + 1}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCta(i)}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                    aria-label={`Remove CTA ${i + 1}`}
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>

                            <TriLangInputs
                                idPrefix={`cta-${i}-label`}
                                label="Label"
                                value={cta.label}
                                onChange={(v) => updateCta(i, { label: v })}
                                requiredAll
                                errors={{
                                    en: errors?.[`ctas.${i}.label.en`],
                                    fr: errors?.[`ctas.${i}.label.fr`],
                                    ar: errors?.[`ctas.${i}.label.ar`],
                                }}
                            />

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor={`cta-${i}-url`}>URL</Label>
                                    <Input
                                        id={`cta-${i}-url`}
                                        value={cta.url ?? ''}
                                        onChange={(e) => updateCta(i, { url: e.target.value })}
                                        placeholder="/experts"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`cta-${i}-style`}>Style</Label>
                                    <select
                                        id={`cta-${i}-style`}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        value={cta.style ?? 'primary'}
                                        onChange={(e) => updateCta(i, { style: e.target.value })}
                                    >
                                        <option value="primary">Primary (blue)</option>
                                        <option value="secondary">Secondary (outline)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id={`cta-${i}-active`}
                                    checked={Boolean(cta.is_active)}
                                    onChange={(e) => updateCta(i, { is_active: e.target.checked })}
                                    className="h-4 w-4 rounded border-input accent-beta-blue"
                                />
                                <Label htmlFor={`cta-${i}-active`}>Active</Label>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving…' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
