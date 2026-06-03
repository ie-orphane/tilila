import { Download, Mail, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function NewsletterPageHeader({
    total = 0,
    onExport,
    activeView,
    onViewChange,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="relative bg-gradient-to-r from-beta-blue/10 via-alpha-blue/50 to-beta-white px-5 py-6 sm:px-8 sm:py-7">
                <div className="pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-beta-blue/10 blur-2xl" />
                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex items-start gap-4">
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-beta-blue text-twhite shadow-sm">
                            <Mail className="size-6" />
                        </span>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-beta-blue">
                                Communication
                            </p>
                            <h1 className="text-2xl font-bold tracking-tight text-tblack sm:text-3xl">
                                Newsletter
                            </h1>
                            <p className="mt-1 max-w-xl text-sm leading-relaxed text-tgray">
                                Compose campaigns, preview the email layout, and
                                manage your subscriber list.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/80 px-3 py-2 text-sm backdrop-blur-sm">
                            <Users className="size-4 text-beta-blue" />
                            <span className="font-semibold tabular-nums text-tblack">
                                {total}
                            </span>
                            <span className="text-tgray">subscribers</span>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2 bg-card/80 backdrop-blur-sm"
                            onClick={onExport}
                        >
                            <Download className="size-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex gap-1 border-t border-border/60 bg-muted/30 p-2 lg:hidden">
                <button
                    type="button"
                    onClick={() => onViewChange('compose')}
                    className={
                        activeView === 'compose'
                            ? 'flex-1 rounded-lg bg-card px-3 py-2 text-sm font-semibold text-tblack shadow-sm'
                            : 'flex-1 rounded-lg px-3 py-2 text-sm font-medium text-tgray hover:text-tblack'
                    }
                >
                    Compose
                </button>
                <button
                    type="button"
                    onClick={() => onViewChange('audience')}
                    className={
                        activeView === 'audience'
                            ? 'flex-1 rounded-lg bg-card px-3 py-2 text-sm font-semibold text-tblack shadow-sm'
                            : 'flex-1 rounded-lg px-3 py-2 text-sm font-medium text-tgray hover:text-tblack'
                    }
                >
                    Subscribers
                </button>
            </div>
        </div>
    );
}
