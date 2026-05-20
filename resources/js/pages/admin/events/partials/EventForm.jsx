import React from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function SpeakerListAvatar({ speaker }) {
    const blobUrl = React.useMemo(() => {
        if (speaker?.photo instanceof File) {
            return URL.createObjectURL(speaker.photo);
        }

        return null;
    }, [speaker?.photo]);

    React.useEffect(() => {
        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [blobUrl]);

    if (speaker?.photo_url) {
        return (
            <img
                src={speaker.photo_url}
                alt=""
                className="h-full w-full object-cover"
            />
        );
    }
    if (blobUrl) {
        return (
            <img src={blobUrl} alt="" className="h-full w-full object-cover" />
        );
    }

    return null;
}

function PartnerListLogo({ partner }) {
    const blobUrl = React.useMemo(() => {
        if (partner?.logo instanceof File) {
            return URL.createObjectURL(partner.logo);
        }

        return null;
    }, [partner?.logo]);

    React.useEffect(() => {
        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [blobUrl]);

    if (partner?.logo_url) {
        return (
            <img
                src={partner.logo_url}
                alt=""
                className="max-h-full max-w-full object-contain"
            />
        );
    }
    if (blobUrl) {
        return (
            <img
                src={blobUrl}
                alt=""
                className="max-h-full max-w-full object-contain"
            />
        );
    }

    return null;
}

function TriLangInputs({ idPrefix, label, value, onChange, required = false }) {
    return (
        <div className="grid gap-3 sm:grid-cols-3">
            {['en', 'fr', 'ar'].map((lang) => (
                <div key={lang} className="space-y-2">
                    <Label htmlFor={`${idPrefix}-${lang}`}>
                        {label} ({lang.toUpperCase()})
                        {required && lang === 'en' ? ' *' : ''}
                    </Label>
                    <Input
                        id={`${idPrefix}-${lang}`}
                        value={value?.[lang] ?? ''}
                        onChange={(e) =>
                            onChange({ ...value, [lang]: e.target.value })
                        }
                    />
                </div>
            ))}
        </div>
    );
}

function TriLangTextareas({ idPrefix, label, value, onChange }) {
    return (
        <div className="grid gap-3 sm:grid-cols-3">
            {['en', 'fr', 'ar'].map((lang) => (
                <div key={lang} className="space-y-2">
                    <Label htmlFor={`${idPrefix}-${lang}`}>
                        {label} ({lang.toUpperCase()})
                    </Label>
                    <textarea
                        id={`${idPrefix}-${lang}`}
                        className={cn(
                            'flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground',
                            'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                        )}
                        value={value?.[lang] ?? ''}
                        onChange={(e) =>
                            onChange({ ...value, [lang]: e.target.value })
                        }
                    />
                </div>
            ))}
        </div>
    );
}

export default function EventForm({
    mode = 'create',
    existingMedia = [],
    data,
    setData,
    errors,
    types = [],
    statuses = [],
    visibilities = [],
    submitLabel = 'Save',
    processing = false,
    onSubmit,
}) {
    const canManageGallery =
        mode === 'edit' &&
        (data.status === 'finished' || data.status === 'archived');
    const [speakerModalOpen, setSpeakerModalOpen] = React.useState(false);
    const [partnerModalOpen, setPartnerModalOpen] = React.useState(false);
    const [speakerDraft, setSpeakerDraft] = React.useState({
        full_name: '',
        role: '',
        email: '',
        photo: null,
        photo_path: null,
        photo_url: null,
    });
    const [partnerDraft, setPartnerDraft] = React.useState({
        name: '',
        url: '',
        logo: null,
        logo_path: null,
        logo_url: null,
    });
    const [editingSpeakerIndex, setEditingSpeakerIndex] = React.useState(null);
    const [editingPartnerIndex, setEditingPartnerIndex] = React.useState(null);

    const [agendaModalOpen, setAgendaModalOpen] = React.useState(false);
    const [agendaDraft, setAgendaDraft] = React.useState({
        time: '',
        label: '',
    });
    const [editingAgendaIndex, setEditingAgendaIndex] = React.useState(null);

    const [speakerPreviewUrl, setSpeakerPreviewUrl] = React.useState(null);
    React.useEffect(() => {
        if (!speakerDraft.photo) {
            setSpeakerPreviewUrl(null);

            return;
        }
        const url = URL.createObjectURL(speakerDraft.photo);
        setSpeakerPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [speakerDraft.photo]);

    const [partnerPreviewUrl, setPartnerPreviewUrl] = React.useState(null);
    React.useEffect(() => {
        if (!partnerDraft.logo) {
            setPartnerPreviewUrl(null);

            return;
        }
        const url = URL.createObjectURL(partnerDraft.logo);
        setPartnerPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [partnerDraft.logo]);

    const [coverPreviewUrl, setCoverPreviewUrl] = React.useState(null);
    React.useEffect(() => {
        if (!data.cover_image) {
            setCoverPreviewUrl(null);

            return;
        }
        const url = URL.createObjectURL(data.cover_image);
        setCoverPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [data.cover_image]);

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                    <Card>
                        <CardHeader className="px-5 sm:px-8">
                            <CardTitle>Event Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 px-5 sm:px-8">
                            <TriLangInputs
                                idPrefix="title"
                                label="Event Title"
                                required
                                value={data.title}
                                onChange={(next) => setData('title', next)}
                            />
                            <InputError message={errors['title.en']} />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date *</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={data.date ?? ''}
                                        onChange={(e) =>
                                            setData('date', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.date} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Time *</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={data.time ?? ''}
                                        onChange={(e) =>
                                            setData('time', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.time} />
                                </div>
                            </div>

                            <TriLangInputs
                                idPrefix="location"
                                label="Location"
                                value={data.location}
                                onChange={(next) => setData('location', next)}
                            />

                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Input
                                    id="timezone"
                                    value={data.timezone ?? 'GMT+1'}
                                    onChange={(e) =>
                                        setData('timezone', e.target.value)
                                    }
                                    placeholder="GMT+1"
                                />
                                <InputError message={errors.timezone} />
                            </div>

                            <Card className="border-border/70 bg-background shadow-none">
                                <CardHeader className="px-5 sm:px-6">
                                    <CardTitle className="text-base">
                                        Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-5 sm:px-6">
                                    <TriLangTextareas
                                        idPrefix="description"
                                        label="Description"
                                        value={data.description}
                                        onChange={(next) =>
                                            setData('description', next)
                                        }
                                    />
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 bg-background shadow-none">
                                <CardHeader className="flex flex-col gap-3 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                    <CardTitle className="text-base">
                                        Agenda
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setEditingAgendaIndex(null);
                                            setAgendaDraft({
                                                time: '',
                                                label: '',
                                            });
                                            setAgendaModalOpen(true);
                                        }}
                                    >
                                        Add item
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4 px-5 sm:px-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="agenda-section-title">
                                            Section title
                                        </Label>
                                        <Input
                                            id="agenda-section-title"
                                            value={
                                                data.agenda?.title ?? 'Agenda'
                                            }
                                            onChange={(e) =>
                                                setData('agenda', {
                                                    ...data.agenda,
                                                    title: e.target.value,
                                                    items:
                                                        data.agenda?.items ??
                                                        [],
                                                })
                                            }
                                            placeholder="Agenda"
                                        />
                                    </div>
                                    {(data.agenda?.items ?? []).length === 0 ? (
                                        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                                            No agenda items yet. Add times and
                                            session titles for the public event
                                            page.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {(data.agenda.items ?? []).map(
                                                (row, idx) => (
                                                    <div
                                                        key={`${row.time}-${idx}`}
                                                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
                                                    >
                                                        <div className="flex min-w-0 flex-1 items-baseline gap-3">
                                                            <span className="w-14 shrink-0 text-xs font-extrabold text-muted-foreground tabular-nums">
                                                                {row.time ||
                                                                    '—'}
                                                            </span>
                                                            <span className="truncate text-sm font-semibold text-foreground">
                                                                {row.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex shrink-0 items-center gap-3">
                                                            <button
                                                                type="button"
                                                                className="text-xs font-semibold text-beta-blue hover:underline"
                                                                onClick={() => {
                                                                    setEditingAgendaIndex(
                                                                        idx,
                                                                    );
                                                                    setAgendaDraft(
                                                                        {
                                                                            time:
                                                                                row.time ??
                                                                                '',
                                                                            label:
                                                                                row.label ??
                                                                                '',
                                                                        },
                                                                    );
                                                                    setAgendaModalOpen(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="text-xs font-semibold text-alpha-danger hover:underline"
                                                                onClick={() => {
                                                                    const next =
                                                                        (
                                                                            data
                                                                                .agenda
                                                                                ?.items ??
                                                                            []
                                                                        ).filter(
                                                                            (
                                                                                _,
                                                                                i,
                                                                            ) =>
                                                                                i !==
                                                                                idx,
                                                                        );
                                                                    setData(
                                                                        'agenda',
                                                                        {
                                                                            title:
                                                                                data
                                                                                    .agenda
                                                                                    ?.title ??
                                                                                'Agenda',
                                                                            items: next,
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                    <InputError
                                        message={errors['agenda.items']}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="border-border/70 bg-background shadow-none">
                                <CardHeader className="px-5 sm:px-6">
                                    <CardTitle className="text-base">
                                        Main event image
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 px-5 sm:px-6">
                                    <p className="text-sm text-muted-foreground">
                                        Used on the public event page (hero and
                                        listings) for{' '}
                                        <span className="font-semibold text-foreground">
                                            all
                                        </span>{' '}
                                        statuses — separate from the photo
                                        gallery.
                                    </p>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="cursor-pointer"
                                        onChange={(e) => {
                                            const f =
                                                e.target.files?.[0] ?? null;
                                            if (f) {
                                                setData('cover_image', f);
                                                setData(
                                                    'cover_image_path',
                                                    null,
                                                );
                                                setData(
                                                    'cover_image_url',
                                                    null,
                                                );
                                            }
                                        }}
                                    />
                                    {(coverPreviewUrl ||
                                        data.cover_image_url) && (
                                        <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
                                            <img
                                                src={
                                                    coverPreviewUrl ??
                                                    data.cover_image_url ??
                                                    ''
                                                }
                                                alt=""
                                                className="max-h-52 w-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <InputError message={errors.cover_image} />
                                </CardContent>
                            </Card>

                            {mode === 'edit' ? (
                                <Card className="border-border/70 bg-background shadow-none">
                                    <CardHeader className="px-5 sm:px-6">
                                        <CardTitle className="text-base">
                                            Replay &amp; photo gallery
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 px-5 sm:px-6">
                                        {canManageGallery ? (
                                            <>
                                                <div className="space-y-2 rounded-xl border border-border bg-card/60 px-4 py-4">
                                                    <Label htmlFor="replay_video_url">
                                                        YouTube replay
                                                    </Label>
                                                    <Input
                                                        id="replay_video_url"
                                                        type="url"
                                                        value={
                                                            data.replay_video_url ??
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'replay_video_url',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="https://www.youtube.com/watch?v=… or https://youtu.be/…"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Paste a regular YouTube
                                                        link; it will embed on
                                                        the public event page.
                                                    </p>
                                                    <InputError
                                                        message={
                                                            errors.replay_video_url
                                                        }
                                                    />
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Add photos after the event
                                                    is finished or archived. New
                                                    files are appended when you
                                                    save.
                                                </p>
                                                {existingMedia.length > 0 ? (
                                                    <div>
                                                        <div className="text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
                                                            Current photos (
                                                            {
                                                                existingMedia.length
                                                            }
                                                            )
                                                        </div>
                                                        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                                                            {existingMedia.map(
                                                                (m) => (
                                                                    <div
                                                                        key={
                                                                            m.id
                                                                        }
                                                                        className="aspect-square overflow-hidden rounded-lg bg-muted ring-1 ring-border"
                                                                    >
                                                                        {m.url ? (
                                                                            <img
                                                                                src={
                                                                                    m.url
                                                                                }
                                                                                alt=""
                                                                                className="h-full w-full object-cover"
                                                                            />
                                                                        ) : null}
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : null}
                                                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-8">
                                                    <div className="text-center text-sm text-muted-foreground">
                                                        Add images to the
                                                        gallery
                                                    </div>
                                                    <div className="mt-4 flex justify-center">
                                                        <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground">
                                                            Choose files
                                                            <input
                                                                type="file"
                                                                multiple
                                                                className="sr-only"
                                                                onChange={(e) =>
                                                                    setData(
                                                                        'media_files',
                                                                        Array.from(
                                                                            e
                                                                                .target
                                                                                .files ??
                                                                                [],
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                        </label>
                                                    </div>

                                                    {(data.media_files ?? [])
                                                        .length ? (
                                                        <div className="mt-5 space-y-2 text-sm">
                                                            {(
                                                                data.media_files ??
                                                                []
                                                            ).map((f, idx) => (
                                                                <div
                                                                    key={`${f.name}-${idx}`}
                                                                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-2"
                                                                >
                                                                    <div className="min-w-0 truncate text-muted-foreground">
                                                                        {f.name}
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        className="text-xs font-semibold text-alpha-danger hover:underline"
                                                                        onClick={() =>
                                                                            setData(
                                                                                'media_files',
                                                                                (
                                                                                    data.media_files ??
                                                                                    []
                                                                                ).filter(
                                                                                    (
                                                                                        _,
                                                                                        i,
                                                                                    ) =>
                                                                                        i !==
                                                                                        idx,
                                                                                ),
                                                                            )
                                                                        }
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : null}

                                                    <InputError
                                                        message={
                                                            errors.media_files
                                                        }
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                YouTube replay and the photo
                                                gallery are available only when
                                                status is{' '}
                                                <span className="font-semibold text-foreground">
                                                    Finished
                                                </span>{' '}
                                                or{' '}
                                                <span className="font-semibold text-foreground">
                                                    Archived
                                                </span>
                                                . Change status in the sidebar,
                                                save, then return here.
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : null}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6 lg:col-span-4">
                    <Card>
                        <CardHeader className="px-5 sm:px-8">
                            <CardTitle>Publishing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 px-5 sm:px-8">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => {
                                        const next = e.target.value;
                                        setData('status', next);
                                        if (
                                            next !== 'finished' &&
                                            next !== 'archived'
                                        ) {
                                            setData('media_files', []);
                                        }
                                    }}
                                    className={cn(
                                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                                    )}
                                >
                                    {statuses.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.status} />
                            </div>

                            {data.status === 'live' ? (
                                <div className="space-y-2 rounded-xl border border-border bg-card/60 p-4">
                                    <Label htmlFor="live_video_url">
                                        YouTube live link
                                    </Label>
                                    <Input
                                        id="live_video_url"
                                        type="url"
                                        value={data.live_video_url ?? ''}
                                        onChange={(e) =>
                                            setData(
                                                'live_video_url',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://www.youtube.com/live/… or watch?v=…"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Shown on the public event page while
                                        status is{' '}
                                        <span className="font-semibold text-foreground">
                                            Live
                                        </span>
                                        . Accepts live, watch, shorts, youtu.be,
                                        or embed URLs.
                                    </p>
                                    <InputError
                                        message={errors.live_video_url}
                                    />
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                <Label htmlFor="visibility">Visibility</Label>
                                <select
                                    id="visibility"
                                    value={data.visibility}
                                    onChange={(e) =>
                                        setData('visibility', e.target.value)
                                    }
                                    className={cn(
                                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                                    )}
                                >
                                    {visibilities.map((v) => (
                                        <option key={v} value={v}>
                                            {v}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.visibility} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData('type', e.target.value)
                                    }
                                    className={cn(
                                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                                    )}
                                >
                                    {types.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.type} />
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-beta-blue text-twhite hover:bg-beta-blue/90"
                                >
                                    {processing ? 'Saving…' : submitLabel}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={processing}
                                >
                                    Save Draft
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="px-5 sm:px-8">
                            <CardTitle>Speakers</CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 sm:px-8">
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-sm text-muted-foreground">
                                    Add speakers (photo optional).
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditingSpeakerIndex(null);
                                        setSpeakerDraft({
                                            full_name: '',
                                            role: '',
                                            email: '',
                                            photo: null,
                                            photo_path: null,
                                            photo_url: null,
                                        });
                                        setSpeakerModalOpen(true);
                                    }}
                                >
                                    Add speaker
                                </Button>
                            </div>

                            <div className="mt-4 space-y-2">
                                {(data.speakers ?? []).length === 0 ? (
                                    <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                                        No speakers yet.
                                    </div>
                                ) : (
                                    (data.speakers ?? []).map((s, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
                                                    <SpeakerListAvatar
                                                        speaker={s}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-semibold text-foreground">
                                                        {s?.full_name ?? '—'}
                                                    </div>
                                                    <div className="truncate text-xs text-muted-foreground">
                                                        {[s?.role, s?.email]
                                                            .filter(Boolean)
                                                            .join(' • ') || '—'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    className="text-xs font-semibold text-beta-blue hover:underline"
                                                    onClick={() => {
                                                        setEditingSpeakerIndex(
                                                            idx,
                                                        );
                                                        setSpeakerDraft({
                                                            full_name:
                                                                s?.full_name ??
                                                                '',
                                                            role: s?.role ?? '',
                                                            email:
                                                                s?.email ?? '',
                                                            photo: null,
                                                            photo_path:
                                                                s?.photo_path ??
                                                                null,
                                                            photo_url:
                                                                s?.photo_url ??
                                                                null,
                                                        });
                                                        setSpeakerModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="text-xs font-semibold text-alpha-danger hover:underline"
                                                    onClick={() =>
                                                        setData(
                                                            'speakers',
                                                            (
                                                                data.speakers ??
                                                                []
                                                            ).filter(
                                                                (_, i) =>
                                                                    i !== idx,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <InputError message={errors.speakers} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="px-5 sm:px-8">
                            <CardTitle>Partners</CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 sm:px-8">
                            <div className="flex items-center justify-between gap-3">
                                <div className="text-sm text-muted-foreground">
                                    Partner name, website, and optional logo.
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditingPartnerIndex(null);
                                        setPartnerDraft({
                                            name: '',
                                            url: '',
                                            logo: null,
                                            logo_path: null,
                                            logo_url: null,
                                        });
                                        setPartnerModalOpen(true);
                                    }}
                                >
                                    Add partner
                                </Button>
                            </div>

                            <div className="mt-4 space-y-2">
                                {(data.partners ?? []).length === 0 ? (
                                    <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                                        No partners yet.
                                    </div>
                                ) : (
                                    (data.partners ?? []).map((p, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted ring-1 ring-border">
                                                    <PartnerListLogo
                                                        partner={p}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-semibold text-foreground">
                                                        {p?.name ?? '—'}
                                                    </div>
                                                    <div className="truncate text-xs text-muted-foreground">
                                                        {p?.url ?? '—'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    className="text-xs font-semibold text-beta-blue hover:underline"
                                                    onClick={() => {
                                                        setEditingPartnerIndex(
                                                            idx,
                                                        );
                                                        setPartnerDraft({
                                                            name: p?.name ?? '',
                                                            url: p?.url ?? '',
                                                            logo: null,
                                                            logo_path:
                                                                p?.logo_path ??
                                                                null,
                                                            logo_url:
                                                                p?.logo_url ??
                                                                null,
                                                        });
                                                        setPartnerModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="text-xs font-semibold text-alpha-danger hover:underline"
                                                    onClick={() =>
                                                        setData(
                                                            'partners',
                                                            (
                                                                data.partners ??
                                                                []
                                                            ).filter(
                                                                (_, i) =>
                                                                    i !== idx,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <InputError message={errors.partners} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog
                open={speakerModalOpen}
                onOpenChange={(open) => !open && setSpeakerModalOpen(false)}
            >
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader className="text-left">
                        <DialogTitle>
                            {editingSpeakerIndex === null
                                ? 'Add speaker'
                                : 'Edit speaker'}
                        </DialogTitle>
                        <DialogDescription>
                            Enter speaker details manually.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full name *</Label>
                            <Input
                                value={speakerDraft.full_name}
                                onChange={(e) =>
                                    setSpeakerDraft((s) => ({
                                        ...s,
                                        full_name: e.target.value,
                                    }))
                                }
                                placeholder="e.g. Amina Benali"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role (optional)</Label>
                            <Input
                                value={speakerDraft.role}
                                onChange={(e) =>
                                    setSpeakerDraft((s) => ({
                                        ...s,
                                        role: e.target.value,
                                    }))
                                }
                                placeholder="e.g. Cybersecurity Specialist"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email (optional)</Label>
                            <Input
                                type="email"
                                value={speakerDraft.email}
                                onChange={(e) =>
                                    setSpeakerDraft((s) => ({
                                        ...s,
                                        email: e.target.value,
                                    }))
                                }
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Photo (optional)</Label>
                            <div className="flex flex-wrap items-center gap-4">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="cursor-pointer"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0] ?? null;
                                        setSpeakerDraft((s) => ({
                                            ...s,
                                            photo: f,
                                            ...(f
                                                ? {
                                                      photo_path: null,
                                                      photo_url: null,
                                                  }
                                                : {}),
                                        }));
                                    }}
                                />
                                {(speakerPreviewUrl ||
                                    speakerDraft.photo_url) && (
                                    <div className="h-14 w-14 overflow-hidden rounded-full ring-1 ring-border">
                                        <img
                                            src={
                                                speakerPreviewUrl ??
                                                speakerDraft.photo_url ??
                                                ''
                                            }
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSpeakerModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="bg-beta-blue text-twhite hover:bg-beta-blue/90"
                                onClick={() => {
                                    const fullName = (
                                        speakerDraft.full_name ?? ''
                                    ).trim();
                                    if (!fullName) return;
                                    const next = [...(data.speakers ?? [])];
                                    const payload = {
                                        full_name: fullName,
                                        role: (speakerDraft.role ?? '').trim(),
                                        email: (
                                            speakerDraft.email ?? ''
                                        ).trim(),
                                    };
                                    if (speakerDraft.photo) {
                                        payload.photo = speakerDraft.photo;
                                    } else if (speakerDraft.photo_path) {
                                        payload.photo_path =
                                            speakerDraft.photo_path;
                                    }
                                    if (editingSpeakerIndex === null) {
                                        next.push(payload);
                                    } else {
                                        next[editingSpeakerIndex] = payload;
                                    }
                                    setData('speakers', next);
                                    setSpeakerModalOpen(false);
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog
                open={partnerModalOpen}
                onOpenChange={(open) => !open && setPartnerModalOpen(false)}
            >
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader className="text-left">
                        <DialogTitle>
                            {editingPartnerIndex === null
                                ? 'Add partner'
                                : 'Edit partner'}
                        </DialogTitle>
                        <DialogDescription>
                            Enter partner details manually.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input
                                value={partnerDraft.name}
                                onChange={(e) =>
                                    setPartnerDraft((p) => ({
                                        ...p,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="e.g. 2M Media"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Website (optional)</Label>
                            <Input
                                value={partnerDraft.url}
                                onChange={(e) =>
                                    setPartnerDraft((p) => ({
                                        ...p,
                                        url: e.target.value,
                                    }))
                                }
                                placeholder="https://…"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Logo (optional)</Label>
                            <div className="flex flex-wrap items-center gap-4">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="cursor-pointer"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0] ?? null;
                                        setPartnerDraft((p) => ({
                                            ...p,
                                            logo: f,
                                            ...(f
                                                ? {
                                                      logo_path: null,
                                                      logo_url: null,
                                                  }
                                                : {}),
                                        }));
                                    }}
                                />
                                {(partnerPreviewUrl ||
                                    partnerDraft.logo_url) && (
                                    <div className="flex h-14 w-24 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
                                        <img
                                            src={
                                                partnerPreviewUrl ??
                                                partnerDraft.logo_url ??
                                                ''
                                            }
                                            alt=""
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setPartnerModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="bg-beta-blue text-twhite hover:bg-beta-blue/90"
                                onClick={() => {
                                    const name = (
                                        partnerDraft.name ?? ''
                                    ).trim();
                                    if (!name) return;
                                    const next = [...(data.partners ?? [])];
                                    const payload = {
                                        name,
                                        url: (partnerDraft.url ?? '').trim(),
                                    };
                                    if (partnerDraft.logo) {
                                        payload.logo = partnerDraft.logo;
                                    } else if (partnerDraft.logo_path) {
                                        payload.logo_path =
                                            partnerDraft.logo_path;
                                    }
                                    if (editingPartnerIndex === null) {
                                        next.push(payload);
                                    } else {
                                        next[editingPartnerIndex] = payload;
                                    }
                                    setData('partners', next);
                                    setPartnerModalOpen(false);
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog
                open={agendaModalOpen}
                onOpenChange={(open) => !open && setAgendaModalOpen(false)}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader className="text-left">
                        <DialogTitle>
                            {editingAgendaIndex === null
                                ? 'Add agenda item'
                                : 'Edit agenda item'}
                        </DialogTitle>
                        <DialogDescription>
                            Time (e.g. 18:00) and session title as shown on the
                            public event page.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input
                                type="time"
                                value={agendaDraft.time ?? ''}
                                onChange={(e) =>
                                    setAgendaDraft((d) => ({
                                        ...d,
                                        time: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Title *</Label>
                            <Input
                                value={agendaDraft.label}
                                onChange={(e) =>
                                    setAgendaDraft((d) => ({
                                        ...d,
                                        label: e.target.value,
                                    }))
                                }
                                placeholder="e.g. Opening remarks"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAgendaModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="bg-beta-blue text-twhite hover:bg-beta-blue/90"
                                onClick={() => {
                                    const label = (
                                        agendaDraft.label ?? ''
                                    ).trim();
                                    if (!label) return;
                                    const time = (
                                        agendaDraft.time ?? ''
                                    ).trim();
                                    const displayTime =
                                        time.length >= 5
                                            ? time.slice(0, 5)
                                            : time;
                                    const items = [
                                        ...(data.agenda?.items ?? []),
                                    ];
                                    const row = {
                                        time: displayTime,
                                        label,
                                    };
                                    if (editingAgendaIndex === null) {
                                        items.push(row);
                                    } else {
                                        items[editingAgendaIndex] = row;
                                    }
                                    setData('agenda', {
                                        title:
                                            (data.agenda?.title ?? '').trim() ||
                                            'Agenda',
                                        items,
                                    });
                                    setAgendaModalOpen(false);
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </form>
    );
}
