/**
 * @deprecated
 * This file is the seeder source of truth for the hero_slides DB table.
 * It is no longer imported by HeroCarousel.jsx — slides are now served via
 * the Inertia shared prop `hero_slides` from HandleInertiaRequests.
 *
 * DO NOT DELETE until the HeroSlideSeeder has been confirmed to have run
 * successfully in production. After that, remove in a follow-up cleanup PR.
 *
 * Site-wide hero carousel: one slide per main nav section.
 * Each slide: full-bleed background image + overlay copy/CTAs (see HeroCarousel.jsx).
 * imageContain: true for logos or artwork that should not be cropped.
 */
export const HERO_CAROUSEL_SLIDES = [
    {
        key: 'home',
        imageSrc: '/assets/hero.png',
        imageAlt: {
            en: 'Women experts in discussion',
            fr: 'Expertes en discussion',
            ar: 'خبيرات في نقاش',
        },
        imageTint: 'from-beta-blue/35',
        badge: {
            en: 'An initiative by Tilila',
            fr: 'Une initiative de Tilila',
            ar: 'مبادرة من تيليلا',
        },
        titleBefore: {
            en: 'Empowering Women Experts,',
            fr: 'Valoriser les expertes,',
            ar: 'تمكين الخبيرات،',
        },
        titleAccent: {
            en: 'Shaping the Future',
            fr: 'façonner l’avenir',
            ar: 'وصناعة المستقبل',
        },
        description: {
            en: 'Connecting Moroccan and African women experts with media and institutions to drive parity, inclusion, and diversity in public discourse.',
            fr: 'Relier les expertes marocaines et africaines aux médias et aux institutions pour promouvoir la parité, l’inclusion et la diversité dans le débat public.',
            ar: 'ربط الخبيرات المغربيات والإفريقيات بوسائل الإعلام والمؤسسات لتعزيز المساواة والإدماج والتنوع في الخطاب العام.',
        },
        primaryCta: {
            en: 'Find an Expert',
            fr: 'Trouver une experte',
            ar: 'اعثر على خبيرة',
        },
        primaryHref: '/experts',
        secondaryCta: {
            en: 'Join Tilila Connect',
            fr: 'Rejoindre Tilila Connect',
            ar: 'انضم إلى Tilila Connect',
        },
        secondaryHref: '/about',
        cardKicker: {
            en: 'Voices of change',
            fr: 'Voix du changement',
            ar: 'أصوات التغيير',
        },
        cardLine: {
            en: 'Bridging expertise and visibility.',
            fr: 'Lier expertise et visibilité.',
            ar: 'ربط الخبرة بالظهور.',
        },
    },
    {
        key: 'about',
        imageSrc: '/assets/hero.png',
        imageAlt: {
            en: 'Team collaboration',
            fr: 'Collaboration d’équipe',
            ar: 'تعاون الفريق',
        },
        imageTint: 'from-beta-purple/30',
        badge: {
            en: 'About Tilila',
            fr: 'À propos de Tilila',
            ar: 'حول تيليلا',
        },
        titleBefore: {
            en: 'Transparency, parity, and',
            fr: 'Transparence, parité et',
            ar: 'الشفافية والتكافؤ و',
        },
        titleAccent: {
            en: 'collective impact',
            fr: 'impact collectif',
            ar: 'الأثر الجماعي',
        },
        description: {
            en: 'Discover our mission, values, and how we mobilize partners across media and civil society.',
            fr: 'Découvrez notre mission, nos valeurs et comment nous mobilisons des partenaires dans les médias et la société civile.',
            ar: 'اكتشف مهمتنا وقيمنا وكيف نحشد الشركاء في الإعلام والمجتمع المدني.',
        },
        primaryCta: {
            en: 'Learn more',
            fr: 'En savoir plus',
            ar: 'اعرف المزيد',
        },
        primaryHref: '/about',
        secondaryCta: null,
        secondaryHref: null,
        cardKicker: {
            en: 'Who we are',
            fr: 'Qui sommes-nous',
            ar: 'من نحن',
        },
        cardLine: {
            en: 'A more representative public conversation.',
            fr: 'Un débat public plus représentatif.',
            ar: 'حوار عام أكثر تمثيلاً.',
        },
    },
    {
        key: 'tililab',
        bannerImage: true,
        imageSrc: '/assets/tililab/tililab-banner.png',
        imageAlt: {
            en: 'Concours Tililab — creative bootcamp by 2M',
            fr: 'Concours Tililab — bootcamp créatif par 2M',
            ar: 'مسابقة تيليلاب — معسكر إبداعي من 2M',
        },
        primaryCta: {
            en: 'Past editions',
            fr: 'Éditions passées',
            ar: 'الدورات السابقة',
        },
        primaryHref: '/tililab#past-editions',
        secondaryCta: {
            en: 'Apply now',
            fr: 'Postuler',
            ar: 'قدّم الآن',
        },
        secondaryHref: '/tililab#how-to-apply',
    },
    {
        key: 'tilila',
        bannerImage: true,
        bannerImageContain: true,
        imagePosition: 'center',
        imageSrc: '/assets/tilila/tilila-awards-logo.png',
        imageAlt: {
            en: 'Les Débats Tilila — Trophée Tilila',
            fr: 'Les Débats Tilila — Trophée Tilila',
            ar: 'المناظرات تيليلا — تروفي تيليلا',
        },
        primaryCta: {
            en: 'Past editions',
            fr: 'Éditions passées',
            ar: 'الدورات السابقة',
        },
        primaryHref: '/tilila#past-editions',
        secondaryCta: {
            en: 'Participate',
            fr: 'Participer',
            ar: 'شارك',
        },
        secondaryHref: '/tilila#how-to-apply',
    },
    {
        key: 'gouvernance',
        imageContain: true,
        imageSrc: '/assets/organizer-logo.png',
        imageAlt: {
            en: 'Governance and partnership visual',
            fr: 'Visuel gouvernance et partenariat',
            ar: 'صورة الحوكمة والشراكة',
        },
        imageTint: 'from-beta-blue/45',
        badge: {
            en: 'Governance',
            fr: 'Gouvernance',
            ar: 'الحوكمة',
        },
        titleBefore: {
            en: 'Accountability and',
            fr: 'La responsabilité et',
            ar: 'المساءلة و',
        },
        titleAccent: {
            en: 'inclusive standards',
            fr: 'des standards inclusifs',
            ar: 'معايير شاملة',
        },
        description: {
            en: 'Our charter and policies ensure transparent, ethical collaboration across the media ecosystem.',
            fr: 'Notre charte et nos politiques garantissent une collaboration transparente et éthique dans l’écosystème médiatique.',
            ar: 'يضمن ميثاقنا وسياساتنا تعاوناً شفافاً وأخلاقياً في المنظومة الإعلامية.',
        },
        primaryCta: {
            en: 'View governance',
            fr: 'Voir la gouvernance',
            ar: 'عرض الحوكمة',
        },
        primaryHref: '/gouvernance',
        secondaryCta: null,
        secondaryHref: null,
        cardKicker: {
            en: 'CPD & charter',
            fr: 'CPD et charte',
            ar: 'الميثاق والسياسات',
        },
        cardLine: {
            en: 'Commitments you can trust.',
            fr: 'Des engagements fiables.',
            ar: 'التزامات موثوقة.',
        },
    },
    {
        key: 'experts',
        imageSrc: '/assets/hero.png',
        imageAlt: {
            en: 'Expert profiles and media',
            fr: 'Profils d’expertes et médias',
            ar: 'ملفات الخبيرات ووسائل الإعلام',
        },
        imageTint: 'from-alpha-blue/50',
        badge: {
            en: 'Experts',
            fr: 'Expertes et experts',
            ar: 'الخبراء',
        },
        titleBefore: {
            en: 'Find the right voice for',
            fr: 'Trouvez la bonne voix pour',
            ar: 'اعثر على الصوت المناسب لـ',
        },
        titleAccent: {
            en: 'your next story',
            fr: 'votre prochain sujet',
            ar: 'قصتك القادمة',
        },
        description: {
            en: 'Search profiles across economics, technology, health, law, and more — available for media and institutions.',
            fr: 'Recherchez des profils en économie, tech, santé, droit et plus encore — disponibles pour médias et institutions.',
            ar: 'ابحث عن ملفات في الاقتصاد والتقنية والصحة والقانون وغيرها — جاهزة للإعلام والمؤسسات.',
        },
        primaryCta: {
            en: 'Become an Expert',
            fr: 'Devenir experte',
            ar: 'أصبحي خبيرة',
        },
        primaryHref: '/experts/become',
        secondaryCta: {
            en: 'Browse experts',
            fr: 'Parcourir les profils',
            ar: 'تصفح الخبراء',
        },
        secondaryHref: '/experts#experts-directory',
        cardKicker: {
            en: 'Expert network',
            fr: 'Réseau d’expertes',
            ar: 'شبكة الخبيرات',
        },
        cardLine: {
            en: 'Verified expertise, one click away.',
            fr: 'Expertise vérifiée, en un clic.',
            ar: 'خبرة موثّقة بسهولة.',
        },
    },
    {
        key: 'events',
        imageContain: true,
        imageBg: 'white',
        imageSrc: '/assets/tilitalks/tilitalks-logo.png',
        imageAlt: {
            en: 'TiliTalks',
            fr: 'TiliTalks',
            ar: 'TiliTalks',
        },
        imageTint: 'from-beta-blue/40',
        badge: {
            en: 'Events',
            fr: 'Événements',
            ar: 'الفعاليات',
        },
        titleBefore: {
            en: 'Workshops, webinars, and',
            fr: 'Ateliers, webinaires et',
            ar: 'ورش وندوات و',
        },
        titleAccent: {
            en: 'TiliTalks',
            fr: 'TiliTalks',
            ar: 'TiliTalks',
        },
        description: {
            en: 'Stay connected with agendas, replays, and live discussions shaping media and parity.',
            fr: 'Restez informé des agendas, rediffusions et échanges en direct sur les médias et la parité.',
            ar: 'ابقَ على اطلاع بجداول الأعمال وإعادات البث والنقاشات الحية حول الإعلام والتكافؤ.',
        },
        primaryCta: {
            en: 'See events',
            fr: 'Voir les événements',
            ar: 'شاهد الفعاليات',
        },
        primaryHref: '/events',
        secondaryCta: null,
        secondaryHref: null,
        cardKicker: {
            en: 'On the agenda',
            fr: 'À l’agenda',
            ar: 'في الأجندة',
        },
        cardLine: {
            en: 'Join the conversation.',
            fr: 'Participez aux échanges.',
            ar: 'انضم إلى النقاش.',
        },
    },
    {
        key: 'opportunities',
        imageSrc: '/assets/trophee.png',
        imageAlt: {
            en: 'Opportunities and recognition',
            fr: 'Opportunités et reconnaissance',
            ar: 'فرص وتكريم',
        },
        imageTint: 'from-beta-green/35',
        badge: {
            en: 'Opportunities',
            fr: 'Opportunités',
            ar: 'الفرص',
        },
        titleBefore: {
            en: 'Grants, residencies, and',
            fr: 'Subventions, résidences et',
            ar: 'منح وإقامات و',
        },
        titleAccent: {
            en: 'calls for projects',
            fr: 'appels à projets',
            ar: 'دعوات للمشاريع',
        },
        description: {
            en: 'Discover open calls for journalists, creators, and organizations driving inclusion in media.',
            fr: 'Découvrez les appels ouverts aux journalistes, créateurs et organisations qui font progresser l’inclusion médiatique.',
            ar: 'اكتشف الدعوات المفتوحة للصحفيين والمبدعين والمنظمات التي تعزز الإدماج في الإعلام.',
        },
        primaryCta: {
            en: 'View opportunities',
            fr: 'Voir les opportunités',
            ar: 'عرض الفرص',
        },
        primaryHref: '/opportunities',
        secondaryCta: null,
        secondaryHref: null,
        cardKicker: {
            en: 'Open calls',
            fr: 'Appels en cours',
            ar: 'دعوات مفتوحة',
        },
        cardLine: {
            en: 'Apply before deadlines.',
            fr: 'Postulez avant les dates limites.',
            ar: 'قدّم قبل انتهاء الآجال.',
        },
    },
    {
        key: 'media',
        imageSrc: '/assets/talk.png',
        imageAlt: {
            en: 'Media production',
            fr: 'Production média',
            ar: 'الإنتاج الإعلامي',
        },
        imageTint: 'from-tblack/50',
        badge: {
            en: 'Media',
            fr: 'Média',
            ar: 'الوسائط',
        },
        titleBefore: {
            en: 'Stories, resources, and',
            fr: 'Récits, ressources et',
            ar: 'قصص وموارد و',
        },
        titleAccent: {
            en: 'curated content',
            fr: 'contenus choisis',
            ar: 'محتوى منتقى',
        },
        description: {
            en: 'Explore articles, features, and tools that spotlight expertise and inclusive narratives.',
            fr: 'Explorez articles, reportages et outils qui mettent en lumière l’expertise et des récits inclusifs.',
            ar: 'استكشف مقالات وأدوات تسلّط الضوء على الخبرة والسرديات الشاملة.',
        },
        primaryCta: {
            en: 'Explore media',
            fr: 'Explorer le média',
            ar: 'استكشف الوسائط',
        },
        primaryHref: '/media',
        secondaryCta: null,
        secondaryHref: null,
        cardKicker: {
            en: 'From the newsroom',
            fr: 'De la rédaction',
            ar: 'من التحرير',
        },
        cardLine: {
            en: 'Depth, context, and clarity.',
            fr: 'Profondeur, contexte et clarté.',
            ar: 'عمق وسياق ووضوح.',
        },
    },
];
