import { Head, setLayoutProps } from '@inertiajs/react';
import { DashboardRightColumn } from '@/pages/dashboard/Partials/DashboardRightColumn';
import { ImpactOverviewChart } from '@/pages/dashboard/Partials/ImpactOverviewChart';
import { RecentImpactActivities } from '@/pages/dashboard/Partials/RecentImpactActivities';
import { StrategicOverviewKpis } from '@/pages/dashboard/Partials/StrategicOverviewKpis';
import { dashboard } from '@/routes';

export default function Dashboard() {
    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard.url(),
            },
        ],
        title: 'Dashboard Hello',
        description: 'Global impact overview',
    });

    return (
        <>
            <Head title="Global Impact Dashboard" />

            <div className="flex min-h-full flex-1 flex-col gap-8 bg-beta-white/50 p-4 md:p-6 lg:p-8">
                <div className="grid flex-1 gap-8 xl:grid-cols-[minmax(0,1fr)_min(100%,320px)] xl:items-start xl:gap-10">
                    <div className="flex min-w-0 flex-col gap-8">
                        <StrategicOverviewKpis />
                        <ImpactOverviewChart />
                        <RecentImpactActivities />
                    </div>
                    <aside className="min-w-0 xl:sticky xl:top-20">
                        <DashboardRightColumn />
                    </aside>
                </div>
            </div>
        </>
    );
}
