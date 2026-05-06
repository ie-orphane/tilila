import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { home, login } from '@/routes';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';

export default function Navbar() {
    const { auth } = usePage().props;
    const { t } = useTranslation();
    const currentPath = (usePage().url || '/').split('?')[0] || '/';
    const [mobileOpen, setMobileOpen] = useState(false);
    const headerRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const navItems = useMemo(
        () => [
            {
                en: 'Home',
                fr: 'Accueil',
                ar: 'الرئيسية',
                href: home(),
            },
            { en: 'About', fr: 'À propos', ar: 'حول', href: '/about' },
            { en: 'Tililab', fr: 'Tililab', ar: 'تيليلاب', href: '/tililab' },
            { en: 'Tilila', fr: 'Tilila', ar: 'تيليلا', href: '/tilila' },
            // {
            //     en: 'Governance',
            //     fr: 'Gouvernance',
            //     ar: 'الحوكمة',
            //     href: '/gouvernance',
            // },
            { en: 'Experts', fr: 'Expertes', ar: 'الخبيرات', href: '/experts' },
            {
                en: 'Events',
                fr: 'Événements',
                ar: 'الفعاليات',
                href: '/events',
            },
            {
                en: 'Opportunities',
                fr: 'Opportunités',
                ar: 'الفرص',
                href: '/opportunities',
            },
            // { en: 'Media', fr: 'Média', ar: 'الوسائط', href: '/media' },
        ],
        [],
    );

    const normalizePath = (path) => {
        if (!path) return '/';
        const base = String(path).split('?')[0];
        if (base.length > 1 && base.endsWith('/')) return base.slice(0, -1);
        return base || '/';
    };

    const isActiveHref = (href) =>
        normalizePath(currentPath) === normalizePath(href);

    useEffect(() => {
        if (!mobileOpen) {
            return undefined;
        }

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                setMobileOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [mobileOpen]);

    useEffect(() => {
        if (!mobileOpen) {
            return undefined;
        }

        const onPointerDown = (event) => {
            const menuElement = mobileMenuRef.current;
            if (!menuElement) {
                return;
            }

            if (menuElement.contains(event.target)) {
                return;
            }

            setMobileOpen(false);
        };

        document.addEventListener('pointerdown', onPointerDown, true);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown, true);
        };
    }, [mobileOpen]);

    useEffect(() => {
        if (!mobileOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [mobileOpen]);

    const closeMobile = () => setMobileOpen(false);

    const authButtonClass =
        'inline-flex items-center justify-center rounded-full bg-alpha-blue px-5 py-2 text-sm font-semibold text-beta-blue transition-colors hover:bg-beta-blue hover:text-twhite';
    const dashboardHref =
        auth?.user?.role === 'expert' ? '/expert/dashboard' : '/admin/dashboard';

    return (
        <header
            ref={headerRef}
            className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur"
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:gap-6">
                <Link
                    href={home()}
                    className="flex shrink-0 items-center gap-3 text-tblack"
                    onClick={closeMobile}
                >
                    <img
                        src="/assets/logo.webp"
                        alt="Tilila"
                        className="h-10 w-auto object-contain"
                        loading="eager"
                        decoding="async"
                    />
                </Link>

                <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={[
                                'relative text-sm font-medium transition-colors',
                                isActiveHref(item.href)
                                    ? 'text-beta-blue'
                                    : 'text-tgray hover:text-tblack',
                            ].join(' ')}
                        >
                            <TransText en={item.en} fr={item.fr} ar={item.ar} />
                            {isActiveHref(item.href) ? (
                                <span
                                    aria-hidden="true"
                                    className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-beta-blue"
                                />
                            ) : null}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-3">
                    <LanguageSwitcher className="hidden md:flex" />
                    {auth?.user ? (
                        <Link href={dashboardHref} className={authButtonClass}>
                            <TransText
                                en="Dashboard"
                                fr="Tableau de bord"
                                ar="لوحة التحكم"
                            />
                        </Link>
                    ) : (
                        <Link href={login()} className={authButtonClass}>
                            <TransText
                                en="Login"
                                fr="Connexion"
                                ar="تسجيل الدخول"
                            />
                        </Link>
                    )}
                </div>

                <div className="ml-auto flex md:hidden">
                    <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-tblack transition-colors hover:bg-alpha-blue/40"
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav-menu"
                        aria-label={
                            mobileOpen
                                ? t('nav.mobileCloseMenuAria')
                                : t('nav.mobileOpenMenuAria')
                        }
                        onClick={() => setMobileOpen((open) => !open)}
                    >
                        {mobileOpen ? (
                            <X className="h-6 w-6" strokeWidth={2} />
                        ) : (
                            <Menu className="h-6 w-6" strokeWidth={2} />
                        )}
                    </button>
                </div>
            </div>

            {mobileOpen ? (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-tblack/10 md:hidden"
                        onClick={closeMobile}
                        aria-hidden="true"
                    />
                    <div
                        id="mobile-nav-menu"
                        ref={mobileMenuRef}
                        className="fixed inset-x-0 top-0 z-50 bg-background md:hidden"
                    >
                        <div className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background">
                            <div className="mx-auto flex h-16 max-w-7xl items-center justify-end px-4">
                                <button
                                    type="button"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-tblack transition-colors hover:bg-alpha-blue/40"
                                    aria-label={t('nav.mobileCloseMenuAria')}
                                    onClick={closeMobile}
                                >
                                    <X className="h-6 w-6" strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 pt-20 pb-3">
                            <div className="pb-2">
                                <LanguageSwitcher className="w-fit" />
                            </div>
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-tgray transition-colors hover:bg-alpha-blue/30 hover:text-tblack"
                                    onClick={closeMobile}
                                >
                                    <TransText
                                        en={item.en}
                                        fr={item.fr}
                                        ar={item.ar}
                                    />
                                </Link>
                            ))}
                            <div className="my-2 border-t border-border" />
                            {auth?.user ? (
                                <Link
                                    href={dashboardHref}
                                    className={`${authButtonClass} justify-center`}
                                    onClick={closeMobile}
                                >
                                    <TransText
                                        en="Dashboard"
                                        fr="Tableau de bord"
                                        ar="لوحة التحكم"
                                    />
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-2 pb-1">
                                    <Link
                                        href={login()}
                                        className={`${authButtonClass} justify-center`}
                                        onClick={closeMobile}
                                    >
                                        <TransText
                                            en="Login"
                                            fr="Connexion"
                                            ar="تسجيل الدخول"
                                        />
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </>
            ) : null}
        </header>
    );
}
