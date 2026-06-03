import { Link, useForm, usePage } from '@inertiajs/react';
import { Mail, MessageCircle, Twitter } from 'lucide-react';
import { useEffect } from 'react';
import { login } from '@/routes';
import { useTranslation } from '@/contexts/TranslationContext';
import TransText from '@/components/TransText';

export default function Footer() {
    const { t, locale } = useTranslation();
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        locale,
    });

    useEffect(() => {
        setData('locale', locale);
    }, [locale, setData]);

    const submitNewsletter = (e) => {
        e.preventDefault();
        post('/newsletter', {
            preserveScroll: true,
            onSuccess: () => reset('email'),
        });
    };

    return (
        <footer className="border-t border-border bg-background">
            <div className="mx-auto max-w-7xl px-4 py-14">
                <div className="grid gap-10 md:grid-cols-12">
                    <div className="md:col-span-4">
                        <div className="flex items-center gap-3 text-tblack">
                            <img
                                src="/assets/logo.webp"
                                alt="Tilila"
                                className="size-25 object-contain"
                                loading="eager"
                                decoding="async"
                            />
                        </div>

                        <p className="mt-5 max-w-xs text-sm leading-6 text-tgray">
                            <TransText
                                en="Tilila connects experts and institutions across Morocco and Africa — programme EDI by SOREAD 2M."
                                fr="Tilila relie expertes et institutions au Maroc et en Afrique — programme EDI porté par SOREAD 2M."
                                ar="تربط تيليلا الخبيرات والمؤسسات في المغرب وإفريقيا — برنامج EDI من SOREAD 2M."
                            />
                        </p>

                        <div className="mt-5 flex items-center gap-4 text-tgray">
                            <a
                                href="/"
                                aria-label={t('footer.aria.twitter')}
                                className="inline-flex size-9 items-center justify-center rounded-full bg-alpha-blue text-beta-blue transition-colors hover:bg-beta-blue hover:text-twhite"
                            >
                                <Twitter className="size-4" />
                            </a>
                            <a
                                href="/"
                                aria-label={t('footer.aria.community')}
                                className="inline-flex size-9 items-center justify-center rounded-full bg-alpha-blue text-beta-blue transition-colors hover:bg-beta-blue hover:text-twhite"
                            >
                                <MessageCircle className="size-4" />
                            </a>
                            <a
                                href="mailto:contact@tilila.ma"
                                aria-label={t('footer.aria.email')}
                                className="inline-flex size-9 items-center justify-center rounded-full bg-alpha-blue text-beta-blue transition-colors hover:bg-beta-blue hover:text-twhite"
                            >
                                <Mail className="size-4" />
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-2 md:col-start-6">
                        <h3 className="text-sm font-semibold text-tblack">
                            <TransText
                                en="Navigate"
                                fr="Navigation"
                                ar="التصفح"
                            />
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm text-tgray">
                            <li>
                                <Link
                                    href="/about"
                                    className="transition-colors hover:text-tblack"
                                >
                                    <TransText
                                        en="About"
                                        fr="À propos"
                                        ar="حول"
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/events"
                                    className="transition-colors hover:text-tblack"
                                >
                                    <TransText
                                        en="Events"
                                        fr="Événements"
                                        ar="الفعاليات"
                                    />
                                </Link>
                            </li>
                            {/* <li>
                                <Link
                                    href="/experts"
                                    className="transition-colors hover:text-tblack"
                                >
                                    <TransText
                                        en="Experts"
                                        fr="Expertes"
                                        ar="الخبيرات"
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/learn"
                                    className="transition-colors hover:text-tblack"
                                >
                                    Learn
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/plan-du-site"
                                    className="transition-colors hover:text-tblack"
                                >
                                    <TransText
                                        en="Site map"
                                        fr="Plan du site"
                                        ar="خريطة الموقع"
                                    />
                                </Link>
                            </li> */}
                            <li>
                                <Link
                                    href="/mentions-legales"
                                    className="transition-colors hover:text-tblack"
                                >
                                    <TransText
                                        en="Legal & RGPD"
                                        fr="Mentions légales"
                                        ar="قانوني"
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={login()}
                                    className="transition-colors hover:text-tblack"
                                >
                                    <TransText
                                        en="Login"
                                        fr="Connexion"
                                        ar="تسجيل الدخول"
                                    />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-4">
                        <h3 className="text-sm font-semibold text-tblack">
                            <TransText
                                en="Newsletter"
                                fr="Newsletter"
                                ar="النشرة"
                            />
                        </h3>
                        <form
                            onSubmit={submitNewsletter}
                            className="mt-4 flex flex-col gap-2 sm:flex-row"
                        >
                            <input
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="email@example.com"
                                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-beta-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
                            >
                                <TransText
                                    en="Subscribe"
                                    fr="S’inscrire"
                                    ar="اشتراك"
                                />
                            </button>
                        </form>
                        {errors.email ? (
                            <p className="mt-2 text-xs text-destructive">
                                {errors.email}
                            </p>
                        ) : null}
                        {flash?.success ? (
                            <p className="mt-2 text-xs text-alpha-green">
                                {flash.success}
                            </p>
                        ) : null}

                        <h3 className="mt-8 text-sm font-semibold text-tblack">
                            <TransText en="Contact" fr="Contact" ar="التواصل" />
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm text-tgray">
                            <li>
                                <TransText
                                    en="Casablanca, Morocco"
                                    fr="Casablanca, Maroc"
                                    ar="الدار البيضاء، المغرب"
                                />
                            </li>
                            <li>
                                <a
                                    href="mailto:contact@tilila.ma"
                                    className="transition-colors hover:text-tblack"
                                >
                                    contact@tilila.ma
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+212522000000"
                                    className="transition-colors hover:text-tblack"
                                >
                                    +212 5 22 00 00 00
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-tgray md:flex-row md:items-center md:justify-between">
                    <span>
                        <TransText
                            en="© 2026 SOREAD 2M · Tilila programme."
                            fr="© 2026 SOREAD 2M · Programme Tilila."
                            ar="© 2026 SOREAD 2M · برنامج تيليلا."
                        />
                    </span>
                    <span>
                        <TransText
                            en="Powered by"
                            fr="Propulsé par"
                            ar="بدعم من"
                        />{' '}
                        <span className="font-semibold">2M</span>
                    </span>
                </div>
            </div>
        </footer>
    );
}
