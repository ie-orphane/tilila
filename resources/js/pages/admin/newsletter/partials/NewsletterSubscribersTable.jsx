import { router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Mail,
    Search,
    Trash2,
    UserX,
    X,
} from 'lucide-react';
import { useState } from 'react';

import DelteModal from '@/components/modals/DelteModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

function localeBadgeClass(locale) {
    switch (locale) {
        case 'en':
            return 'border-alpha-green/40 bg-beta-green text-alpha-green';
        case 'fr':
            return 'border-alpha-yellow/50 bg-beta-yellow text-alpha-yellow';
        case 'ar':
            return 'border-beta-blue/40 bg-beta-blue/10 text-beta-blue';
        default:
            return 'border-border bg-muted text-muted-foreground';
    }
}

function formatDate(value) {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

function hasActiveFilters(filters) {
    return Boolean(filters?.search?.trim() || filters?.locale);
}

export default function NewsletterSubscribersTable({
    subscribers,
    filters = {},
    className,
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [localeFilter, setLocaleFilter] = useState(filters.locale ?? '');
    const [deleteTarget, setDeleteTarget] = useState(null);

    const rows = subscribers?.data ?? [];
    const total = subscribers?.total ?? rows.length;
    const from = subscribers?.from ?? 0;
    const to = subscribers?.to ?? 0;
    const currentPage = subscribers?.current_page ?? 1;
    const lastPage = subscribers?.last_page ?? 1;
    const prevUrl = subscribers?.prev_page_url;
    const nextUrl = subscribers?.next_page_url;

    const applyFilters = (e) => {
        e?.preventDefault?.();
        router.get(
            '/admin/newsletter',
            {
                search: search.trim() || undefined,
                locale: localeFilter || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setLocaleFilter('');
        router.get('/admin/newsletter', {}, { preserveState: true, replace: true });
    };

    const confirmDelete = () => {
        if (!deleteTarget?.id) {
            return;
        }

        router.delete(`/admin/newsletter/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    };

    return (
        <>
            <section
                className={cn(
                    'overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm',
                    className,
                )}
            >
                <div className="flex flex-col gap-3 border-b border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-base font-semibold text-tblack">
                            Subscribers
                        </h2>
                        <p className="mt-0.5 text-sm text-tgray">
                            {total === 0
                                ? 'No emails in the list yet'
                                : total === 1
                                  ? '1 contact in your list'
                                  : `${total} contacts · showing ${from}–${to}`}
                        </p>
                    </div>
                    {hasActiveFilters(filters) ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-tgray"
                            onClick={clearFilters}
                        >
                            <X className="size-3.5" />
                            Clear filters
                        </Button>
                    ) : null}
                </div>

                <div className="border-b border-border/60 bg-beta-white/40 px-5 py-4 sm:px-6">
                    <form
                        onSubmit={applyFilters}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                        <div className="relative min-w-0 flex-1">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-tgray" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by email…"
                                className="bg-card pl-9"
                            />
                        </div>
                        <Select
                            value={localeFilter || 'all'}
                            onValueChange={(v) =>
                                setLocaleFilter(v === 'all' ? '' : v)
                            }
                        >
                            <SelectTrigger className="w-full bg-card sm:w-[160px]">
                                <SelectValue placeholder="Locale" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All locales</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="ar">Arabic</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            type="submit"
                            className="shrink-0 bg-beta-blue text-twhite hover:bg-beta-blue/90"
                        >
                            Search
                        </Button>
                    </form>
                </div>

                {rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                        <span className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                            <UserX className="size-7 text-tgray" />
                        </span>
                        <p className="mt-4 text-base font-semibold text-tblack">
                            {hasActiveFilters(filters)
                                ? 'No matches found'
                                : 'No subscribers yet'}
                        </p>
                        <p className="mt-1 max-w-sm text-sm text-tgray">
                            {hasActiveFilters(filters)
                                ? 'Try a different search or clear your filters.'
                                : 'Emails from the site footer and media pages will appear here once users subscribe.'}
                        </p>
                        {hasActiveFilters(filters) ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-4"
                                onClick={clearFilters}
                            >
                                Clear filters
                            </Button>
                        ) : null}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="pl-6">
                                            Email
                                        </TableHead>
                                        <TableHead>Locale</TableHead>
                                        <TableHead>Subscribed</TableHead>
                                        <TableHead className="w-[72px] pr-6 text-right">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            className="group"
                                        >
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-beta-blue/10 text-beta-blue">
                                                        <Mail className="size-4" />
                                                    </span>
                                                    <span className="font-medium text-tblack">
                                                        {row.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-xs font-semibold uppercase',
                                                        localeBadgeClass(
                                                            row.locale,
                                                        ),
                                                    )}
                                                >
                                                    {row.locale || '—'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap text-sm text-tgray">
                                                {formatDate(
                                                    row.subscribed_at ??
                                                        row.created_at,
                                                )}
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="opacity-60 transition-opacity group-hover:opacity-100 text-alpha-danger hover:bg-beta-danger hover:text-alpha-danger"
                                                    onClick={() =>
                                                        setDeleteTarget(row)
                                                    }
                                                    aria-label={`Remove ${row.email}`}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {lastPage > 1 ? (
                            <div className="flex flex-col gap-3 border-t border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <p className="text-sm text-tgray">
                                    Page {currentPage} of {lastPage}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="gap-1"
                                        disabled={!prevUrl}
                                        onClick={() =>
                                            prevUrl &&
                                            router.get(prevUrl, {}, {
                                                preserveState: true,
                                            })
                                        }
                                    >
                                        <ChevronLeft className="size-4" />
                                        Previous
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="gap-1"
                                        disabled={!nextUrl}
                                        onClick={() =>
                                            nextUrl &&
                                            router.get(nextUrl, {}, {
                                                preserveState: true,
                                            })
                                        }
                                    >
                                        Next
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </>
                )}
            </section>

            <DelteModal
                open={deleteTarget !== null}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title="Remove subscriber?"
                itemName={deleteTarget?.email}
                description={
                    deleteTarget?.email
                        ? `${deleteTarget.email} will be removed from the newsletter list. They can subscribe again from the public site.`
                        : 'This email will be removed from the newsletter list.'
                }
                confirmLabel="Remove"
                onConfirm={confirmDelete}
            />
        </>
    );
}
