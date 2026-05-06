import { Head, Link, setLayoutProps } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

function getLocaleValue(value) {
    if (!value) {
        return '';
    }

    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'object') {
        return value.en || value.fr || value.ar || '';
    }

    return '';
}

export default function ExpertDashboard({ expert }) {
    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: '#',
            },
        ],
        title: `Welcome, ${getLocaleValue(expert?.name) || 'Expert'}`,
        description:
            'Update your public profile and keep your expert information accurate.',
    });

    return (
        <>
            <Head title="Expert Dashboard" />

            <div className="mx-auto flex w-full max-w-[min(100%,70rem)] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="text-xs text-tgray uppercase">
                            Status
                        </div>
                        <div className="mt-1 text-lg font-semibold text-tblack capitalize">
                            {expert?.status || '—'}
                        </div>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="text-xs text-tgray uppercase">
                            Email
                        </div>
                        <div className="mt-1 text-lg font-semibold text-tblack">
                            {expert?.email || '—'}
                        </div>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="text-xs text-tgray uppercase">
                            Country
                        </div>
                        <div className="mt-1 text-lg font-semibold text-tblack">
                            {expert?.country || '—'}
                        </div>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="text-xs text-tgray uppercase">City</div>
                        <div className="mt-1 text-lg font-semibold text-tblack">
                            {expert?.location || '—'}
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                    <h2 className="text-lg font-semibold text-tblack">
                        Account actions
                    </h2>
                    <p className="mt-2 text-sm text-tgray">
                        You can edit your personal account details from Profile
                        Settings and permanently delete your account there if
                        needed.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href="/settings/profile">
                                Profile settings
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/settings/security">
                                Security settings
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
