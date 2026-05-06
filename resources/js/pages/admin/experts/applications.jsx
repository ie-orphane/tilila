import { Head, Link, router, setLayoutProps } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

function statusClass(status) {
    switch (status) {
        case 'accepted':
            return 'border-alpha-green/40 bg-beta-green text-alpha-green';
        case 'denied':
            return 'border-alpha-danger/40 bg-beta-danger text-alpha-danger';
        default:
            return 'border-alpha-yellow/50 bg-beta-yellow text-alpha-yellow';
    }
}

export default function AdminExpertApplicationsIndex({
    applications,
    filters,
    kpis,
}) {
    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: '/admin/dashboard',
            },
            {
                title: 'Expert Applications',
                href: '#',
            },
        ],
        title: 'Expertes',
        description:
            'Manage applications submitted by experts who want to be listed in the directory.',
    });

    const [search, setSearch] = useState(filters?.search ?? '');
    const [denyModal, setDenyModal] = useState({
        open: false,
        applicationId: null,
        note: '',
    });

    const rows = applications?.data ?? [];
    const links = applications?.links ?? [];

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/expert-applications',
            {
                search,
                status: filters?.status,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const review = (id, decision) => {
        if (decision === 'denied') {
            setDenyModal({ open: true, applicationId: id, note: '' });
            return;
        }

        router.patch(
            `/admin/expert-applications/${id}/review`,
            {
                decision,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const submitDeny = () => {
        if (!denyModal.applicationId) {
            return;
        }

        router.patch(
            `/admin/expert-applications/${denyModal.applicationId}/review`,
            {
                decision: 'denied',
                admin_notes: denyModal.note,
            },
            {
                preserveScroll: true,
                onSuccess: () =>
                    setDenyModal({
                        open: false,
                        applicationId: null,
                        note: '',
                    }),
            },
        );
    };

    return (
        <>
            <Head title="Expert Applications" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                {/* <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:pb-8 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-tgray">
                            Experts Directory
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Become Expert Requests
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Review incoming expert applications and accept or
                            deny each request.
                        </p>
                    </div>
                </div> */}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-border/70 bg-card p-4">
                        <div className="text-xs text-tgray uppercase">
                            Total
                        </div>
                        <div className="mt-1 text-2xl font-bold text-tblack">
                            {kpis?.total ?? 0}
                        </div>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-card p-4">
                        <div className="text-xs text-tgray uppercase">
                            Pending
                        </div>
                        <div className="mt-1 text-2xl font-bold text-alpha-yellow">
                            {kpis?.pending ?? 0}
                        </div>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-card p-4">
                        <div className="text-xs text-tgray uppercase">
                            Accepted
                        </div>
                        <div className="mt-1 text-2xl font-bold text-alpha-green">
                            {kpis?.accepted ?? 0}
                        </div>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-card p-4">
                        <div className="text-xs text-tgray uppercase">
                            Denied
                        </div>
                        <div className="mt-1 text-2xl font-bold text-alpha-danger">
                            {kpis?.denied ?? 0}
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={submitSearch}
                    className="flex flex-col gap-4 lg:flex-row lg:items-center"
                >
                    <div className="relative min-w-0 flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email, city or status..."
                            className="h-10 pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setSearch('');
                                router.get('/admin/expert-applications', {
                                    search: '',
                                    status: '',
                                });
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Applicant
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Expertise
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Status
                                </TableHead>
                                <TableHead className="py-3 text-tgray uppercase sm:px-3">
                                    Submitted
                                </TableHead>
                                <TableHead className="py-3 text-right text-tgray uppercase sm:px-3">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="px-4 py-14 text-center text-sm text-tgray sm:px-6"
                                    >
                                        No expert applications found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((application) => (
                                    <TableRow key={application.id}>
                                        <TableCell className="py-4 sm:px-3">
                                            <div className="font-semibold text-tblack">
                                                {application.name_i18n?.en ||
                                                    application.full_name}
                                            </div>
                                            <div className="text-xs text-tgray">
                                                {application.email}
                                            </div>
                                            <div className="text-xs text-tgray">
                                                {[
                                                    application.city,
                                                    application.country,
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ') || '—'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-sm py-4 text-sm text-tgray sm:px-3">
                                            <div className="line-clamp-2">
                                                {application.expertise_i18n
                                                    ?.en ||
                                                    application.expertise ||
                                                    '—'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 sm:px-3">
                                            <span
                                                className={cn(
                                                    'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
                                                    statusClass(
                                                        application.status,
                                                    ),
                                                )}
                                            >
                                                {application.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 text-sm text-tgray sm:px-3">
                                            {application.created_at
                                                ? new Date(
                                                      application.created_at,
                                                  ).toLocaleString()
                                                : '—'}
                                        </TableCell>
                                        <TableCell className="py-4 text-right sm:px-3">
                                            <div className="inline-flex items-center justify-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/admin/expert-applications/${application.id}`}
                                                    >
                                                        Details
                                                    </Link>
                                                </Button>

                                                {application.cv_url ? (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            window.open(
                                                                application.cv_url,
                                                                '_blank',
                                                                'noopener,noreferrer',
                                                            )
                                                        }
                                                    >
                                                        CV
                                                    </Button>
                                                ) : null}

                                                {application.status ===
                                                'pending' ? (
                                                    <>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            className="bg-alpha-green text-twhite hover:bg-alpha-green/90"
                                                            onClick={() =>
                                                                review(
                                                                    application.id,
                                                                    'accepted',
                                                                )
                                                            }
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                review(
                                                                    application.id,
                                                                    'denied',
                                                                )
                                                            }
                                                        >
                                                            Deny
                                                        </Button>
                                                    </>
                                                ) : application.expert_id ? (
                                                    <span className="text-xs font-medium text-alpha-green">
                                                        Published
                                                    </span>
                                                ) : null}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {applications && applications.last_page > 1 ? (
                    <div className="flex flex-col items-center justify-between gap-3 text-sm text-tgray sm:flex-row">
                        <p>
                            Showing {applications.from ?? 0} to{' '}
                            {applications.to ?? 0} of {applications.total}{' '}
                            results
                        </p>
                        <nav
                            className="flex flex-wrap items-center gap-1"
                            aria-label="Pagination"
                        >
                            {links.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={cn(
                                            'inline-flex min-w-9 items-center justify-center rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-muted',
                                            link.active &&
                                                'border-beta-blue bg-beta-blue text-twhite',
                                        )}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className={cn(
                                            'inline-flex min-w-9 items-center justify-center px-3 py-1.5 text-xs',
                                            link.active &&
                                                'border-beta-blue font-semibold text-beta-blue',
                                        )}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ),
                            )}
                        </nav>
                    </div>
                ) : null}
            </div>

            <Dialog
                open={denyModal.open}
                onOpenChange={(open) => {
                    if (!open) {
                        setDenyModal({
                            open: false,
                            applicationId: null,
                            note: '',
                        });
                        return;
                    }
                    setDenyModal((prev) => ({ ...prev, open }));
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Deny expert application</DialogTitle>
                        <DialogDescription>
                            Add an optional note that will be saved with this
                            decision.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <label
                            htmlFor="deny-note"
                            className="text-sm font-medium text-foreground"
                        >
                            Admin note
                        </label>
                        <textarea
                            id="deny-note"
                            value={denyModal.note}
                            onChange={(e) =>
                                setDenyModal((prev) => ({
                                    ...prev,
                                    note: e.target.value,
                                }))
                            }
                            placeholder="Reason for denial (optional)..."
                            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setDenyModal({
                                    open: false,
                                    applicationId: null,
                                    note: '',
                                })
                            }
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={submitDeny}
                        >
                            Confirm deny
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
