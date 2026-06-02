import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';
import { cn } from '@/lib/utils';

const AUTOPLAY_MS = 6500;


export function isHomeHeroPath(pathname) {
    const path = (pathname || '/').replace(/\/$/, '') || '/';
    return path === '/';
}

export function getSlideForPath(pathname, slides) {
    const path = (pathname || '/').replace(/\/$/, '') || '/';

    return (
        (slides ?? []).find((slide) => {
            const prefix = slide.pathPrefix;
            if (!prefix) return false;
            const norm = prefix.replace(/\/$/, '') || '/';
            if (norm === '/') return path === '/';
            return path === norm || path.startsWith(`${norm}/`);
        }) ?? null
    );
}

/** @deprecated Use getSlideForPath — kept for any existing imports */
export function getInitialSlideIndex(pathname, slides) {
    const slide = getSlideForPath(pathname, slides);
    if (!slide) return 0;
    const index = (slides ?? []).findIndex((s) => s.key === slide.key);
    return index >= 0 ? index : 0;
}

export function shouldShowHeroCarousel(pathname, slides) {
    const path = pathname || '/';

    if (
        path.startsWith('/admin') ||
        path.startsWith('/expert/') ||
        path.startsWith('/settings')
    ) {
        return false;
    }

    if (/^\/events\/[^/]+/.test(path)) return false;
    if (/^\/media\/[^/]+/.test(path)) return false;
    if (/^\/opportunities\/[^/]+/.test(path)) return false;

    if (/^\/experts\/[^/]+/.test(path)) {
        return false;
    }

    if (path.startsWith('/tilila/')) {
        return false;
    }

    if (path === '/tililab/form') {
        return false;
    }

    return getSlideForPath(path, slides) !== null;
}

function pickLocalizedTriple(obj, locale) {
    return (
        (locale === 'ar' ? obj.ar : locale === 'fr' ? obj.fr : obj.en) ??
        obj.en ??
        ''
    );
}

function heroImageClasses(slide) {
    if (slide?.bannerImage) {
        if (slide?.bannerImageContain) {
            return cn(
                'absolute inset-0 h-full w-full object-contain p-4 sm:p-6 lg:p-8',
                slide?.imagePosition === 'right'
                    ? 'object-right'
                    : 'object-center',
            );
        }

        return 'absolute inset-0 h-full w-full object-cover object-center';
    }

    const imageContain = Boolean(slide?.imageContain);
    return cn(
        'absolute inset-0 h-full w-full',
        imageContain
            ? cn(
                  'object-contain p-6 sm:p-8 lg:p-10',
                  slide?.imagePosition === 'right'
                      ? 'object-right'
                      : 'object-center',
              )
            : 'object-cover object-center',
    );
}

function CtaButtons({ ctas, isActive }) {
    const activeCtas = (ctas ?? []).filter((c) => c.is_active !== false);
    if (!activeCtas.length) return null;

    return (
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            {activeCtas.map((cta, i) => {
                const isPrimary = cta.style === 'primary';
                return (
                    <Link
                        key={i}
                        href={cta.url ?? '#'}
                        tabIndex={isActive !== undefined ? (isActive ? 0 : -1) : undefined}
                        className={
                            isPrimary
                                ? 'inline-flex w-full items-center justify-center rounded-xl bg-beta-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-tblack/30 transition hover:bg-beta-blue/90 sm:w-auto'
                                : 'inline-flex w-full items-center justify-center rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:w-auto'
                        }
                    >
                        <TransText
                            en={cta.label?.en ?? ''}
                            fr={cta.label?.fr ?? ''}
                            ar={cta.label?.ar ?? ''}
                        />
                    </Link>
                );
            })}
        </div>
    );
}

function HeroSlideLayer({ slide, isActive, locale }) {
    const imageContain = Boolean(slide?.imageContain);
    const imageBg = slide?.imageBg === 'white' ? 'bg-white' : 'bg-tblack';

    return (
        <div
            className={cn(
                'absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none',
                isActive
                    ? 'z-10 opacity-100'
                    : 'pointer-events-none z-0 opacity-0',
            )}
            aria-hidden={!isActive}
        >
            <div className={cn('absolute inset-0 overflow-hidden', imageBg)}>
                {slide?.imageSrc ? (
                    <img
                        src={slide.imageSrc}
                        alt={pickLocalizedTriple(
                            slide.imageAlt ?? { en: '', fr: '', ar: '' },
                            locale,
                        )}
                        className={cn(
                            heroImageClasses(slide),
                            isActive &&
                                'motion-safe:animate-[hero-ken-burns_12s_ease-out_forwards] motion-reduce:animate-none',
                        )}
                        loading={isActive ? 'eager' : 'lazy'}
                        decoding="async"
                    />
                ) : null}
            </div>

            <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-tblack/92 via-tblack/55 to-tblack/25"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-tblack/70 via-transparent to-transparent rtl:bg-linear-to-l"
                aria-hidden
            />

            <div className="absolute  inset-0 flex flex-col justify-end ">
                <div className="mx-auto w-full max-w-[min(100%,1920px)] px-5  pt-24 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
                    <div
                        className={cn(
                            'max-w-2xl transition-all duration-700 ease-out  motion-reduce:transition-none',
                            isActive
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-3 opacity-0',
                        )}
                    >
                        <div className="mb-4 flex flex-wrap  items-center gap-2 sm:mb-5 sm:gap-3">
                            {slide?.cardKicker ? (
                                <TransText
                                    tag="p"
                                    className="text-[0.65rem] font-bold tracking-[0.2em] text-beta-blue uppercase"
                                    en={slide.cardKicker.en}
                                    fr={slide.cardKicker.fr}
                                    ar={slide.cardKicker.ar}
                                />
                            ) : null}
                            {slide?.badge ? (
                                <>
                                    <span className="text-white/40" aria-hidden>
                                        ·
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                        <span
                                            className="size-1.5 rounded-full bg-beta-blue shadow-[0_0_8px_rgba(0,151,170,0.8)]"
                                            aria-hidden
                                        />
                                        <TransText
                                            en={slide.badge.en}
                                            fr={slide.badge.fr}
                                            ar={slide.badge.ar}
                                        />
                                    </span>
                                </>
                            ) : null}
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-balance text-white sm:text-3xl lg:text-4xl lg:leading-tight xl:text-[2.75rem]">
                            <TransText
                                en={slide?.titleBefore?.en ?? ''}
                                fr={slide?.titleBefore?.fr ?? ''}
                                ar={slide?.titleBefore?.ar ?? ''}
                            />{' '}
                            <TransText
                                className="text-beta-blue"
                                en={slide?.titleAccent?.en ?? ''}
                                fr={slide?.titleAccent?.fr ?? ''}
                                ar={slide?.titleAccent?.ar ?? ''}
                            />
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:mt-4 sm:text-base lg:text-lg">
                            <TransText
                                en={slide?.description?.en ?? ''}
                                fr={slide?.description?.fr ?? ''}
                                ar={slide?.description?.ar ?? ''}
                            />
                        </p>

                        {slide?.cardLine ? (
                            <p className="mt-2 max-w-xl text-xs text-white/65 sm:text-sm">
                                <TransText
                                    en={slide.cardLine.en}
                                    fr={slide.cardLine.fr}
                                    ar={slide.cardLine.ar}
                                />
                            </p>
                        ) : null}

                        <CtaButtons ctas={slide?.ctas} isActive={isActive} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function PageHeroBanner({ slide, locale }) {
    const isBanner = Boolean(slide?.bannerImage);
    const imageBg = isBanner
        ? 'bg-muted'
        : slide?.imageBg === 'white'
          ? 'bg-white'
          : 'bg-tblack';
    const showHeadline =
        !isBanner &&
        Boolean(
            slide?.titleBefore?.en ||
            slide?.titleAccent?.en ||
            slide?.badge?.en,
        );

    if (isBanner && slide?.imageSrc) {
        const bannerBg = slide?.imageBg === 'white' ? 'bg-white' : 'bg-tblack';

        return (
            <div className="relative max-h-[42rem] min-h-[min(28rem,72vh)] overflow-hidden rounded-3xl border border-border shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18)] ring-1 ring-tblack/10">
                <div
                    className={cn('absolute inset-0 overflow-hidden', bannerBg)}
                >
                    <img
                        src={slide.imageSrc}
                        alt={pickLocalizedTriple(
                            slide.imageAlt ?? { en: '', fr: '', ar: '' },
                            locale,
                        )}
                        className={heroImageClasses(slide)}
                        loading="eager"
                        decoding="async"
                    />
                </div>
                <div
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-tblack/50 via-tblack/10 to-transparent"
                    aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 flex justify-end px-5 pb-5 sm:px-8 sm:pb-6 lg:px-12">
                    <CtaButtons ctas={slide?.ctas} />
                </div>
            </div>
        );
    }

    return (
        <div className="relative max-h-[42rem] min-h-[min(28rem,72vh)] overflow-hidden rounded-3xl border border-border shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18)] ring-1 ring-tblack/10">
            <div className={cn('absolute inset-0 overflow-hidden', imageBg)}>
                {slide?.imageSrc ? (
                    <img
                        src={slide.imageSrc}
                        alt={pickLocalizedTriple(
                            slide.imageAlt ?? { en: '', fr: '', ar: '' },
                            locale,
                        )}
                        className={cn(
                            heroImageClasses(slide),
                            'motion-safe:animate-[hero-ken-burns_12s_ease-out_forwards] motion-reduce:animate-none',
                        )}
                        loading="eager"
                        decoding="async"
                    />
                ) : null}
            </div>

            <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-tblack/92 via-tblack/55 to-tblack/25"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-tblack/70 via-transparent to-transparent rtl:bg-linear-to-l"
                aria-hidden
            />

            <div className="absolute inset-0 flex flex-col justify-end">
                <div className="mx-auto w-full max-w-[min(100%,1920px)] px-5 pt-24 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
                    <div className="max-w-2xl">
                        <>
                            <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-3">
                                {slide?.cardKicker ? (
                                    <TransText
                                        tag="p"
                                        className="text-[0.65rem] font-bold tracking-[0.2em] text-beta-blue uppercase"
                                        en={slide.cardKicker.en}
                                        fr={slide.cardKicker.fr}
                                        ar={slide.cardKicker.ar}
                                    />
                                ) : null}
                                {slide?.badge ? (
                                    <>
                                        <span
                                            className="text-white/40"
                                            aria-hidden
                                        >
                                            ·
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                            <span
                                                className="size-1.5 rounded-full bg-beta-blue shadow-[0_0_8px_rgba(0,151,170,0.8)]"
                                                aria-hidden
                                            />
                                            <TransText
                                                en={slide.badge.en}
                                                fr={slide.badge.fr}
                                                ar={slide.badge.ar}
                                            />
                                        </span>
                                    </>
                                ) : null}
                            </div>

                            {showHeadline ? (
                                <h1 className="text-2xl font-bold tracking-tight text-balance text-white sm:text-3xl lg:text-4xl lg:leading-tight xl:text-[2.75rem]">
                                    <TransText
                                        en={slide?.titleBefore?.en ?? ''}
                                        fr={slide?.titleBefore?.fr ?? ''}
                                        ar={slide?.titleBefore?.ar ?? ''}
                                    />{' '}
                                    <TransText
                                        className="text-beta-blue"
                                        en={slide?.titleAccent?.en ?? ''}
                                        fr={slide?.titleAccent?.fr ?? ''}
                                        ar={slide?.titleAccent?.ar ?? ''}
                                    />
                                </h1>
                            ) : null}

                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:mt-4 sm:text-base lg:text-lg">
                                <TransText
                                    en={slide?.description?.en ?? ''}
                                    fr={slide?.description?.fr ?? ''}
                                    ar={slide?.description?.ar ?? ''}
                                />
                            </p>

                            {slide?.cardLine ? (
                                <p className="mt-2 max-w-xl text-xs text-white/65 sm:text-sm">
                                    <TransText
                                        en={slide.cardLine.en}
                                        fr={slide.cardLine.fr}
                                        ar={slide.cardLine.ar}
                                    />
                                </p>
                            ) : null}
                        </>

                        <CtaButtons ctas={slide?.ctas} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function HomeHeroCarousel({ slides, locale }) {
    const slideCount = slides?.length ?? 0;
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [paused, setPaused] = React.useState(false);

    const safeIndex =
        slideCount > 0
            ? ((activeIndex % slideCount) + slideCount) % slideCount
            : 0;

    React.useEffect(() => {
        if (slideCount <= 1 || paused) return undefined;

        const id = window.setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slideCount);
        }, AUTOPLAY_MS);

        return () => window.clearInterval(id);
    }, [slideCount, paused]);

    const goPrev = () =>
        setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount);
    const goNext = () => setActiveIndex((prev) => (prev + 1) % slideCount);

    if (!slideCount) return null;

    return (
        <div
            className="relative mx-auto w-full max-w-7xl py-8 sm:py-10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    setPaused(false);
                }
            }}
        >
            <div
                role="region"
                aria-roledescription="carousel"
                aria-label="Featured highlights"
                className="relative max-h-[42rem] min-h-[min(28rem,72vh)] overflow-hidden rounded-3xl border border-border shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18)] ring-1 ring-tblack/10"
            >
                {slides.map((slide, index) => (
                    <HeroSlideLayer
                        key={slide.key ?? index}
                        slide={slide}
                        isActive={index === safeIndex}
                        locale={locale}
                    />
                ))}

                {slideCount > 1 ? (
                    <>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-linear-to-t from-tblack/50 to-transparent" />

                        <div className="absolute start-3 top-1/2 z-20 -translate-y-1/2 sm:start-5">
                            <button
                                type="button"
                                onClick={goPrev}
                                className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-tblack/40 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-tblack/60"
                                aria-label="Previous slide"
                            >
                                <span aria-hidden>‹</span>
                            </button>
                        </div>

                        <div className="absolute end-3 top-1/2 z-20 -translate-y-1/2 sm:end-5">
                            <button
                                type="button"
                                onClick={goNext}
                                className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-tblack/40 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-tblack/60"
                                aria-label="Next slide"
                            >
                                <span aria-hidden>›</span>
                            </button>
                        </div>

                        <div className="absolute inset-x-0 bottom-5 z-20 flex flex-col items-center gap-3 px-5">
                            <div
                                className="flex items-center gap-2"
                                role="tablist"
                                aria-label="Choose slide"
                            >
                                {slides.map((slide, index) => (
                                    <button
                                        key={slide.key ?? index}
                                        type="button"
                                        role="tab"
                                        aria-selected={index === safeIndex}
                                        onClick={() => setActiveIndex(index)}
                                        className={cn(
                                            'h-2 rounded-full ring-1 ring-white/30 transition-all',
                                            index === safeIndex
                                                ? 'w-8 bg-white'
                                                : 'w-2 bg-white/40 hover:bg-white/70',
                                        )}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default function HeroCarousel() {
    const { locale } = useTranslation();
    const { url, props } = usePage();
    const slides = props.hero_slides ?? [];

    const pathname = new URL(
        url,
        typeof window !== 'undefined'
            ? window.location.origin
            : 'http://localhost',
    ).pathname;

    const isHome = isHomeHeroPath(pathname);

    if (isHome) {
        if (!slides.length) return null;

        return (
            <section className="relative bg-background" aria-label="Home hero">
                <HomeHeroCarousel slides={slides} locale={locale} />
                <style>{`
                    @keyframes hero-ken-burns {
                        from { transform: scale(1); }
                        to { transform: scale(1.06); }
                    }
                `}</style>
            </section>
        );
    }

    const slide = getSlideForPath(pathname, slides);

    if (!slide) return null;

    return (
        <section className="relative bg-background" aria-label="Page hero">
            <div className="relative mx-auto w-full max-w-7xl py-8 sm:py-10">
                <PageHeroBanner slide={slide} locale={locale} />
            </div>

            <style>{`
                @keyframes hero-ken-burns {
                    from { transform: scale(1); }
                    to { transform: scale(1.06); }
                }
            `}</style>
        </section>
    );
}
