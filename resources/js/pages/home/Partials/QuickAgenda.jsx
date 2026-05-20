import React from 'react';
import { Link } from '@inertiajs/react';
import TransText from '@/components/TransText';

export default function QuickAgenda({ items = [] }) {
    const list = Array.isArray(items) ? items.slice(0, 4) : [];
    if (list.length === 0) return null;

    return (
        <section className="bg-beta-white py-10">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="text-xs font-semibold tracking-widest text-tgray uppercase">
                            <TransText
                                en="Quick agenda"
                                fr="Agenda rapide"
                                ar="الأجندة السريعة"
                            />
                        </div>
                        <h2 className="mt-2 text-2xl font-semibold text-tblack">
                            <TransText
                                en="Upcoming events"
                                fr="Prochains événements"
                                ar="الفعاليات القادمة"
                            />
                        </h2>
                    </div>
                    <Link
                        href="/events?view=calendar"
                        className="text-sm font-semibold text-beta-blue hover:underline"
                    >
                        <TransText
                            en="View full calendar"
                            fr="Voir le calendrier"
                            ar="عرض التقويم"
                        />
                    </Link>
                </div>

                <div className="mt-6 grid gap-3">
                    {list.map((row) => (
                        <Link
                            key={row.href ?? row.id}
                            href={row.href ?? '/events'}
                            className="flex flex-col gap-1 rounded-2xl bg-background px-5 py-4 ring-1 ring-border hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="font-semibold text-foreground">
                                <TransText
                                    en={row.title?.en ?? ''}
                                    fr={row.title?.fr ?? ''}
                                    ar={row.title?.ar ?? ''}
                                />
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {row.date}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

