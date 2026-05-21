import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import ErrorModal from '@/components/modals/ErrorModal';
import SuccessModal from '@/components/modals/SuccessModal';
import AppLayout from '@/layouts/app-layout';

import NewsletterAudienceOverview from './partials/NewsletterAudienceOverview';
import NewsletterComposeForm from './partials/NewsletterComposeForm';
import NewsletterPageHeader from './partials/NewsletterPageHeader';
import NewsletterSubscribersTable from './partials/NewsletterSubscribersTable';

export default function AdminNewsletterIndex({
    subscribers,
    filters,
    stats,
    localeOptions = [],
}) {
    const { flash } = usePage().props;
    const [activeView, setActiveView] = useState('compose');
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setSuccessOpen(true);
        }
        if (flash?.warning) {
            setErrorOpen(true);
        }
    }, [flash?.success, flash?.warning]);

    const exportCsv = () => {
        const params = new URLSearchParams();
        if (filters?.search?.trim()) {
            params.set('search', filters.search.trim());
        }
        if (filters?.locale) {
            params.set('locale', filters.locale);
        }
        const qs = params.toString();
        window.location.href = `/admin/newsletter/export.csv${qs ? `?${qs}` : ''}`;
    };

    return (
        <>
            <Head title="Newsletter" />

            <SuccessModal
                open={successOpen}
                onOpenChange={setSuccessOpen}
                message={flash?.success}
                title="Done"
            />

            <ErrorModal
                open={errorOpen}
                onOpenChange={setErrorOpen}
                message={flash?.warning}
                variant="warning"
                title="Notice"
            />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <NewsletterPageHeader
                    total={stats?.total ?? 0}
                    onExport={exportCsv}
                    activeView={activeView}
                    onViewChange={setActiveView}
                />

                <NewsletterAudienceOverview stats={stats} />

                <div className="hidden gap-8 xl:grid xl:grid-cols-5 xl:items-start">
                    <NewsletterSubscribersTable
                        subscribers={subscribers}
                        filters={filters}
                        className="xl:col-span-2"
                    />
                    <NewsletterComposeForm
                        stats={stats}
                        className="xl:col-span-3"
                    />
                </div>

                <div className="xl:hidden">
                    {activeView === 'compose' ? (
                        <NewsletterComposeForm stats={stats} />
                    ) : (
                        <NewsletterSubscribersTable
                            subscribers={subscribers}
                            filters={filters}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

AdminNewsletterIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
