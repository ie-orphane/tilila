import TransText from '@/components/TransText';
import { useTranslation } from '@/contexts/TranslationContext';

const stats = [
    {
        value: '2013',
        en: 'CPD Committee at 2M',
        fr: 'Création du CPD 2M',
        ar: 'لجنة المساواة والتنوع بـ2M',
    },
    {
        value: '2018',
        en: 'First Trophée Tilila edition',
        fr: '1re édition du Trophée',
        ar: 'الدورة الأولى للجائزة',
    },
    {
        value: '7',
        en: 'Editions to date (2025: rural women)',
        fr: 'Éditions à ce jour (2025 : femmes rurales)',
        ar: 'دورات حتى اليوم (2025: نساء ريفيات)',
    },
];

export default function MissionSection() {
    const { locale } = useTranslation();
    const imageAlt =
        locale === 'ar'
            ? 'لقاء مهني حول الإعلام والتواصل'
            : locale === 'fr'
              ? 'Réunion professionnelle autour des médias'
              : 'Professional meeting about media and communication';

    return (
        <section
            id="mission"
            className="scroll-mt-16 mx-auto max-w-7xl px-4 py-10"
        >
            <div className="grid items-center gap-10 lg:grid-cols-12">
                <div className="lg:col-span-6">
                    <div className="overflow-hidden rounded-2xl border border-border bg-secondary">
                        <img
                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                            alt={imageAlt}
                            className="aspect-4/3 w-full object-cover"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                </div>

                <div className="lg:col-span-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-alpha-blue px-4 py-1 text-xs font-semibold text-beta-blue">
                        <span className="size-2 rounded-full bg-beta-blue" />
                        <span>
                            <TransText
                                en="History & committee"
                                fr="Histoire & comité"
                                ar="التاريخ واللجنة"
                            />
                        </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-semibold tracking-tight text-tblack">
                        <TransText
                            en="Comité Parité et Diversité — 2M"
                            fr="Comité Parité et Diversité — 2M"
                            ar="لجنة المساواة والتنوع — 2M"
                        />
                    </h2>

                    <p className="mt-4 text-sm leading-6 text-tgray">
                        <TransText
                            en="The Comité Parité et Diversité 2M was created in 2013. Its mission is to promote gender equality, the image of women in media, and diversity across 2M’s programmes and content, while combating all forms of discrimination."
                            fr="Le Comité Parité et Diversité de 2M a été créé en 2013. Sa mission : promouvoir l’égalité femmes-hommes, l’image des femmes dans les médias et la diversité dans les programmes et contenus de 2M, tout en luttant contre toutes les formes de discrimination."
                            ar="أُنشئت لجنة المساواة والتنوع بقناة 2M سنة 2013. مهمتها تعزيز المساواة بين الجنسين وصورة المرأة في الإعلام والتنوع في برامج ومضامين القناة، مع مواجهة كل أشكال التمييز."
                        />
                    </p>

                    <p className="mt-4 text-sm leading-6 text-tgray">
                        <TransText
                            en="Trophée Tilila was launched in 2018 as one of the Committee’s flagship initiatives. The award celebrates advertising that reflects society fairly and responsibly—and keeps growing as a reference for the sector."
                            fr="Le Trophée Tilila a été lancé en 2018 comme initiative phare du Comité. Il met en lumière une publicité qui reflète la société avec équité et responsabilité—et s’impose comme une référence pour le secteur."
                            ar="أُطلقت جائزة تيليلا سنة 2018 كإحدى الركائز الرئيسية للجنة. تُكرّم إعلاناً يعكس المجتمع بعدالة ومسؤولية—وتواصل النمو كمرجع للقطاع."
                        />
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {stats.map((item) => (
                            <div
                                key={`${item.value}-${item.en}`}
                                className="rounded-2xl border border-border bg-background p-5"
                            >
                                <div className="text-2xl font-semibold text-tblack">
                                    {item.value}
                                </div>
                                <div className="mt-1 text-xs font-medium leading-snug text-tgray">
                                    <TransText
                                        en={item.en}
                                        fr={item.fr}
                                        ar={item.ar}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
