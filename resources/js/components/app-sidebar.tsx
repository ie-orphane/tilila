import { Link, usePage } from '@inertiajs/react';
import { Calendar, LayoutGrid, Megaphone, Trophy, Users } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

const adminModuleItems: NavItem[] = [
    {
        title: 'Expertes',
        href: '/admin/expert-applications',
        icon: Users,
    },
    // {
    //     title: 'Media',
    //     href: '/admin/media',
    //     icon: FileText,
    // },
    {
        title: 'Opportunities',
        href: '/admin/opportunities',
        icon: Megaphone,
    },
    {
        title: 'Events',
        href: '/admin/events',
        icon: Calendar,
    },
    // {
    //     title: 'Community',
    //     href: home.url(),
    //     icon: Globe2,
    // },
];

const expertModuleItems: NavItem[] = [
    {
        title: 'My Profile',
        href: '/expert/profile',
        icon: Users,
    },
];

function SidebarNavLinks({ items }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarMenu>
            {items.map((item) => {
                const Icon = item.icon;

                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {Icon && <Icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}

export function AppSidebar() {
    const page = usePage();
    const role = (page.props.auth?.user?.role as string | undefined) ?? 'user';
    const isExpert = role === 'expert';
    const { isCurrentUrl } = useCurrentUrl();
    const dashboardItem: NavItem = {
        title: 'Dashboard',
        href: isExpert ? '/expert/dashboard' : '/admin/dashboard',
        icon: LayoutGrid,
    };
    const moduleItems = isExpert ? expertModuleItems : adminModuleItems;
    // const strategicItems = isExpert ? expertStrategicItems : adminStrategicItems;
    const DashboardIcon = dashboardItem.icon;

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader className="gap-3 border-b border-sidebar-border p-4">
                <Link
                    href={isExpert ? '/expert/dashboard' : '/admin/dashboard'}
                    prefetch
                    className="flex items-start gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-beta-blue/20">
                        <img
                            src="/assets/logo.webp"
                            alt=""
                            className="size-7 object-contain"
                        />
                    </span>
                    <span className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate text-sm font-bold tracking-tight text-twhite">
                            {isExpert ? 'Expert Back Office' : 'TILILA Impact'}
                        </span>
                        <span className="mt-0.5 truncate text-xs font-medium text-sidebar-foreground/60">
                            {isExpert
                                ? 'Manage your profile'
                                : 'Strategic Pilotage'}
                        </span>
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent className="gap-0 px-2 py-4">
                <SidebarGroup className="py-0">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(dashboardItem.href)}
                                tooltip={{ children: dashboardItem.title }}
                            >
                                <Link href={dashboardItem.href} prefetch>
                                    {DashboardIcon ? <DashboardIcon /> : null}
                                    <span>{dashboardItem.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup className="mt-4 py-0">
                    <SidebarGroupLabel>Modules</SidebarGroupLabel>
                    <SidebarNavLinks items={moduleItems} />
                </SidebarGroup>

                {role === 'admin' && (
                    <>
                        <SidebarGroup className="mt-4 py-0">
                            <SidebarGroupLabel>Tilila</SidebarGroupLabel>
                            <SidebarNavLinks
                                items={[
                                    {
                                        title: 'Editions',
                                        href: '/admin/tilila/editions',
                                        icon: Trophy,
                                    },
                                    {
                                        title: 'Submissions',
                                        href: '/admin/tilila/participants',
                                        icon: Users,
                                    },
                                ]}
                            />
                        </SidebarGroup>
                        <SidebarGroup className="mt-4 py-0">
                            <SidebarGroupLabel>Tililab</SidebarGroupLabel>
                            <SidebarNavLinks
                                items={[
                                    {
                                        title: 'Editions',
                                        href: '/admin/tililab/editions',
                                        icon: Trophy,
                                    },
                                    {
                                        title: 'Participants',
                                        href: '/admin/tililab/participants',
                                        icon: Users,
                                    },
                                ]}
                            />
                        </SidebarGroup>
                    </>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border bg-sidebar-accent/50 p-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
