import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import TransText from '@/components/TransText';

export default function TililabCtaSection() {
    return (
        <section
            id="tililab"
            className="scroll-mt-16 mx-auto max-w-7xl px-4 py-14"
        >
            <div className="overflow-hidden rounded-3xl border border-border bg-alpha-blue">
                <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-7">
                        <div className="text-xs font-semibold tracking-widest text-beta-blue">
                            <TransText en="TILILAB" fr="TILILAB" ar="تيليلاب" />
                        </div>
                        <h2 className="mt-3 text-2xl font-semibold text-tblack sm:text-3xl">
                            <TransText
                                en="Explore the Tililab program"
                                fr="Découvrir le programme Tililab"
                                ar="اكتشف برنامج تيليلاب"
                            />
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-tgray">
                            <TransText
                                en="Discover the guidelines, key dates, and previous winners. Tililab supports projects that amplify parity and diversity in media."
                                fr="Découvrez les directives, les dates clés et les lauréats précédents. Tililab soutient des projets qui renforcent la parité et la diversité dans les médias."
                                ar="اطّلع على الإرشادات والتواريخ الرئيسية والفائزين السابقين. يدعم تيليلاب المشاريع التي تعزز المساواة والتنوع في الإعلام."
                            />
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <Link
                                href="/tililab"
                                className="inline-flex items-center gap-2 rounded-full bg-beta-blue px-6 py-2.5 text-sm font-semibold text-twhite transition-opacity hover:opacity-90"
                            >
                                <TransText
                                    en="Visit Tililab"
                                    fr="Visiter Tililab"
                                    ar="زيارة تيليلاب"
                                />
                                <ArrowRight className="size-4" />
                            </Link>
                            {/* <a
                                href="/tililab#key-dates"
                                className="inline-flex items-center justify-center rounded-full bg-background px-6 py-2.5 text-sm font-semibold text-tblack transition-colors hover:bg-secondary"
                            >
                                <TransText
                                    en="See key dates"
                                    fr="Voir les dates clés"
                                    ar="عرض التواريخ الرئيسية"
                                />
                            </a> */}
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="rounded-2xl bg-background/70 p-6">
                            <div className="grid gap-4">
                                <div className="rounded-2xl border border-border bg-background px-5 py-4">
                                    <div className="text-xs font-semibold tracking-widest text-tgray">
                                        <TransText en="WHO" fr="QUI" ar="مَن" />
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-tblack">
                                        <TransText
                                            en="Applicants & partners"
                                            fr="Candidats & partenaires"
                                            ar="المتقدمون والشركاء"
                                        />
                                    </div>
                                    <div className="mt-1 text-sm text-tgray">
                                        <TransText
                                            en="Journalists, media professionals, and organizations."
                                            fr="Journalistes, professionnels des médias et organisations."
                                            ar="الصحفيون، والمهنيون في مجال الإعلام، والمنظمات."
                                        />
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-border bg-background px-5 py-4">
                                    <div className="text-xs font-semibold tracking-widest text-tgray">
                                        <TransText
                                            en="WHAT"
                                            fr="QUOI"
                                            ar="ماذا"
                                        />
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-tblack">
                                        <TransText
                                            en="Support & recognition"
                                            fr="Soutien & reconnaissance"
                                            ar="الدعم والتقدير"
                                        />
                                    </div>
                                    <div className="mt-1 text-sm text-tgray">
                                        <TransText
                                            en="Training, mentoring, and visibility for impactful projects."
                                            fr="Formation, mentorat et visibilité pour des projets à impact."
                                            ar="تدريب وإرشاد وزيادة الظهور للمشاريع ذات الأثر."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
