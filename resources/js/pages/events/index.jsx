import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import EventsHub from '@/pages/events/Partials/EventsHub';
import EventsTabs from '@/pages/events/Partials/EventsTabs';
import EventsSidebar from '@/pages/events/Partials/EventsSidebar';
import EventCard from '@/pages/events/Partials/EventCard';
import TiliTalksLanding from '@/pages/events/Partials/TiliTalksLanding';
import { useTranslation } from '@/contexts/TranslationContext';
import TransText from '@/components/TransText';

function isPastEvent(event) {
    const iso = event?.dateTimeIso ?? event?.dateIso ?? '';
    const ts = new Date(iso).getTime();
    if (Number.isNaN(ts)) {
        return false;
    }
    return ts < Date.now();
}

/** Map DB types to top-level IA categories (Awards | Tililab | TiliTalks). */
function categoryKeyForFilter(type) {
    const t = String(type ?? '').toLowerCase();

    if (t === 'tililab') return 'tililab';

    // Awards (historically stored as "trophy" in our DB).
    if (t === 'trophy' || t === 'awards' || t === 'tilila-awards') {
        return 'awards';
    }

    // Everything else is treated as a public conversation / session.
    // Includes: tilitalk, talk, webinar, workshop, other...
    return 'tilitalks';
}

function panelFromUrl(url, fallback) {
    const q = url.includes('?') ? url.split('?')[1] : '';
    const v = new URLSearchParams(q).get('view');
    if (v === 'calendar') {
        return 'calendar';
    }
    if (v === 'tilitalks') {
        return 'tilitalks';
    }
    if (v === 'hub') {
        return 'hub';
    }
    return fallback;
}

export default function EventsIndex({
    events = [],
    eventStatuses = [],
    eventsByYear = {},
    eventsInitialPanel = 'hub',
}) {
    const { t } = useTranslation();
    const { url } = usePage();
    const topPanel = panelFromUrl(url, eventsInitialPanel);
    const [activeTab, setActiveTab] = useState(() => {
        const all = events ?? [];
        const upcomingCount = all.filter((e) => !isPastEvent(e)).length;
        return upcomingCount > 0 ? 'upcoming' : 'past';
    });
    const [selectedDayIso, setSelectedDayIso] = useState(null);
    const [categories, setCategories] = useState({
        awards: true,
        tililab: true,
        tilitalks: true,
    });

    const [statusFilters, setStatusFilters] = useState(() =>
        Object.fromEntries(
            (eventStatuses?.length
                ? eventStatuses
                : ['upcoming', 'live', 'finished', 'archived']
            ).map((s) => [s, true]),
        ),
    );

    const counts = useMemo(() => {
        const all = events ?? [];
        const upcoming = all.filter((e) => !isPastEvent(e)).length;
        const past = all.filter((e) => isPastEvent(e)).length;
        return { upcoming, past };
    }, [events]);

    const filteredEvents = useMemo(() => {
        const all = events ?? [];

        let list = all.filter((e) => {
            const cat = categoryKeyForFilter(e?.type);
            return Boolean(categories[cat]);
        });

        list = list.filter((e) => {
            const st = e?.status ?? 'upcoming';
            return statusFilters[st] !== false;
        });

        if (selectedDayIso) {
            list = list.filter((e) => (e?.dateIso ?? '') === selectedDayIso);
        }

        const wantsPast = activeTab === 'past';
        list = list.filter((e) =>
            wantsPast ? isPastEvent(e) : !isPastEvent(e),
        );

        list = [...list].sort((a, b) => {
            const aLive = (a?.status ?? '') === 'live';
            const bLive = (b?.status ?? '') === 'live';
            if (aLive !== bLive) {
                return aLive ? -1 : 1;
            }
            const at = new Date(a?.dateTimeIso ?? '').getTime();
            const bt = new Date(b?.dateTimeIso ?? '').getTime();
            return wantsPast ? bt - at : at - bt;
        });

        return list;
    }, [activeTab, categories, events, selectedDayIso, statusFilters]);

    return (
        <>
            <Head title={t('events.headTitle')} />

            <div>
                <div className="bg-beta-white py-8 sm:py-10">
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <header className="mx-auto max-w-3xl text-center">
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                <TransText
                                    en="TILILA EVENTS"
                                    fr="ÉVÉNEMENTS TILILA"
                                    ar="فعاليات تيليلا"
                                />
                            </h1>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                <TransText
                                    en="Awards, Tililab, and the public events calendar."
                                    fr="Awards, Tililab, TiliTalks et le calendrier annuel."
                                    ar="الجوائز وتيليلاب وتيلي توكس والتقويم السنوي."
                                />
                            </p>
{/* 
                            <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
                                <Link
                                    href="/events?view=hub"
                                    className={[
                                        'inline-block cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition',
                                        topPanel === 'hub'
                                            ? 'bg-beta-blue text-white'
                                            : 'text-muted-foreground hover:text-foreground',
                                    ].join(' ')}
                                >
                                    <TransText en="Hub" fr="Hub" ar="البوابة" />
                                </Link>
                                <Link
                                    href="/events?view=tilitalks"
                                    className={[
                                        'inline-block cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition',
                                        topPanel === 'tilitalks'
                                            ? 'bg-beta-blue text-white'
                                            : 'text-muted-foreground hover:text-foreground',
                                    ].join(' ')}
                                >
                                    <TransText
                                        en="TiliTalks"
                                        fr="TiliTalks"
                                        ar="تيلي توكس"
                                    />
                                </Link>
                                <Link
                                    href="/events?view=calendar"
                                    className={[
                                        'inline-block cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition',
                                        topPanel === 'calendar'
                                            ? 'bg-beta-blue text-white'
                                            : 'text-muted-foreground hover:text-foreground',
                                    ].join(' ')}
                                >
                                    <TransText
                                        en="Agenda"
                                        fr="Agenda"
                                        ar="الأجندة"
                                    />
                                </Link>
                            </div> */}

                            {topPanel === 'calendar' ? (
                                <div className="mt-8 flex justify-center">
                                    <EventsTabs
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        counts={counts}
                                    />
                                </div>
                            ) : null}
                        </header>
                    </div>
                </div>

                {topPanel === 'hub' ? (
                    <div className="bg-twhite py-12">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <EventsHub eventsByYear={eventsByYear} />
                        </div>
                    </div>
                ) : null}

                {topPanel === 'tilitalks' ? (
                    <div className="bg-twhite py-12">
                        <TiliTalksLanding />
                    </div>
                ) : null}

                {topPanel === 'calendar' ? (
                    <div className="bg-twhite py-10">
                        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            <div className="lg:col-span-4 xl:col-span-3">
                                <EventsSidebar
                                    categories={categories}
                                    setCategories={setCategories}
                                    selectedDayIso={selectedDayIso}
                                    setSelectedDayIso={setSelectedDayIso}
                                    events={events}
                                    eventStatuses={
                                        eventStatuses?.length
                                            ? eventStatuses
                                            : [
                                                  'upcoming',
                                                  'live',
                                                  'finished',
                                                  'archived',
                                              ]
                                    }
                                    statusFilters={statusFilters}
                                    setStatusFilters={setStatusFilters}
                                />
                            </div>

                            <div className="lg:col-span-8 xl:col-span-9">
                                <div className="space-y-4">
                                    {filteredEvents.map((event) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            activeTab={activeTab}
                                        />
                                    ))}
                                </div>

                                {filteredEvents.length === 0 ? (
                                    <div className="mt-6 rounded-2xl bg-card p-8 text-center shadow-sm ring-1 ring-border">
                                        <div className="text-sm font-semibold text-foreground">
                                            <TransText
                                                en="No events found"
                                                fr="Aucun événement trouvé"
                                                ar="لا توجد فعاليات"
                                            />
                                        </div>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            <TransText
                                                en="Try adjusting categories, status filters, or the selected date."
                                                fr="Essayez de modifier les catégories, les statuts ou la date sélectionnée."
                                                ar="جرّب تعديل الفئات أو حالات الفعالية أو التاريخ المحدد."
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}

EventsIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
