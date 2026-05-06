import { usePage } from '@inertiajs/react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { AppLayoutProps, BreadcrumbItem } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
    title,
    description,
}: AppLayoutProps) {
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);
    const currentPath = (usePage().url || '/').split('?')[0] || '/';

    const normalizePath = (path: string) => {
        if (!path) return '/';
        if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
        return path;
    };

    const formatSegment = (segment: string) => {
        const cleaned = segment.replace(/[-_]/g, ' ');
        return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const buildBreadcrumbs = (path: string): BreadcrumbItem[] => {
        const segments = normalizePath(path).split('/').filter(Boolean);
        return segments.map((segment, index) => ({
            title: formatSegment(segment),
            href: `/${segments.slice(0, index + 1).join('/')}`,
        }));
    };

    const resolvedBreadcrumbs =
        breadcrumbs.length > 0 ? breadcrumbs : buildBreadcrumbs(currentPath);
    const lastCrumb =
        resolvedBreadcrumbs.length > 0
            ? resolvedBreadcrumbs[resolvedBreadcrumbs.length - 1]
            : undefined;
    const resolvedTitle = title || lastCrumb?.title || 'Dashboard';
    const resolvedDescription =
        description ||
        (resolvedBreadcrumbs.length > 1
            ? resolvedBreadcrumbs
                  .slice(0, -1)
                  .map((item) => item.title)
                  .join(' / ')
            : 'Overview');

    return (
        <AppShell variant={isAuthenticated ? 'sidebar' : 'header'}>
            {isAuthenticated && <AppSidebar />}
            <AppContent
                variant={isAuthenticated ? 'sidebar' : 'header'}
                className="overflow-x-hidden"
            >
                {isAuthenticated && (
                    <header className="border-b border-border/60 bg-background px-4 py-4 md:px-6">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <SidebarTrigger className="-ml-1" />
                                <Breadcrumbs breadcrumbs={resolvedBreadcrumbs} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-tblack">
                                    {resolvedTitle}
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {resolvedDescription}
                                </p>
                            </div>
                        </div>
                    </header>
                )}
                {children}
            </AppContent>
        </AppShell>
    );
}
