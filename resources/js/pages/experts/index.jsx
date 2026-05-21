import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import FiltersBar from '@/pages/experts/Partials/FiltersBar';
import ExpertOfMonthSection from '@/pages/experts/Partials/ExpertOfMonthSection';
import FeaturedExperts from '@/pages/experts/Partials/FeaturedExperts';
import ExpertCard from '@/pages/experts/Partials/ExpertCard';
import { useTranslation } from '@/contexts/TranslationContext';
import TransText from '@/components/TransText';
import {
    buildCountryOptions,
    buildLanguageOptions,
} from '@/components/helpers/expert-form-options';

export default function ExpertsIndex({
    experts: expertsProp = [],
    featuredExperts = [],
    expertOfMonth = null,
}) {
    const { locale, t } = useTranslation();
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('relevance');
    const [view, setView] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        region: 'all',
        country: 'all',
        location: 'all',
        language: 'all',
    });

    const countryOptions = useMemo(() => buildCountryOptions(locale), [locale]);
    const languageOptions = useMemo(
        () => buildLanguageOptions(locale),
        [locale],
    );

    const getCityLabel = (expert) => {
        if (!expert) {
            return '';
        }

        const cityByLocale =
            locale === 'ar'
                ? expert.city_i18n?.ar
                : locale === 'fr'
                  ? expert.city_i18n?.fr
                  : expert.city_i18n?.en;

        return (
            cityByLocale ||
            expert.city_i18n?.en ||
            expert.city_i18n?.fr ||
            expert.city_i18n?.ar ||
            ''
        );
    };

    const africaCountryLabels = useMemo(() => {
        if (typeof Intl === 'undefined' || !Intl.DisplayNames) {
            return new Set();
        }

        const codes = [
            'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM',
            'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM',
            'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR',
            'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL',
            'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW',
        ];
        const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });

        return new Set(
            codes.map((code) => displayNames.of(code)).filter(Boolean),
        );
    }, []);

    const getRegionForExpert = (expert) => {
        if (!expert) {
            return 'all';
        }

        if (expert.region_scope) {
            return expert.region_scope;
        }

        if (expert.country === 'Morocco') {
            return 'maroc';
        }

        if (expert.country && africaCountryLabels.has(expert.country)) {
            return 'afrique';
        }

        return expert.country ? 'diaspora' : 'all';
    };

    const availableCountries = useMemo(() => {
        return Array.from(
            new Set(
                (expertsProp ?? [])
                    .map((item) => item.country)
                    .filter(Boolean),
            ),
        );
    }, [expertsProp]);

    const regionCountryValues = useMemo(() => {
        if (filters.region === 'all') {
            return availableCountries;
        }

        return availableCountries.filter((country) => {
            if (filters.region === 'maroc') {
                return country === 'Morocco';
            }

            if (filters.region === 'afrique') {
                return (
                    country !== 'Morocco' && africaCountryLabels.has(country)
                );
            }

            return (
                country !== 'Morocco' && !africaCountryLabels.has(country)
            );
        });
    }, [availableCountries, africaCountryLabels, filters.region]);

    const countryLabelMap = useMemo(() => {
        return countryOptions.reduce((accumulator, option) => {
            accumulator[option.value] = option.label;
            return accumulator;
        }, {});
    }, [countryOptions]);

    const regionCountryOptions = useMemo(() => {
        const entries = regionCountryValues
            .map((value) => ({
                value,
                label: countryLabelMap[value] ?? value,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

        return [
            { value: 'all', label: t('experts.filters.all') },
            ...entries,
        ];
    }, [countryLabelMap, regionCountryValues, t]);

    const scopedExperts = useMemo(() => {
        let list = expertsProp ?? [];

        if (filters.region !== 'all') {
            list = list.filter(
                (expert) => getRegionForExpert(expert) === filters.region,
            );
        }

        if (filters.country !== 'all') {
            list = list.filter((expert) => expert.country === filters.country);
        }

        return list;
    }, [expertsProp, filters.country, filters.region]);

    const locationOptions = useMemo(() => {
        return [
            { value: 'all', label: t('experts.filters.all') },
            ...Array.from(
                new Set(
                    scopedExperts
                        .map((item) => getCityLabel(item))
                        .filter(Boolean),
                ),
            )
                .sort((a, b) => a.localeCompare(b))
                .map((value) => ({ value, label: value })),
        ];
    }, [scopedExperts, t]);

    const availableLanguages = useMemo(() => {
        return Array.from(
            new Set(
                scopedExperts.flatMap((expert) => expert.languages ?? []),
            ),
        ).filter(Boolean);
    }, [scopedExperts]);

    const languageFilterOptions = useMemo(() => {
        const labelMap = new Map(
            languageOptions.map((option) => [option.value, option.label]),
        );
        const entries = availableLanguages
            .map((value) => ({
                value,
                label: labelMap.get(value) ?? value,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

        return [
            { value: 'all', label: t('experts.filters.all') },
            ...entries,
        ];
    }, [availableLanguages, languageOptions, t]);

    const regionOptions = useMemo(
        () => [
            { value: 'all', label: t('experts.filters.all') },
            {
                value: 'maroc',
                label:
                    locale === 'fr'
                        ? 'Maroc'
                        : locale === 'ar'
                          ? 'المغرب'
                          : 'Morocco',
            },
            {
                value: 'afrique',
                label:
                    locale === 'fr'
                        ? 'Afrique'
                        : locale === 'ar'
                          ? 'افريقيا'
                          : 'Africa',
            },
            {
                value: 'diaspora',
                label:
                    locale === 'fr'
                        ? 'Diaspora'
                        : locale === 'ar'
                          ? 'الشتات'
                          : 'Diaspora',
            },
        ],
        [locale, t],
    );

    const filterLabels = useMemo(
        () => ({
            region: regionOptions.reduce((accumulator, option) => {
                accumulator[option.value] = option.label;
                return accumulator;
            }, {}),
            country: countryLabelMap,
            location: locationOptions.reduce((accumulator, value) => {
                accumulator[value.value] = value.label;
                return accumulator;
            }, {}),
            language: languageFilterOptions.reduce((accumulator, option) => {
                accumulator[option.value] = option.label;
                return accumulator;
            }, {}),
        }),
        [countryLabelMap, languageFilterOptions, locationOptions, regionOptions],
    );

    const activeFilters = useMemo(() => {
        const items = [];

        if (filters.region !== 'all') {
            items.push({
                key: 'region',
                label: filterLabels.region[filters.region] ?? filters.region,
            });
        }

        if (filters.country !== 'all') {
            items.push({
                key: 'country',
                label: filterLabels.country[filters.country] ?? filters.country,
            });
        }

        if (filters.location !== 'all') {
            items.push({
                key: 'location',
                label:
                    filterLabels.location[filters.location] ?? filters.location,
            });
        }

        if (filters.language !== 'all') {
            items.push({
                key: 'language',
                label:
                    filterLabels.language[filters.language] ?? filters.language,
            });
        }

        return items;
    }, [filterLabels, filters]);

    const experts = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = expertsProp;

        if (filters.region !== 'all') {
            list = list.filter(
                (expert) => getRegionForExpert(expert) === filters.region,
            );
        }

        if (filters.country !== 'all') {
            list = list.filter((expert) => expert.country === filters.country);
        }

        if (filters.location !== 'all') {
            const selectedLocation = filters.location.trim().toLowerCase();
            list = list.filter(
                (expert) =>
                    String(getCityLabel(expert)).trim().toLowerCase() ===
                    selectedLocation,
            );
        }

        if (filters.language !== 'all') {
            list = list.filter((expert) =>
                (expert.languages ?? []).includes(filters.language),
            );
        }

        if (q) {
            const withScore = list
                .map((expert, index) => {
                    const nameEn = (expert.name?.en ?? '').toLowerCase();
                    const nameFr = (expert.name?.fr ?? '').toLowerCase();
                    const nameAr = (expert.name?.ar ?? '').toLowerCase();
                    const title = (expert.title?.en ?? '').toLowerCase();
                    const expertise = (expert.expertise ?? [])
                        .flatMap((item) => [item.en, item.fr, item.ar])
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase();
                    const location = getCityLabel(expert).toLowerCase();
                    const haystack = [
                        nameEn,
                        nameFr,
                        nameAr,
                        title,
                        expertise,
                        location,
                    ].join(' ');

                    if (!haystack.includes(q)) {
                        return null;
                    }

                    let score = 0;
                    if (nameEn.startsWith(q)) score += 100;
                    if (nameEn.includes(q)) score += 50;
                    if (title.includes(q)) score += 25;
                    if (expertise.includes(q)) score += 15;
                    if (location.includes(q)) score += 10;
                    score -= index / 1000;

                    return { expert, score };
                })
                .filter(Boolean);

            list = withScore.map((item) => item.expert);

            if (sort === 'relevance') {
                list = [...withScore]
                    .sort((a, b) => b.score - a.score)
                    .map((item) => item.expert);
            }
        }

        if (sort === 'name_asc') {
            list = [...list].sort((a, b) => {
                const aName =
                    locale === 'ar'
                        ? a.name?.ar
                        : locale === 'fr'
                          ? a.name?.fr
                          : a.name?.en;
                const bName =
                    locale === 'ar'
                        ? b.name?.ar
                        : locale === 'fr'
                          ? b.name?.fr
                          : b.name?.en;
                return (aName ?? '').localeCompare(bName ?? '');
            });
        } else if (sort === 'name_desc') {
            list = [...list].sort((a, b) => {
                const aName =
                    locale === 'ar'
                        ? a.name?.ar
                        : locale === 'fr'
                          ? a.name?.fr
                          : a.name?.en;
                const bName =
                    locale === 'ar'
                        ? b.name?.ar
                        : locale === 'fr'
                          ? b.name?.fr
                          : b.name?.en;
                return (bName ?? '').localeCompare(aName ?? '');
            });
        }

        return list;
    }, [
        filters.country,
        filters.language,
        filters.location,
        filters.region,
        locale,
        query,
        sort,
        expertsProp,
    ]);

    const itemsPerPage = 8;
    const totalPages = Math.max(1, Math.ceil(experts.length / itemsPerPage));

    useEffect(() => {
        setCurrentPage(1);
    }, [query, sort, filters]);

    useEffect(() => {
        if (filters.country === 'all') {
            return;
        }

        if (!regionCountryValues.includes(filters.country)) {
            setFilters((current) => ({ ...current, country: 'all' }));
        }
    }, [filters.country, regionCountryValues, setFilters]);

    useEffect(() => {
        if (filters.language === 'all') {
            return;
        }

        if (!availableLanguages.includes(filters.language)) {
            setFilters((current) => ({ ...current, language: 'all' }));
        }
    }, [availableLanguages, filters.language, setFilters]);

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);

    const paginatedExperts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return experts.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, experts]);

    const paginationButtons = useMemo(() => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        const buttons = [1];
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        if (start > 2) {
            buttons.push('ellipsis-start');
        }

        for (let page = start; page <= end; page += 1) {
            buttons.push(page);
        }

        if (end < totalPages - 1) {
            buttons.push('ellipsis-end');
        }

        buttons.push(totalPages);

        return buttons;
    }, [currentPage, totalPages]);

    return (
        <>
            <Head title={t('experts.headTitle')} />

            <div>
                <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(0,151,170,0.12)_0%,rgba(246,247,248,1)_55%)] py-14 sm:py-20">
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <header className="grid items-center gap-10 text-center lg:grid-cols-2 lg:text-left">
                            <div className="relative mx-auto w-full max-w-xl lg:mx-0">
                                <div className="absolute -inset-4 rounded-[36px] bg-beta-blue/12 blur-xl" />
                                <img
                                    src="/assets/hero.png"
                                    alt="Expertes hero"
                                    className="relative w-full rounded-4xl border border-border/70 bg-card object-cover shadow-xl"
                                />
                            </div>

                            <div className="space-y-6">
                                <TransText
                                    tag="h1"
                                    className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl"
                                    en="Find an Expert"
                                    fr="Trouver une experte"
                                    ar="اعثر على خبيرة"
                                />
                                <TransText
                                    tag="p"
                                    className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base"
                                    en="Discover and connect with leading women experts across Morocco and Africa."
                                    fr="Decouvrez et contactez des expertes de premier plan au Maroc et en Afrique."
                                    ar="اكتشف وتواصل مع خبيرات رائدات في المغرب وإفريقيا."
                                />
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-muted-foreground lg:justify-start">
                                    <a
                                        href="https://www.linkedin.com/company/expertesma/"
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="LinkedIn"
                                        style={{ '--social-hover': '#0A66C2' }}
                                        className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card transition hover:border-(--social-hover) hover:text-(--social-hover)"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 640 640"
                                            className="size-5 fill-current"
                                        >
                                            <path d="M196.3 512L103.4 512L103.4 212.9L196.3 212.9L196.3 512zM149.8 172.1C120.1 172.1 96 147.5 96 117.8C96 103.5 101.7 89.9 111.8 79.8C121.9 69.7 135.6 64 149.8 64C164 64 177.7 69.7 187.8 79.8C197.9 89.9 203.6 103.6 203.6 117.8C203.6 147.5 179.5 172.1 149.8 172.1zM543.9 512L451.2 512L451.2 366.4C451.2 331.7 450.5 287.2 402.9 287.2C354.6 287.2 347.2 324.9 347.2 363.9L347.2 512L254.4 512L254.4 212.9L343.5 212.9L343.5 253.7L344.8 253.7C357.2 230.2 387.5 205.4 432.7 205.4C526.7 205.4 544 267.3 544 347.7L544 512L543.9 512z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://www.youtube.com/channel/UCNyyAA6e3kcXJWHkCNvQQwg"
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="YouTube"
                                        style={{ '--social-hover': '#FF0000' }}
                                        className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card transition hover:border-(--social-hover) hover:text-(--social-hover)"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            className="size-5 fill-current"
                                        >
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://www.instagram.com/expertes.ma/"
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Instagram"
                                        style={{ '--social-hover': '#FF0069' }}
                                        className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card transition hover:border-(--social-hover) hover:text-(--social-hover)"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            className="size-5 fill-current"
                                        >
                                            <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://x.com/ExpertesMa"
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="X"
                                        style={{ '--social-hover': '#000000' }}
                                        className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card transition hover:border-(--social-hover) hover:text-(--social-hover)"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            className="size-4 fill-current"
                                        >
                                            <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://www.facebook.com/expertes.officiel"
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Facebook"
                                        style={{ '--social-hover': '#0866FF' }}
                                        className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card transition hover:border-(--social-hover) hover:text-(--social-hover)"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            className="size-5 fill-current"
                                        >
                                            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                                        </svg>
                                    </a>
                                </div>
                                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                                    <Link
                                        href="/experts/become"
                                        className="inline-flex items-center rounded-full bg-beta-blue px-6 py-3 text-sm font-semibold text-twhite transition hover:bg-beta-blue/90"
                                    >
                                        <TransText
                                            en="Become an Expert"
                                            fr="Devenir experte"
                                            ar="أصبحي خبيرة"
                                        />
                                    </Link>
                                    <a
                                        href="#experts-directory"
                                        className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                                    >
                                        <TransText
                                            en="Explore the directory"
                                            fr="Explorer l'annuaire"
                                            ar="استكشاف الدليل"
                                        />
                                    </a>
                                </div>
                            </div>
                        </header>
                    </div>
                </div>

                <ExpertOfMonthSection entry={expertOfMonth} />
                <FeaturedExperts experts={featuredExperts} />

                <div
                    id="experts-directory"
                    className="scroll-mt-16 bg-twhite py-12"
                >
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <FiltersBar
                            advancedOnly
                            locationOptions={locationOptions}
                            countryOptions={regionCountryOptions}
                            languageOptions={languageFilterOptions}
                            regionOptions={regionOptions}
                            query={query}
                            setQuery={setQuery}
                            filters={filters}
                            setFilters={setFilters}
                            sort={sort}
                            setSort={setSort}
                            view={view}
                            setView={setView}
                        />

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    <TransText
                                        en={`${experts.length} results`}
                                        fr={`${experts.length} resultats`}
                                        ar={`${experts.length} نتيجة`}
                                    />
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {activeFilters.length > 0 ? (
                                    activeFilters.map((item) => (
                                        <span
                                            key={item.key}
                                            className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground"
                                        >
                                            {item.label}
                                        </span>
                                    ))
                                ) : (
                                    <span>
                                        <TransText
                                            en="None"
                                            fr="Aucun"
                                            ar="لا شيء"
                                        />
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-10 flex items-center justify-between text-sm">
                            <div className="text-muted-foreground">
                                <TransText
                                    en={`Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, experts.length)} of ${experts.length} experts`}
                                    fr={`Affichage de ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, experts.length)} sur ${experts.length} expertes`}
                                    ar={`عرض ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, experts.length)} من ${experts.length} خبيرات`}
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            {experts.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-border/80 bg-card p-10 text-center">
                                    <p className="text-base font-semibold text-tblack">
                                        No experts match your filters.
                                    </p>
                                    <p className="mt-2 text-sm text-tgray">
                                        Try removing a filter or changing your
                                        search query.
                                    </p>
                                </div>
                            ) : (
                                <div
                                    className={
                                        view === 'grid'
                                            ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
                                            : 'grid grid-cols-1 gap-4'
                                    }
                                >
                                    {paginatedExperts.map((expert) => (
                                        <ExpertCard
                                            key={expert.id}
                                            expert={expert}
                                            view={view}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {totalPages > 1 ? (
                            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.max(1, page - 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="rounded-md border border-border bg-card px-3 py-2 font-semibold text-muted-foreground shadow-sm hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <TransText
                                        en="Previous"
                                        fr="Précédent"
                                        ar="السابق"
                                    />
                                </button>

                                {paginationButtons.map((item) =>
                                    typeof item === 'number' ? (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setCurrentPage(item)}
                                            className={[
                                                'rounded-md border px-3 py-2 font-semibold shadow-sm',
                                                item === currentPage
                                                    ? 'border-beta-blue bg-beta-blue text-twhite'
                                                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                                            ].join(' ')}
                                        >
                                            {item}
                                        </button>
                                    ) : (
                                        <span
                                            key={item}
                                            className="px-2 text-muted-foreground"
                                        >
                                            …
                                        </span>
                                    ),
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.min(totalPages, page + 1),
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="rounded-md border border-border bg-card px-3 py-2 font-semibold text-muted-foreground shadow-sm hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <TransText
                                        en="Next"
                                        fr="Suivant"
                                        ar="التالي"
                                    />
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}

ExpertsIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
