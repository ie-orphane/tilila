import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import TransText from '@/components/TransText';

export default function ContactSection() {
    const { t } = useTranslation();

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <section
            id="contact"
            className="scroll-mt-16 mx-auto max-w-7xl px-4 py-14"
        >
            <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-5">
                    <div className="text-xs font-semibold tracking-widest text-tgray">
                        <TransText en="CONTACT" fr="CONTACT" ar="تواصل" />
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold text-tblack">
                        <TransText
                            en="Contact Us"
                            fr="Nous contacter"
                            ar="اتصل بنا"
                        />
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-tgray">
                        <TransText
                            en="Reach out for partnerships, media inquiries, or program questions. We’ll get back to you as soon as possible."
                            fr="Contactez-nous pour des partenariats, des demandes médias ou des questions sur nos programmes. Nous vous répondrons au plus vite."
                            ar="تواصل معنا للشراكات أو الاستفسارات الإعلامية أو أسئلة البرامج. سنعود إليك في أقرب وقت ممكن."
                        />
                    </p>

                    <div className="mt-6 space-y-4 text-sm text-tgray">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-full bg-alpha-blue text-beta-blue">
                                <MapPin className="size-4" />
                            </span>
                            <div>
                                <div className="font-semibold text-tblack">
                                    <TransText
                                        en="Headquarters"
                                        fr="Siège"
                                        ar="المقر"
                                    />
                                </div>
                                <div>Casablanca, Morocco</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-full bg-alpha-blue text-beta-blue">
                                <Mail className="size-4" />
                            </span>
                            <div>
                                <div className="font-semibold text-tblack">
                                    <TransText
                                        en="Email Us"
                                        fr="Écrivez-nous"
                                        ar="راسلنا"
                                    />
                                </div>
                                <a
                                    className="hover:text-tblack"
                                    href="mailto:contact@tilila.ma"
                                >
                                    contact@tilila.ma
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-full bg-alpha-blue text-beta-blue">
                                <Phone className="size-4" />
                            </span>
                            <div>
                                <div className="font-semibold text-tblack">
                                    <TransText
                                        en="Call Us"
                                        fr="Appelez-nous"
                                        ar="اتصل بنا"
                                    />
                                </div>
                                <a
                                    className="hover:text-tblack"
                                    href="tel:+212522000000"
                                >
                                    +212 5 22 00 00 00
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-border bg-background p-6"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <h3 className="text-base font-semibold text-tblack">
                                <TransText
                                    en="Send an Inquiry"
                                    fr="Envoyer une demande"
                                    ar="إرسال استفسار"
                                />
                            </h3>
                            <span className="text-xs font-medium text-tgray">
                                <TransText
                                    en="We respond within 1–2 business days"
                                    fr="Nous répondons sous 1 à 2 jours ouvrés"
                                    ar="نرد خلال يوم إلى يومين عمل"
                                />
                            </span>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <label className="grid gap-2 text-sm">
                                <span className="font-medium text-tblack">
                                    <TransText
                                        en="Full Name"
                                        fr="Nom complet"
                                        ar="الاسم الكامل"
                                    />
                                </span>
                                <input
                                    className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-tblack placeholder:text-tgray focus:ring-2 focus:ring-beta-blue/30 focus:outline-none"
                                    placeholder={t(
                                        'contact.form.namePlaceholder',
                                    )}
                                    name="fullName"
                                    autoComplete="name"
                                />
                            </label>

                            <label className="grid gap-2 text-sm">
                                <span className="font-medium text-tblack">
                                    <TransText
                                        en="Email"
                                        fr="E-mail"
                                        ar="البريد الإلكتروني"
                                    />
                                </span>
                                <input
                                    className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-tblack placeholder:text-tgray focus:ring-2 focus:ring-beta-blue/30 focus:outline-none"
                                    placeholder={t(
                                        'contact.form.emailPlaceholder',
                                    )}
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                />
                            </label>

                            <label className="grid gap-2 text-sm sm:col-span-2">
                                <span className="font-medium text-tblack">
                                    <TransText
                                        en="Subject"
                                        fr="Objet"
                                        ar="الموضوع"
                                    />
                                </span>
                                <input
                                    className="h-11 rounded-xl border border-border bg-background px-4 text-sm text-tblack placeholder:text-tgray focus:ring-2 focus:ring-beta-blue/30 focus:outline-none"
                                    placeholder={t(
                                        'contact.form.subjectPlaceholder',
                                    )}
                                    name="subject"
                                />
                            </label>

                            <label className="grid gap-2 text-sm sm:col-span-2">
                                <span className="font-medium text-tblack">
                                    <TransText
                                        en="Message"
                                        fr="Message"
                                        ar="الرسالة"
                                    />
                                </span>
                                <textarea
                                    className="min-h-32 resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-tblack placeholder:text-tgray focus:ring-2 focus:ring-beta-blue/30 focus:outline-none"
                                    placeholder={t(
                                        'contact.form.messagePlaceholder',
                                    )}
                                    name="message"
                                />
                            </label>
                        </div>

                        <div className="mt-6 flex items-center justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-full bg-beta-blue px-6 py-2.5 text-sm font-semibold text-twhite transition-opacity hover:opacity-90"
                            >
                                <Send className="size-4" />
                                <TransText
                                    en="Send Inquiry"
                                    fr="Envoyer"
                                    ar="إرسال"
                                />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
