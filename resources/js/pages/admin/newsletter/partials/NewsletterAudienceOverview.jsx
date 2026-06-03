import { Globe2, Mail, Users } from 'lucide-react';

import { cn } from '@/lib/utils';

function LocaleBar({ label, count, total, colorClass }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-tblack">{label}</span>
                <span className="tabular-nums text-tgray">
                    {count}{' '}
                    <span className="text-tgray/80">({pct}%)</span>
                </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                    className={cn('h-full rounded-full transition-all', colorClass)}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

export default function NewsletterAudienceOverview({ stats = {} }) {
    const total = stats.total ?? 0;
    const en = stats.en ?? 0;
    const fr = stats.fr ?? 0;
    const ar = stats.ar ?? 0;
    const unknown = stats.unknown ?? 0;

    return (
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-beta-blue/15 text-beta-blue">
                        <Users className="size-7" />
                    </span>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-tgray">
                            Audience overview
                        </p>
                        <p className="text-3xl font-bold tabular-nums tracking-tight text-tblack">
                            {total}
                        </p>
                        <p className="mt-0.5 text-sm text-tgray">
                            active subscriber{total === 1 ? '' : 's'}
                            {unknown > 0
                                ? ` · ${unknown} without locale`
                                : ''}
                        </p>
                    </div>
                </div>

                <div className="grid flex-1 gap-4 sm:max-w-md sm:grid-cols-3 lg:max-w-xl">
                    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-beta-white px-3 py-2.5">
                        <Mail className="size-4 shrink-0 text-alpha-green" />
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-tgray">
                                EN
                            </p>
                            <p className="text-lg font-bold tabular-nums text-tblack">
                                {en}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-beta-white px-3 py-2.5">
                        <Globe2 className="size-4 shrink-0 text-alpha-yellow" />
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-tgray">
                                FR
                            </p>
                            <p className="text-lg font-bold tabular-nums text-tblack">
                                {fr}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-beta-white px-3 py-2.5">
                        <Globe2 className="size-4 shrink-0 text-alpha-purple" />
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-tgray">
                                AR
                            </p>
                            <p className="text-lg font-bold tabular-nums text-tblack">
                                {ar}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {total > 0 ? (
                <div className="mt-6 grid gap-4 border-t border-border/60 pt-6 sm:grid-cols-3">
                    <LocaleBar
                        label="English"
                        count={en}
                        total={total}
                        colorClass="bg-alpha-green"
                    />
                    <LocaleBar
                        label="French"
                        count={fr}
                        total={total}
                        colorClass="bg-alpha-yellow"
                    />
                    <LocaleBar
                        label="Arabic"
                        count={ar}
                        total={total}
                        colorClass="bg-beta-blue"
                    />
                </div>
            ) : null}
        </div>
    );
}
