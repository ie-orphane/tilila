import React, { useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '@/contexts/TranslationContext';
import TransText from '@/components/TransText';

function formatDateLabel(iso, appLocale) {
    try {
        const tag =
            appLocale === 'ar' ? 'ar' : appLocale === 'fr' ? 'fr-FR' : 'en-US';
        const d = new Date(iso);
        return d.toLocaleDateString(tag, {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });
    } catch {
        return iso;
    }
}

function monthShort(iso, appLocale) {
    try {
        const tag =
            appLocale === 'ar' ? 'ar' : appLocale === 'fr' ? 'fr-FR' : 'en-US';
        return new Date(iso).toLocaleDateString(tag, { month: 'short' });
    } catch {
        return '';
    }
}

function day2(iso, appLocale) {
    try {
        const tag =
            appLocale === 'ar' ? 'ar' : appLocale === 'fr' ? 'fr-FR' : 'en-US';
        return new Date(iso).toLocaleDateString(tag, { day: '2-digit' });
    } catch {
        return '';
    }
}

function Badge({ children, tone = 'blue' }) {
    const cls =
        tone === 'green'
            ? 'bg-beta-green text-alpha-green'
            : tone === 'muted'
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-alpha-blue text-beta-blue';

    return (
        <span
            className={[
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-border',
                cls,
            ].join(' ')}
        >
            {children}
        </span>
    );
}

function LiveIndicator({ locale }) {
    const label =
        locale === 'ar' ? 'مباشر' : locale === 'fr' ? 'EN DIRECT' : 'LIVE';
    return (
        <div
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold tracking-wide text-white uppercase shadow-sm ring-1 ring-red-800/30"
            role="status"
            aria-live="polite"
        >
            <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-200 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            {label}
        </div>
    );
}

function eventHref(event) {
    const raw = event?.cta?.href;
    if (raw && raw !== '#') {
        return raw;
    }

    return event?.id ? `/events/${event.id}` : '#';
}

function ctaLabel(cta, locale, fallback) {
    return locale === 'ar'
        ? cta?.label?.ar
        : locale === 'fr'
          ? cta?.label?.fr
          : (cta?.label?.en ?? fallback);
}

function ctaToneClass(kind) {
    if (kind === 'primary') {
        return 'bg-beta-blue text-white group-hover:opacity-90';
    }
    if (kind === 'ghost') {
        return 'bg-background text-beta-blue';
    }
    if (kind === 'muted') {
        return 'bg-secondary text-secondary-foreground';
    }

    return 'bg-background text-foreground';
}

export default function EventCard({ event, activeTab }) {
    const { locale, t } = useTranslation();
    const dateLabel = useMemo(
        () => formatDateLabel(event?.dateIso ?? '', locale),
        [event, locale],
    );
    const leftMonth = useMemo(
        () => monthShort(event?.dateIso ?? '', locale),
        [event, locale],
    );
    const leftDay = useMemo(
        () => day2(event?.dateIso ?? '', locale),
        [event, locale],
    );

    const isFeatured = Boolean(event?.imageSrc);
    const showLeftDate = !isFeatured;

    const subtitle = [
        locale === 'ar'
            ? event?.location?.ar
            : locale === 'fr'
              ? event?.location?.fr
              : event?.location?.en,
        event?.isOnline ? t('events.labels.andOnline') : null,
    ].filter(Boolean);

    const isLive = (event?.status ?? '') === 'live';
    const href = eventHref(event);
    const ctaKind = event?.cta?.kind ?? 'secondary';

    return (
        <Link
            href={href}
            className={[
                'group block overflow-hidden rounded-2xl bg-card shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beta-blue',
                isLive
                    ? 'shadow-md ring-2 shadow-red-500/10 ring-red-500/70'
                    : 'ring-border',
            ].join(' ')}
        >
            <div className="grid grid-cols-1 gap-0 md:grid-cols-12">
                {isFeatured ? (
                    <div className="md:col-span-5">
                        <div className="relative h-full min-h-44 bg-muted md:min-h-full">
                            <img
                                src={event.imageSrc}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-tblack/60 via-tblack/15 to-transparent" />
                            <div className="absolute top-4 left-4">
                                <Badge tone="blue">
                                    {locale === 'ar'
                                        ? event?.badge?.ar
                                        : locale === 'fr'
                                          ? event?.badge?.fr
                                          : (event?.badge?.en ??
                                            t('events.labels.event'))}
                                </Badge>
                            </div>
                            {isLive ? (
                                <div className="absolute top-4 right-4">
                                    <LiveIndicator locale={locale} />
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}

                <div
                    className={[
                        isFeatured ? 'md:col-span-7' : 'md:col-span-12',
                        'p-5 sm:p-6',
                    ].join(' ')}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                {isLive && !isFeatured ? (
                                    <LiveIndicator locale={locale} />
                                ) : null}
                                {!isFeatured && event?.badge ? (
                                    <Badge
                                        tone={
                                            activeTab === 'past'
                                                ? 'muted'
                                                : 'blue'
                                        }
                                    >
                                        {locale === 'ar'
                                            ? event.badge.ar
                                            : locale === 'fr'
                                              ? event.badge.fr
                                              : event.badge.en}
                                    </Badge>
                                ) : null}
                                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                    <span className="inline-flex items-center gap-1">
                                        <span aria-hidden="true">🗓</span>
                                        {dateLabel}
                                    </span>
                                    {event?.startTime ? (
                                        <span className="inline-flex items-center gap-1">
                                            <span aria-hidden="true">⏱</span>
                                            {event.startTime}
                                            {event?.endTime
                                                ? ` – ${event.endTime}`
                                                : null}{' '}
                                            {event?.tzLabel
                                                ? `(${event.tzLabel})`
                                                : null}
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <h3 className="mt-3 text-base font-extrabold text-foreground group-hover:text-beta-blue sm:text-lg">
                                <TransText
                                    en={event?.title?.en}
                                    fr={event?.title?.fr}
                                    ar={event?.title?.ar}
                                />
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                <TransText
                                    en={event?.excerpt?.en}
                                    fr={event?.excerpt?.fr}
                                    ar={event?.excerpt?.ar}
                                />
                            </p>
                        </div>

                        {showLeftDate ? (
                            <div className="hidden shrink-0 text-center md:block">
                                <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                    {leftMonth}
                                </div>
                                <div className="mt-1 text-2xl font-extrabold text-foreground">
                                    {leftDay}
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-xs font-semibold text-muted-foreground">
                            {subtitle.join(' • ')}
                        </div>
                        <div className="flex items-center gap-2">
                            {event?.categoryLabel ? (
                                <Badge tone="muted">
                                    {locale === 'ar'
                                        ? event.categoryLabel.ar
                                        : locale === 'fr'
                                          ? event.categoryLabel.fr
                                          : event.categoryLabel.en}
                                </Badge>
                            ) : null}
                            <span
                                className={[
                                    'inline-flex items-center justify-center rounded-md px-4 py-2 text-xs font-semibold shadow-sm ring-1 ring-border',
                                    ctaToneClass(ctaKind),
                                ].join(' ')}
                            >
                                {ctaLabel(
                                    event?.cta,
                                    locale,
                                    t('events.actions.view'),
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
