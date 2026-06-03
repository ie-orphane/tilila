import React from 'react';
import { Link } from '@inertiajs/react';
import TransText from '@/components/TransText';

function Card({ title, body, href, cta }) {
    return (
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm ring-1 ring-border/60">
            <h3 className="text-base font-extrabold text-foreground">{title}</h3>
            <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {body}
            </div>
            {href ? (
                <div className="mt-4">
                    <Link
                        href={href}
                        className="text-sm font-semibold text-beta-blue hover:underline"
                    >
                        {cta}
                    </Link>
                </div>
            ) : null}
        </div>
    );
}

export default function AboutOverviewSection() {
    return (
        <section
            id="overview"
            className="scroll-mt-16 mx-auto max-w-7xl px-4 pb-14 pt-4"
        >
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    <TransText
                        en="What is Tilila?"
                        fr="Qu’est-ce que Tilila ?"
                        ar="ما هي تيليلا؟"
                    />
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    <TransText
                        en="Trophée Tilila is an annual award organized by 2M (Moroccan television) through its Comité Parité et Diversité (Parity and Diversity Committee). It honours the most inclusive, respectful, and committed advertising campaigns—especially those that promote a positive image of women, gender equality (parité), diversity, and inclusion in Moroccan advertising. It has become a major reference for Morocco’s advertising and communication industry."
                        fr="Le Trophée Tilila est une distinction annuelle organisée par 2M (chaîne marocaine) via son Comité Parité et Diversité. Il récompense les campagnes publicitaires les plus inclusives, respectueuses et engagées—en particulier celles qui valorisent les femmes, la parité, la diversité et l’inclusion dans la publicité marocaine. C’est aujourd’hui une référence majeure pour les professionnels de la communication."
                        ar="جائزة تيليلا هي تكريم سنوي تنظمه قناة 2M المغربية عبر لجنة المساواة والتنوع. تُكرّم الحملات الإعلانية الأكثر شمولاً واحتراماً والتزاماً—خصوصاً ما يعزز صورة المرأة والمساواة بين الجنسين والتنوع والإدماج في الإعلان المغربي. وأصبحت مرجعاً رئيسياً في قطاع الإعلان والتواصل بالمغرب."
                    />
                </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
                <Card
                    title={
                        <TransText en="Vision" fr="Vision" ar="الرؤية" />
                    }
                    body={
                        <TransText
                            en="To contribute to a more just, respectful, and inclusive society through advertising and media. Tilila aims to make advertising a driver of positive social change by fighting stereotypes—especially gender stereotypes—and giving visibility to all parts of Moroccan society, including women, rural communities, and diversity."
                            fr="Contribuer à une société plus juste, respectueuse et inclusive par la publicité et les médias. Tilila entend faire de la publicité un levier de changement social positif en luttant contre les stéréotypes (notamment de genre) et en donnant de la visibilité à toutes les composantes de la société marocaine."
                            ar="المساهمة في مجتمع أكثر عدلاً واحتراماً وشمولاً عبر الإعلان والإعلام. تسعى تيليلا إلى جعل الإعلان محرّكاً للتغيير الاجتماعي الإيجابي عبر محاربة الصور النمطية—خصوصاً المتعلقة بالنوع الاجتماعي—وإبراز كل مكوّنات المجتمع المغربي بمن فيهن النساء والعالم القروي والتنوع."
                        />
                    }
                />
                <Card
                    title={
                        <TransText en="Mission" fr="Mission" ar="المهمة" />
                    }
                    body={
                        <ul className="list-disc space-y-2 ps-5">
                            <li>
                                <TransText
                                    en="Raise awareness among advertisers and agencies on parity, equality, respect, and inclusion."
                                    fr="Sensibiliser les annonceurs et les agences aux valeurs de parité, d’égalité, de respect et d’inclusion."
                                    ar="توعية المعلنين والوكالات الإعلانية بقيم المساواة والتكافؤ والاحترام والإدماج."
                                />
                            </li>
                            <li>
                                <TransText
                                    en="Reward campaigns that break stereotypes and promote a dignified, modern, and authentic image of women and diverse groups."
                                    fr="Récompenser les campagnes qui brisent les stéréotypes et valorisent une image digne, moderne et authentique des femmes et de la diversité."
                                    ar="تكريم أفضل الحملات التي تكسر الصور النمطية وتعزز صورة نسائية ومجتمعية معاصرة وموثوقة."
                                />
                            </li>
                            <li>
                                <TransText
                                    en="Encourage responsible, committed advertising that reflects Moroccan society in all its diversity."
                                    fr="Encourager une publicité responsable et engagée qui reflète la société marocaine dans toute sa diversité."
                                    ar="تشجيع إعلان مسؤول وملتزم يعكس المجتمع المغربي بكل تنوعه."
                                />
                            </li>
                        </ul>
                    }
                    href="/tilila"
                    cta={
                        <TransText
                            en="Discover Trophée Tilila →"
                            fr="Découvrir le Trophée Tilila →"
                            ar="اكتشف جائزة تيليلا →"
                        />
                    }
                />
                <Card
                    title={
                        <TransText
                            en="Positioning"
                            fr="Positionnement"
                            ar="التموقع"
                        />
                    }
                    body={
                        <TransText
                            en="Tilila is positioned as “the trophy for inclusive advertising” (Le trophée pour une publicité inclusive)—Morocco’s benchmark award for responsible, committed communication. It stands out by prioritising societal impact over purely creative or commercial criteria alone."
                            fr="Tilila se positionne comme « le trophée pour une publicité inclusive »—la référence marocaine pour une communication responsable et engagée, avec un accent sur l’impact sociétal plutôt que sur les seuls critères créatifs ou commerciaux."
                            ar="تموضع تيليلا كـ «الجائزة للإعلان الشامل»—مرجع المغرب للتواصل المسؤول والملتزم، مع إبراز الأثر المجتمعي أكثر من المعايير الإبداعية أو التجارية وحدها."
                        />
                    }
                    href="/tilila"
                    cta={
                        <TransText
                            en="Tilila programme →"
                            fr="Programme Tilila →"
                            ar="برنامج تيليلا →"
                        />
                    }
                />
                <Card
                    title={
                        <TransText en="Values" fr="Valeurs" ar="القيم" />
                    }
                    body={
                        <ul className="list-disc space-y-1.5 ps-5">
                            <li>
                                <TransText
                                    en="Parity (gender equality)"
                                    fr="Parité (égalité femmes-hommes)"
                                    ar="المساواة بين الجنسين (التكافؤ)"
                                />
                            </li>
                            <li>
                                <TransText
                                    en="Diversity and inclusion"
                                    fr="Diversité et inclusion"
                                    ar="التنوع والإدماج"
                                />
                            </li>
                            <li>
                                <TransText
                                    en="Respect for human dignity"
                                    fr="Respect de la dignité humaine"
                                    ar="احترام الكرامة الإنسانية"
                                />
                            </li>
                            <li>
                                <TransText
                                    en="Fight against stereotypes"
                                    fr="Lutte contre les stéréotypes"
                                    ar="محاربة الصور النمطية"
                                />
                            </li>
                            <li>
                                <TransText
                                    en="Authenticity and social responsibility in advertising"
                                    fr="Authenticité et responsabilité sociale dans la publicité"
                                    ar="الأصالة والمسؤولية الاجتماعية في الإعلان"
                                />
                            </li>
                        </ul>
                    }
                    href="/gouvernance"
                    cta={
                        <TransText
                            en="Governance & charter →"
                            fr="Gouvernance & charte →"
                            ar="الحوكمة والميثاق →"
                        />
                    }
                />
            </div>
        </section>
    );
}
