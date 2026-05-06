import { Head, Link, router, setLayoutProps } from '@inertiajs/react';
import { CheckCircle2, FileText, Globe2, MapPin, XCircle } from 'lucide-react';
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
import AppLayout from '@/layouts/app-layout';

function Row({ label, value }) {
    return (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-4 sm:gap-4">
            <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {label}
            </div>
            <div className="text-sm wrap-break-word text-foreground sm:col-span-3">
                {value || '—'}
            </div>
        </div>
    );
}

function SectionCard({ title, description, children }) {
    return (
        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-tblack">{title}</h2>
                {description ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
            <div className="space-y-4">{children}</div>
        </section>
    );
}

function LangCard({ lang, items }) {
    return (
        <div className="rounded-xl border border-border/70 bg-background p-4 shadow-sm">
            <div className="mb-3 inline-flex items-center rounded-full border border-border/70 bg-card px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {lang}
            </div>
            <div className="space-y-3">
                {items.map((item) => (
                    <div key={`${lang}-${item.label}`}>
                        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            {item.label}
                        </p>
                        <p className="mt-1 text-sm wrap-break-word text-foreground">
                            {item.value || '—'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TagList({ items }) {
    if (!items?.length) {
        return <span className="text-sm text-muted-foreground">—</span>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item) => (
                <span
                    key={item}
                    className="inline-flex items-center rounded-full border border-border/70 bg-background px-2.5 py-0.5 text-xs font-medium text-foreground"
                >
                    {item}
                </span>
            ))}
        </div>
    );
}

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

export default function AdminExpertApplicationShow({ application }) {
    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: '/admin/dashboard',
            },
            {
                title: 'Expert Applications',
                href: '/admin/expert-applications',
            },
            {
                title: `Request #${application?.id ?? ''}`,
                href: '#',
            }
        ],
        title: `Expert Application #${application?.id ?? ''}`,
        description:
            'Review the details of this expert application and accept or deny it accordingly.',
    });

    const a = application ?? {};
    const [denyOpen, setDenyOpen] = useState(false);
    const [denyNote, setDenyNote] = useState('');
    const industries = Array.isArray(a.industries) ? a.industries : [];
    const languages = Array.isArray(a.languages) ? a.languages : [];
    const submittedAt = a.created_at
        ? new Date(a.created_at).toLocaleString()
        : '—';
    const reviewedAt = a.reviewed_at
        ? new Date(a.reviewed_at).toLocaleString()
        : '—';

    const review = (decision) => {
        if (decision === 'denied') {
            setDenyOpen(true);
            return;
        }

        router.patch(`/admin/expert-applications/${a.id}/review`, {
            decision,
        });
    };

    const submitDeny = () => {
        router.patch(
            `/admin/expert-applications/${a.id}/review`,
            {
                decision: 'denied',
                admin_notes: denyNote,
            },
            {
                onSuccess: () => {
                    setDenyOpen(false);
                    setDenyNote('');
                },
            },
        );
    };

    return (
        <>
            <Head title={`Expert Request #${a.id ?? ''}`} />

            <div className="mx-auto flex w-full max-w-[min(100%,72rem)] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                <div className="rounded-2xl border border-border/70 bg-card px-5 py-5 shadow-sm sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.3em] text-tgray uppercase">
                                Experts Directory
                            </p>
                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-tblack sm:text-3xl">
                                {a.full_name || 'Application details'}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                    <MapPin className="size-4" />
                                    {a.city || '—'}
                                    {a.country ? `, ${a.country}` : ''}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Globe2 className="size-4" />
                                    {a.locale || '—'}
                                </span>
                                <span className="text-muted-foreground">
                                    Submitted {submittedAt}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusClass(a.status)}`}
                            >
                                {a.status || 'pending'}
                            </span>
                            {a.expert_id ? (
                                <span className="text-xs font-medium text-alpha-green">
                                    Published
                                </span>
                            ) : null}
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        {a.cv_url ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="gap-2"
                                onClick={() =>
                                    window.open(
                                        a.cv_url,
                                        '_blank',
                                        'noopener,noreferrer',
                                    )
                                }
                            >
                                <FileText className="size-4" />
                                Open CV
                            </Button>
                        ) : null}

                        {a.status === 'pending' ? (
                            <>
                                <Button
                                    type="button"
                                    className="gap-2 bg-alpha-green text-twhite hover:bg-alpha-green/90"
                                    onClick={() => review('accepted')}
                                >
                                    <CheckCircle2 className="size-4" />
                                    Accept
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="gap-2"
                                    onClick={() => setDenyOpen(true)}
                                >
                                    <XCircle className="size-4" />
                                    Deny
                                </Button>
                            </>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="flex flex-col gap-6">
                        <SectionCard
                            title="Review"
                            description="Decision and reviewer metadata."
                        >
                            <Row label="Status" value={a.status || 'pending'} />
                            <Row label="Reviewed at" value={reviewedAt} />
                            <Row
                                label="Reviewed by"
                                value={
                                    a.reviewed_by
                                        ? `${a.reviewed_by.name ?? ''} (${a.reviewed_by.email ?? ''})`
                                        : ''
                                }
                            />
                            <Row label="Admin notes" value={a.admin_notes} />
                        </SectionCard>

                        <SectionCard
                            title="Identity"
                            description="Primary contact details and localization."
                        >
                            <Row label="Email" value={a.email} />
                            <Row label="Phone" value={a.phone} />
                            <Row label="Locale" value={a.locale} />
                            <Row label="Country" value={a.country} />
                            <Row label="City" value={a.city} />
                        </SectionCard>

                        <SectionCard
                            title="Names and Titles"
                            description="Multilingual names and professional titles."
                        >
                            <div className="grid gap-4 lg:grid-cols-3">
                                <LangCard
                                    lang="EN"
                                    items={[
                                        {
                                            label: 'Name',
                                            value:
                                                a.name_i18n?.en || a.full_name,
                                        },
                                        {
                                            label: 'Current title',
                                            value:
                                                a.title_i18n?.en ||
                                                a.current_title,
                                        },
                                    ]}
                                />
                                <LangCard
                                    lang="FR"
                                    items={[
                                        {
                                            label: 'Name',
                                            value: a.name_i18n?.fr,
                                        },
                                        {
                                            label: 'Current title',
                                            value: a.title_i18n?.fr,
                                        },
                                    ]}
                                />
                                <LangCard
                                    lang="AR"
                                    items={[
                                        {
                                            label: 'Name',
                                            value: a.name_i18n?.ar,
                                        },
                                        {
                                            label: 'Current title',
                                            value: a.title_i18n?.ar,
                                        },
                                    ]}
                                />
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Expertise and Bio"
                            description="Areas of expertise and personal bio in three languages."
                        >
                            <div className="grid gap-4 lg:grid-cols-3">
                                <LangCard
                                    lang="EN"
                                    items={[
                                        {
                                            label: 'Expertise',
                                            value:
                                                a.expertise_i18n?.en ||
                                                a.expertise,
                                        },
                                        {
                                            label: 'Bio',
                                            value: a.bio_i18n?.en || a.bio,
                                        },
                                    ]}
                                />
                                <LangCard
                                    lang="FR"
                                    items={[
                                        {
                                            label: 'Expertise',
                                            value: a.expertise_i18n?.fr,
                                        },
                                        {
                                            label: 'Bio',
                                            value: a.bio_i18n?.fr,
                                        },
                                    ]}
                                />
                                <LangCard
                                    lang="AR"
                                    items={[
                                        {
                                            label: 'Expertise',
                                            value: a.expertise_i18n?.ar,
                                        },
                                        {
                                            label: 'Bio',
                                            value: a.bio_i18n?.ar,
                                        },
                                    ]}
                                />
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Industries and Languages"
                            description="Focus industries and spoken languages."
                        >
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                    Industries
                                </p>
                                <div className="mt-2">
                                    <TagList items={industries} />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                    Languages
                                </p>
                                <div className="mt-2">
                                    <TagList items={languages} />
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard
                            title="Social Links"
                            description="Optional public profiles."
                        >
                            <Row label="LinkedIn" value={a.linkedin_url} />
                            <Row
                                label="Twitter / X"
                                value={a.socials?.twitter}
                            />
                            <Row
                                label="Instagram"
                                value={a.socials?.instagram}
                            />
                            <Row label="Portfolio" value={a.portfolio_url} />
                        </SectionCard>
                    </div>

                    <div className="flex flex-col gap-6"></div>
                </div>
            </div>

            <Dialog
                open={denyOpen}
                onOpenChange={(open) => {
                    setDenyOpen(open);
                    if (!open) {
                        setDenyNote('');
                    }
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
                            value={denyNote}
                            onChange={(e) => setDenyNote(e.target.value)}
                            placeholder="Reason for denial (optional)..."
                            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDenyOpen(false)}
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
