import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import AboutOverviewSection from '@/pages/user/about/partials/AboutOverviewSection';
import CommitteeSection from '@/pages/user/about/partials/CommitteeSection';
import ContactSection from '@/pages/user/about/partials/ContactSection';
import MissionSection from '@/pages/user/about/partials/MissionSection';
import PartnersSection from '@/pages/user/about/partials/PartnersSection';
import TililabCtaSection from '@/pages/user/about/partials/TililabCtaSection';
import ExpandedSections from '@/pages/user/about/partials/ExpandedSections';
import { useTranslation } from '@/contexts/TranslationContext';

function scrollToHashSection() {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) {
        return;
    }

    const target = document.getElementById(hash);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

export default function About() {
    useEffect(() => {
        scrollToHashSection();
    }, []);

    return (
        <>
            <AboutHead />
            <div>
                <div className="bg-beta-white">
                    <AboutOverviewSection />
                </div>
                <div className="bg-twhite py-8">
                    <MissionSection />
                </div>
                <div className="bg-beta-white py-8">
                    <CommitteeSection />
                </div>
                <div className="bg-twhite py-8">
                    <PartnersSection />
                </div>
                <div className="bg-beta-white py-8">
                    <TililabCtaSection />
                </div>
                <div className="bg-twhite py-8">
                    <ContactSection />
                </div>
                {/* <ExpandedSections /> */}
            </div>
        </>
    );
}

About.layout = (page) => <AppLayout>{page}</AppLayout>;

function AboutHead() {
    const { t } = useTranslation();
    return <Head title={t('about.headTitle')} />;
}
