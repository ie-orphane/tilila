import { useForm } from '@inertiajs/react';
import { Check, Send, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

import InputError from '@/components/input-error';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const AUDIENCE_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'ar', label: 'Arabic' },
];

function countForLocale(stats, locale) {
    if (!stats) {
        return 0;
    }

    switch (locale) {
        case 'en':
            return stats.en ?? 0;
        case 'fr':
            return stats.fr ?? 0;
        case 'ar':
            return stats.ar ?? 0;
        default:
            return stats.total ?? 0;
    }
}

function audienceCountForLocales(stats, locales) {
    if (!stats || !locales?.length) {
        return 0;
    }

    if (locales.includes('all')) {
        return stats.total ?? 0;
    }

    return locales.reduce(
        (sum, locale) => sum + countForLocale(stats, locale),
        0,
    );
}

function audienceLabelForLocales(locales) {
    if (!locales?.length || locales.includes('all')) {
        return 'All subscribers';
    }

    const labels = locales
        .map(
            (value) =>
                AUDIENCE_OPTIONS.find((o) => o.value === value)?.label ?? value,
        )
        .filter(Boolean);

    return labels.join(', ');
}

function isAudienceActive(locales, value) {
    if (value === 'all') {
        return locales.includes('all');
    }

    return !locales.includes('all') && locales.includes(value);
}

export default function NewsletterComposeForm({
    stats = {},
    className,
}) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        body: '',
        locales: ['all'],
    });

    const recipients = audienceCountForLocales(stats, data.locales);
    const audienceLabel = useMemo(
        () => audienceLabelForLocales(data.locales),
        [data.locales],
    );

    const bodyLength = data.body.length;
    const canSend =
        data.subject.trim().length > 0 &&
        data.body.trim().length > 0 &&
        data.locales.length > 0 &&
        recipients > 0;

    const toggleAudience = (value) => {
        if (value === 'all') {
            setData('locales', ['all']);
            return;
        }

        let next = data.locales.filter((l) => l !== 'all');

        if (next.includes(value)) {
            next = next.filter((l) => l !== value);
        } else {
            next = [...next, value];
        }

        if (next.length === 0) {
            next = ['all'];
        }

        setData('locales', next);
    };

    const submitSend = () => {
        post('/admin/newsletter/send', {
            preserveScroll: true,
            onSuccess: () => {
                reset('subject', 'body');
                setData('locales', ['all']);
                setConfirmOpen(false);
            },
        });
    };

    return (
        <>
            <section
                className={cn(
                    'overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm',
                    className,
                )}
            >
                <div className="border-b border-border/60 px-5 py-4 sm:px-6">
                    <h2 className="text-base font-semibold text-tblack">
                        Compose campaign
                    </h2>
                    <p className="mt-0.5 text-sm text-tgray">
                        Draft your message and pick your audience. Choosing a
                        language deselects <strong className="text-tblack">All</strong>;
                        choosing <strong className="text-tblack">All</strong>{' '}
                        clears the others.
                    </p>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                    <div className="space-y-2">
                        <Label htmlFor="newsletter-subject">Subject</Label>
                        <Input
                            id="newsletter-subject"
                            value={data.subject}
                            onChange={(e) =>
                                setData('subject', e.target.value)
                            }
                            placeholder="e.g. This week on TILILA"
                            maxLength={255}
                        />
                        <InputError message={errors.subject} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <Label htmlFor="newsletter-body">Message</Label>
                            <span className="text-xs tabular-nums text-tgray">
                                {bodyLength} / 50 000
                            </span>
                        </div>
                        <textarea
                            id="newsletter-body"
                            rows={8}
                            className={cn(
                                'flex min-h-[180px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground',
                                'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                            )}
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            placeholder="Write your newsletter. Line breaks are preserved in the email."
                        />
                        <InputError message={errors.body} />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <Label>Audience</Label>
                            {!data.locales.includes('all') &&
                            data.locales.length > 0 ? (
                                <button
                                    type="button"
                                    className="text-xs font-medium text-beta-blue hover:underline"
                                    onClick={() => setData('locales', ['all'])}
                                >
                                    Select all
                                </button>
                            ) : null}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {AUDIENCE_OPTIONS.map((opt) => {
                                const active = isAudienceActive(
                                    data.locales,
                                    opt.value,
                                );
                                const count =
                                    opt.value === 'all'
                                        ? countForLocale(stats, 'all')
                                        : countForLocale(stats, opt.value);

                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() =>
                                            toggleAudience(opt.value)
                                        }
                                        className={cn(
                                            'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                                            active
                                                ? 'border-beta-blue bg-beta-blue/10 font-semibold text-beta-blue'
                                                : 'border-border bg-beta-white text-tgray hover:border-beta-blue/40 hover:text-tblack',
                                        )}
                                        aria-pressed={active}
                                    >
                                        {active ? (
                                            <Check
                                                className="size-3.5 shrink-0"
                                                aria-hidden
                                            />
                                        ) : null}
                                        <span>{opt.label}</span>
                                        <span
                                            className={cn(
                                                'rounded-md px-1.5 py-0.5 text-xs tabular-nums',
                                                active
                                                    ? 'bg-beta-blue/15'
                                                    : 'bg-muted',
                                            )}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <InputError
                            message={
                                errors.locales ??
                                errors['locales.0']
                            }
                        />

                        {data.locales.includes('all') ? (
                            <p className="text-xs text-tgray">
                                All subscribers are selected. Click English,
                                French, or Arabic to switch to specific
                                locales — All will be deselected automatically.
                            </p>
                        ) : null}

                        {recipients === 0 ? (
                            <p className="text-xs text-alpha-danger">
                                No subscribers in this audience. Choose another
                                segment or wait for new sign-ups.
                            </p>
                        ) : (
                            <p className="flex items-center gap-1.5 text-xs text-tgray">
                                <Users className="size-3.5 shrink-0" />
                                {recipients} recipient
                                {recipients === 1 ? '' : 's'} will receive this
                                email
                                {!data.locales.includes('all')
                                    ? ` (${audienceLabel})`
                                    : ''}
                                .
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-border/60 bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-xs text-tgray">
                        Sends immediately to the selected audience. This cannot
                        be undone.
                    </p>
                    <Button
                        type="button"
                        className="gap-2 bg-beta-blue text-twhite hover:bg-beta-blue/90 sm:shrink-0"
                        disabled={processing || !canSend}
                        onClick={() => setConfirmOpen(true)}
                    >
                        <Send className="size-4" />
                        {processing ? 'Sending…' : 'Send newsletter'}
                    </Button>
                </div>
            </section>

            <ConfirmationModal
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Send this newsletter?"
                description={
                    <>
                        You are about to email <strong>{audienceLabel}</strong>{' '}
                        ({recipients} recipient{recipients === 1 ? '' : 's'}).
                    </>
                }
                confirmLabel="Confirm send"
                onConfirm={submitSend}
                processing={processing}
                confirmVariant="primary"
            >
                <p className="rounded-md border border-border bg-muted/40 px-3 py-2 font-medium text-foreground">
                    {data.subject}
                </p>
            </ConfirmationModal>
        </>
    );
}
