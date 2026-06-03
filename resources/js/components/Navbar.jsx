import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { home, login } from '@/routes';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import TransText from '@/components/TransText';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/contexts/TranslationContext';

const ABOUT_PATH = '/about';

const aboutMenuItems = [
    {
        hash: 'overview',
        en: 'What is Tilila?',
        fr: 'Qu’est-ce que Tilila ?',
        ar: 'ما هي تيليلا؟',
    },
    {
        hash: 'mission',
        en: 'History & mission',
        fr: 'Histoire & mission',
        ar: 'التاريخ والمهمة',
    },
    {
        hash: 'committee',
        en: 'Parity & Diversity Committee',
        fr: 'Comité Parité et Diversité',
        ar: 'لجنة المساواة والتنوع',
    },
    {
        hash: 'partners',
        en: 'Partners',
        fr: 'Partenaires',
        ar: 'الشركاء',
    },
    {
        hash: 'tililab',
        en: 'Tililab',
        fr: 'Tililab',
        ar: 'تيليلاب',
    },
    {
        hash: 'contact',
        en: 'Contact',
        fr: 'Contact',
        ar: 'تواصل',
    },
];

export default function Navbar() {
    const { auth } = usePage().props;
    const { t } = useTranslation();
    const currentPath = (usePage().url || '/').split('?')[0] || '/';
    const [mobileOpen, setMobileOpen] = useState(false);
    const [aboutMobileOpen, setAboutMobileOpen] = useState(false);
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
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
            {
                en: 'Tilala Events',
                fr: 'Tilila Événements',
                ar: 'فعاليات تيليلا',
                href: '/events',
            },
            // { en: 'Tilila Experts', fr: 'Tilala Expertes', ar: 'خبيرات تيليلا', href: '/experts' },
            // { en: 'Tilila Learn', fr: 'Tilila Learn', ar: 'تعلم تيليلا', href: '/learn' },
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

    const closeMobile = () => {
        setMobileOpen(false);
        setAboutMobileOpen(false);
    };

    const isAboutPage = normalizePath(currentPath) === ABOUT_PATH;

    const scrollToAboutSection = (hash) => {
        const target = document.getElementById(hash);
        if (!target) {
            return;
        }

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', `${ABOUT_PATH}#${hash}`);
    };

    const handleAboutSectionClick = (event, hash) => {
        if (isAboutPage) {
            event.preventDefault();
            scrollToAboutSection(hash);
        }

        setAboutDropdownOpen(false);
        closeMobile();
    };

    const authButtonClass =
        'inline-flex items-center justify-center rounded-full bg-alpha-blue px-5 py-2 text-sm font-semibold text-beta-blue transition-colors hover:bg-beta-blue hover:text-twhite';
    const registerButtonClass =
        'inline-flex items-center justify-center rounded-full border border-beta-blue/30 bg-transparent px-5 py-2 text-sm font-semibold text-beta-blue transition-colors hover:bg-beta-blue hover:text-twhite';
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
                    <TransText en="Tilila" fr="Tilila" ar="تيليلا" />
                </Link>

                <nav className="hidden flex-1 items-center justify-center gap-6 lg:gap-8 md:flex">
                    {navItems.slice(0, 1).map((item) => (
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

                    <DropdownMenu
                        open={aboutDropdownOpen}
                        onOpenChange={setAboutDropdownOpen}
                    >
                        <DropdownMenuTrigger
                            type="button"
                            className={[
                                'relative inline-flex items-center gap-1 text-sm font-medium transition-colors outline-none',
                                isAboutPage
                                    ? 'text-beta-blue'
                                    : 'text-tgray hover:text-tblack',
                            ].join(' ')}
                        >
                            <TransText en="About" fr="À propos" ar="حول" />
                            <ChevronDown className="size-4 opacity-70" />
                            {isAboutPage ? (
                                <span
                                    aria-hidden="true"
                                    className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-beta-blue"
                                />
                            ) : null}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="min-w-52">
                            {aboutMenuItems.map((item) => (
                                <DropdownMenuItem key={item.hash} asChild>
                                    <Link
                                        href={`${ABOUT_PATH}#${item.hash}`}
                                        className="cursor-pointer"
                                        onClick={(event) =>
                                            handleAboutSectionClick(
                                                event,
                                                item.hash,
                                            )
                                        }
                                    >
                                        <TransText
                                            en={item.en}
                                            fr={item.fr}
                                            ar={item.ar}
                                        />
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {navItems.slice(1).map((item) => (
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

                <div className="ml-auto hidden items-center gap-3 md:flex">
                    {/* <Link
                        href="/experts"
                        className={registerButtonClass}
                    >
                        <TransText
                            en="Find an expert"
                            fr="Trouver une experte"
                            ar="اعثر على خبيرة"
                        />
                    </Link> */}
                    <LanguageSwitcher />
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
                            {navItems.slice(0, 1).map((item) => (
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

                            <div className="rounded-lg">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-tgray transition-colors hover:bg-alpha-blue/30 hover:text-tblack"
                                    aria-expanded={aboutMobileOpen}
                                    onClick={() =>
                                        setAboutMobileOpen((open) => !open)
                                    }
                                >
                                    <TransText
                                        en="About"
                                        fr="À propos"
                                        ar="حول"
                                    />
                                    <ChevronDown
                                        className={[
                                            'size-4 transition-transform',
                                            aboutMobileOpen
                                                ? 'rotate-180'
                                                : '',
                                        ].join(' ')}
                                    />
                                </button>
                                {aboutMobileOpen ? (
                                    <div className="mt-1 flex flex-col gap-0.5 border-s-2 border-beta-blue/30 ps-3">
                                        {aboutMenuItems.map((item) => (
                                            <Link
                                                key={item.hash}
                                                href={`${ABOUT_PATH}#${item.hash}`}
                                                className="rounded-lg px-3 py-2 text-sm text-tgray transition-colors hover:bg-alpha-blue/30 hover:text-tblack"
                                                onClick={(event) =>
                                                    handleAboutSectionClick(
                                                        event,
                                                        item.hash,
                                                    )
                                                }
                                            >
                                                <TransText
                                                    en={item.en}
                                                    fr={item.fr}
                                                    ar={item.ar}
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                ) : null}
                            </div>

                            {navItems.slice(1).map((item) => (
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

                            <Link
                                href="/experts"
                                className={`${registerButtonClass} justify-center`}
                                onClick={closeMobile}
                            >
                                <TransText
                                    en="Find an expert"
                                    fr="Trouver une experte"
                                    ar="اعثر على خبيرة"
                                />
                            </Link>
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
