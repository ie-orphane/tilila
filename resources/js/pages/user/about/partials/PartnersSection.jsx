import TransText from '@/components/TransText';

function labelFromFilename(filename) {
    return String(filename || '')
        .replace(/\.[^.]+$/, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

const institutionalPartners = [
    'Logo-GAM-01-200x200.png',
    'Logo-Les-Imperiales-Black-01-300x143.png',
    'Logo-UACC-01-200x200.png',
].map((file) => ({
    id: `inst-${file}`,
    name: labelFromFilename(file),
    logoUrl: `/assets/PartenairesInstitutionnels/${file}`,
}));

const mediaPartners = [
    'JOOJ-MASTERBRAND-STRAWBERRY-91x100.png',
    'Lesiteinfo-Logo-Vector_page-0001-200x74.jpg',
    'logo-2m.ma-1-200x100.png',
    'Logo-Media-Marketing-200x76.png',
    'Logo-radio2M-01-182x100.png',
    'Logo-snrtnews-141x100.png',
    'Logo-URadio-def-3-01-1-141x100.png',
    'medias24-200x55.png',
].map((file) => ({
    id: `media-${file}`,
    name: labelFromFilename(file),
    logoUrl: `/assets/partenairesMedia/${file}`,
}));

export default function PartnersSection() {
    return (
        <section
            id="partners"
            className="scroll-mt-16 mx-auto max-w-7xl px-4 py-12"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="text-xs font-semibold tracking-widest text-tgray">
                        <TransText
                            en="PARTNERSHIP"
                            fr="PARTENARIAT"
                            ar="الشراكة"
                        />
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold text-tblack">
                        <TransText
                            en="Institutional Partners"
                            fr="Partenaires institutionnels"
                            ar="شركاء مؤسساتيون"
                        />
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-tgray">
                        <TransText
                            en="Building a network of allies advancing parity, diversity, and high-quality public discourse."
                            fr="Construire un réseau d’alliés qui font avancer la parité, la diversité et un débat public de qualité."
                            ar="بناء شبكة من الحلفاء لتعزيز المساواة والتنوع وجودة الخطاب العام."
                        />
                    </p>
                </div>

                <a
                    href="/#partners"
                    className="text-sm font-semibold text-beta-blue hover:underline"
                >
                    <TransText
                        en="Become a Partner"
                        fr="Devenir partenaire"
                        ar="كن شريكًا"
                    />
                </a>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {institutionalPartners.map((partner) => (
                    <div
                        key={partner.id}
                        className="group flex h-28 items-center justify-center rounded-2xl border border-border bg-white px-6 shadow-sm transition hover:shadow-md"
                    >
                        <img
                            src={partner.logoUrl}
                            alt={`${partner.name} logo`}
                            className="h-20 w-full max-w-88 object-contain transition group-hover:scale-[1.02]"
                            loading="lazy"
                            decoding="async"
                            onError={(event) => {
                                event.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-10 flex items-end justify-between gap-4">
                <h3 className="text-lg font-semibold text-tblack">
                    <TransText
                        en="Media Partners"
                        fr="Partenaires médias"
                        ar="شركاء إعلاميون"
                    />
                </h3>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {mediaPartners.map((partner) => (
                    <div
                        key={partner.id}
                        className="group flex h-20 items-center justify-center rounded-2xl border border-border bg-white px-4 shadow-sm transition hover:shadow-md"
                    >
                        <img
                            src={partner.logoUrl}
                            alt={`${partner.name} logo`}
                            className="h-14 w-full object-contain transition group-hover:scale-[1.02]"
                            loading="lazy"
                            decoding="async"
                            onError={(event) => {
                                event.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
