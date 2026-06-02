import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';
import { cn } from '@/lib/utils';

/** Hero slide keys used for pillar imagery (Learn uses Tililab creative visual). */
const PILLAR_SLIDE_KEY = {
    '/about': 'about',
    '/events': 'events',
    '/experts': 'experts',
    '/learn': 'tililab',
};

const PILLARS = [
    {
        href: '/about',
        enTitle: 'About',
        frTitle: 'À propos',
        arTitle: 'حول',
        enSub: 'Vision · Mission · Impact',
        frSub: 'Vision · Mission · Impact',
        arSub: 'رؤية · رسالة · أثر',
    },
    {
        href: '/events',
        enTitle: 'Tilila Events',
        frTitle: 'Événements Tilila',
        arTitle: 'فعاليات تيليلا',
        enSub: 'Awards · Tililab · Talks',
        frSub: 'Awards · Tililab · Talks',
        arSub: 'جوائز · تيليلاب · نقاشات',
    },
    {
        href: '/experts',
        enTitle: 'Tilila Experts',
        frTitle: 'Expertes Tilila',
        arTitle: 'خبيرات تيليلا',
        enSub: 'Directory · Connect · Media',
        frSub: 'Annuaire · Connect · Média',
        arSub: 'دليل · تواصل · إعلام',
    },
    {
        href: '/learn',
        enTitle: 'Tilila Learn',
        frTitle: 'Tilila Learn',
        arTitle: 'تعلم تيليلا',
        enSub: 'Academy · Jobs · Agenda',
        frSub: 'Academy · Offres · Agenda',
        arSub: 'أكاديمية · فرص · أجندة',
    },
];

function pickAlt(altObj, locale) {
    if (!altObj || typeof altObj !== 'object') return '';
    return (
        (locale === 'ar' ? altObj.ar : locale === 'fr' ? altObj.fr : altObj.en) ??
        altObj.en ??
        ''
    );
}

function getPillarVisual(href, slides) {
    const key = PILLAR_SLIDE_KEY[href];
    const slide = (slides ?? []).find((s) => s.key === key);
    return {
        src: slide?.imageSrc ?? '/assets/hero.png',
        imageAlt: slide?.imageAlt,
    };
}

export default function PillarTiles() {
    const { locale } = useTranslation();
    const slides = usePage().props.hero_slides ?? [];

    return (
        <section className="bg-background">
            <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                        <TransText
                            en="Explore Tilila"
                            fr="Explorer Tilila"
                            ar="استكشف تيليلا"
                        />
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        <TransText
                            en="Four entry points into our mission—each one opens a dedicated space on the site."
                            fr="Quatre portes d’entrée vers notre mission—chacune ouvre un espace dédié sur le site."
                            ar="أربعة مداخل إلى مهمتنا—كل منها يفتح مساحة مخصصة في الموقع."
                        />
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {PILLARS.map((p) => {
                        const { src, imageAlt } = getPillarVisual(p.href, slides);
                        const alt = pickAlt(imageAlt, locale);

                        return (
                            <Link
                                key={p.href}
                                href={p.href}
                                className={cn(
                                    'group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-border/80',
                                    'transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-beta-blue/25',
                                )}
                            >
                                <div className="relative aspect-5/4 w-full overflow-hidden bg-muted sm:aspect-4/3">
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div
                                        className="pointer-events-none absolute inset-0 bg-linear-to-t from-tblack/55 via-tblack/10 to-transparent"
                                        aria-hidden
                                    />
                                    <div
                                        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-tblack/10"
                                        aria-hidden
                                    />
                                </div>

                                <div className="flex flex-1 flex-col p-5 pt-4">
                                    <h3 className="text-lg font-bold text-foreground visited:text-foreground group-hover:text-beta-blue">
                                        <TransText
                                            en={p.enTitle}
                                            fr={p.frTitle}
                                            ar={p.arTitle}
                                        />
                                    </h3>
                                    <p className="mt-2 text-xs font-medium leading-relaxed text-muted-foreground">
                                        <TransText
                                            en={p.enSub}
                                            fr={p.frSub}
                                            ar={p.arSub}
                                        />
                                    </p>
                                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-beta-blue">
                                        <TransText
                                            en="Explore"
                                            fr="Découvrir"
                                            ar="استكشف"
                                        />
                                        <span
                                            className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180"
                                            aria-hidden
                                        >
                                            →
                                        </span>
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
