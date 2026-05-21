import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '@/contexts/TranslationContext';
import TransText from '@/components/TransText';
import { show } from '@/routes/experts';

export default function ExpertCard({ expert, view = 'grid' }) {
    const { locale, t } = useTranslation();
    const imageSrc = expert.image ?? expert.image_url ?? null;
    const cityLabel =
        locale === 'ar'
            ? expert.city_i18n?.ar
            : locale === 'fr'
              ? expert.city_i18n?.fr
              : expert.city_i18n?.en;
    const displayCity =
        cityLabel ||
        expert.city_i18n?.en ||
        expert.city_i18n?.fr ||
        expert.city_i18n?.ar ||
        '';

    const isList = view === 'list';

    return (
        <div
            className={[
                'group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
                isList ? 'flex flex-col flex-1 h-full sm:flex-row' : 'flex flex-col',
            ].join(' ')}
        >
            <div
                className={[
                    'relative overflow-hidden',
                    isList ? 'h-44 w-full sm:h-auto sm:w-56' : 'h-40 w-full',
                ].join(' ')}
            >
                <div className="absolute inset-0 bg-linear-to-br from-alpha-blue/60 via-twhite/30 to-transparent" />
                {expert.on_front ? (
                    <div className="absolute left-3 top-3 rounded-full border border-beta-blue/30 bg-alpha-blue px-2.5 py-1 text-[11px] font-semibold text-beta-blue">
                        Featured
                    </div>
                ) : null}
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={expert.name?.en ?? ''}
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                            e.target.src = null;
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <div className="rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                            {displayCity || 'Tilila'}
                        </div>
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-tblack/45 to-transparent" />
            </div>

            <div className={['flex flex-1 flex-col', isList ? 'p-5' : 'p-5'].join(' ')}>
                <div className="text-base font-extrabold text-foreground">
                    <TransText {...expert.name} />
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                    <TransText
                        en={expert.title?.en ?? ''}
                        fr={expert.title?.fr ?? ''}
                        ar={expert.title?.ar ?? ''}
                    />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {(expert.expertise ?? [])
                        .slice(0, isList ? 3 : 2)
                        .map((tag) => (
                        <span
                            key={tag.en || tag.fr || tag.ar}
                            className="rounded-full border border-border/70 bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground"
                        >
                            <TransText en={tag.en} fr={tag.fr} ar={tag.ar} />
                        </span>
                        ))}
                    {(expert.expertise ?? []).length > (isList ? 3 : 2) ? (
                        <span className="rounded-full border border-border/70 bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                            +{(expert.expertise ?? []).length - (isList ? 3 : 2)}
                        </span>
                    ) : null}
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                        {displayCity}
                    </div>
                    <Link
                        href={show.url(expert.id)}
                        className="text-sm font-semibold text-beta-blue hover:underline"
                    >
                        {t('experts.actions.viewProfile')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
