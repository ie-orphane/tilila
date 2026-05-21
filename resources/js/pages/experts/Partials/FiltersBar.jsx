import React from 'react';
import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';

function Select({ label, value, onChange, options }) {
    return (
        <label className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
            <span className="whitespace-nowrap">{label}</span>
            <select
                className="w-full bg-transparent text-sm text-foreground outline-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

function ModeButton({ active, onClick, children, ariaLabel }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            aria-label={ariaLabel}
            className={[
                'rounded-full px-4 py-2 text-sm font-semibold transition',
                active ? 'bg-beta-blue text-twhite' : 'text-tgray hover:text-tblack',
            ].join(' ')}
        >
            {children}
        </button>
    );
}

export default function FiltersBar({
    query,
    setQuery,
    filters,
    setFilters,
    sort,
    setSort,
    view,
    setView,
    locationOptions = [],
    countryOptions = [],
    regionOptions = [],
    languageOptions = [],
}) {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">
                            <TransText
                                en="Refine your search"
                                fr="Affiner votre recherche"
                                ar="حسّن بحثك"
                            />
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            <TransText
                                en="Filter by country, city, language, and sorting."
                                fr="Filtrez par pays, ville, langue et tri."
                                ar="تصفية حسب البلد والمدينة واللغة والترتيب."
                            />
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                            <span aria-hidden="true">⌕</span>
                        </div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('experts.searchPlaceholder')}
                            className="w-full rounded-md border border-border bg-background py-2 pr-3 pl-9 text-sm text-foreground shadow-sm ring-offset-background outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <Select
                            label={<TransText en="Region" fr="Region" ar="المنطقة" />}
                            value={filters.region}
                            onChange={(region) =>
                                setFilters((current) => ({ ...current, region }))
                            }
                            options={regionOptions}
                        />

                        <Select
                            label={<TransText en="Country" fr="Pays" ar="البلد" />}
                            value={filters.country}
                            onChange={(country) =>
                                setFilters((current) => ({ ...current, country }))
                            }
                            options={countryOptions}
                        />

                        <Select
                            label={
                                <TransText
                                    en="City / Location"
                                    fr="Ville / lieu"
                                    ar="المدينة / الموقع"
                                />
                            }
                            value={filters.location}
                            onChange={(location) =>
                                setFilters((current) => ({ ...current, location }))
                            }
                            options={locationOptions}
                        />

                        <Select
                            label={<TransText en="Languages" fr="Langues" ar="اللغات" />}
                            value={filters.language}
                            onChange={(language) =>
                                setFilters((current) => ({ ...current, language }))
                            }
                            options={languageOptions}
                        />
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <Select
                            label={
                                <TransText
                                    en="Sort by:"
                                    fr="Trier par :"
                                    ar="ترتيب حسب:"
                                />
                            }
                            value={sort}
                            onChange={setSort}
                            options={[
                                { value: 'relevance', label: t('experts.sort.relevance') },
                                { value: 'name_asc', label: t('experts.sort.nameAsc') },
                                { value: 'name_desc', label: t('experts.sort.nameDesc') },
                            ]}
                        />

                        <div className="inline-flex items-center rounded-md border border-border bg-card shadow-sm">
                            <button
                                type="button"
                                onClick={() => setView('grid')}
                                className={[
                                    'px-3 py-2 text-sm font-semibold',
                                    view === 'grid'
                                        ? 'text-beta-blue'
                                        : 'text-muted-foreground hover:text-foreground',
                                ].join(' ')}
                                aria-pressed={view === 'grid'}
                                aria-label={t('experts.view.gridAria')}
                            >
                                ▦
                            </button>
                            <div className="h-8 w-px bg-border" />
                            <button
                                type="button"
                                onClick={() => setView('list')}
                                className={[
                                    'px-3 py-2 text-sm font-semibold',
                                    view === 'list'
                                        ? 'text-beta-blue'
                                        : 'text-muted-foreground hover:text-foreground',
                                ].join(' ')}
                                aria-pressed={view === 'list'}
                                aria-label={t('experts.view.listAria')}
                            >
                                ≡
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
