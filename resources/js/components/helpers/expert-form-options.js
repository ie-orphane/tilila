const ALL_COUNTRY_CODES = [
    'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT',
    'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI',
    'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY',
    'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN',
    'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM',
    'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK',
    'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL',
    'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM',
    'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IM', 'IN', 'IO', 'IQ', 'IR',
    'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN',
    'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS',
    'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK',
    'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW',
    'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP',
    'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM',
    'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW',
    'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM',
    'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF',
    'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW',
    'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI',
    'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM', 'ZW',
];
const LANGUAGE_DATASET = [
    { value: 'ar', en: 'Arabic', fr: 'Arabe', ar: 'العربية' },
    { value: 'fr', en: 'French', fr: 'Français', ar: 'الفرنسية' },
    { value: 'en', en: 'English', fr: 'Anglais', ar: 'الإنجليزية' },
    { value: 'zgh', en: 'Amazigh', fr: 'Amazigh', ar: 'الأمازيغية' },
    { value: 'es', en: 'Spanish', fr: 'Espagnol', ar: 'الإسبانية' },
    { value: 'de', en: 'German', fr: 'Allemand', ar: 'الألمانية' },
    { value: 'it', en: 'Italian', fr: 'Italien', ar: 'الإيطالية' },
    { value: 'pt', en: 'Portuguese', fr: 'Portugais', ar: 'البرتغالية' },
    { value: 'nl', en: 'Dutch', fr: 'Néerlandais', ar: 'الهولندية' },
    { value: 'tr', en: 'Turkish', fr: 'Turc', ar: 'التركية' },
    { value: 'ru', en: 'Russian', fr: 'Russe', ar: 'الروسية' },
    { value: 'zh', en: 'Chinese', fr: 'Chinois', ar: 'الصينية' },
    { value: 'ja', en: 'Japanese', fr: 'Japonais', ar: 'اليابانية' },
    { value: 'ko', en: 'Korean', fr: 'Coréen', ar: 'الكورية' },
    { value: 'hi', en: 'Hindi', fr: 'Hindi', ar: 'الهندية' },
    { value: 'ur', en: 'Urdu', fr: 'Ourdou', ar: 'الأردية' },
    { value: 'fa', en: 'Persian', fr: 'Persan', ar: 'الفارسية' },
    { value: 'he', en: 'Hebrew', fr: 'Hébreu', ar: 'العبرية' },
    { value: 'sw', en: 'Swahili', fr: 'Swahili', ar: 'السواحيلية' },
    { value: 'ha', en: 'Hausa', fr: 'Haoussa', ar: 'الهوسا' },
    { value: 'am', en: 'Amharic', fr: 'Amharique', ar: 'الأمهرية' },
    { value: 'bn', en: 'Bengali', fr: 'Bengali', ar: 'البنغالية' },
    { value: 'pa', en: 'Punjabi', fr: 'Pendjabi', ar: 'البنجابية' },
    { value: 'ta', en: 'Tamil', fr: 'Tamoul', ar: 'التاميلية' },
    { value: 'te', en: 'Telugu', fr: 'Télougou', ar: 'التيلوغوية' },
    { value: 'ml', en: 'Malayalam', fr: 'Malayalam', ar: 'المالايالامية' },
    { value: 'mr', en: 'Marathi', fr: 'Marathe', ar: 'الماراثية' },
    { value: 'gu', en: 'Gujarati', fr: 'Gujarati', ar: 'الغوجاراتية' },
    { value: 'kn', en: 'Kannada', fr: 'Kannada', ar: 'الكانادية' },
    { value: 'id', en: 'Indonesian', fr: 'Indonésien', ar: 'الإندونيسية' },
    { value: 'ms', en: 'Malay', fr: 'Malais', ar: 'الماليزية' },
    { value: 'th', en: 'Thai', fr: 'Thaï', ar: 'التايلاندية' },
    { value: 'vi', en: 'Vietnamese', fr: 'Vietnamien', ar: 'الفيتنامية' },
    { value: 'tl', en: 'Tagalog', fr: 'Tagalog', ar: 'التاغالوغية' },
    { value: 'pl', en: 'Polish', fr: 'Polonais', ar: 'البولندية' },
    { value: 'uk', en: 'Ukrainian', fr: 'Ukrainien', ar: 'الأوكرانية' },
    { value: 'cs', en: 'Czech', fr: 'Tchèque', ar: 'التشيكية' },
    { value: 'sk', en: 'Slovak', fr: 'Slovaque', ar: 'السلوفاكية' },
    { value: 'hu', en: 'Hungarian', fr: 'Hongrois', ar: 'الهنغارية' },
    { value: 'ro', en: 'Romanian', fr: 'Roumain', ar: 'الرومانية' },
    { value: 'bg', en: 'Bulgarian', fr: 'Bulgare', ar: 'البلغارية' },
    { value: 'el', en: 'Greek', fr: 'Grec', ar: 'اليونانية' },
    { value: 'sv', en: 'Swedish', fr: 'Suédois', ar: 'السويدية' },
    { value: 'da', en: 'Danish', fr: 'Danois', ar: 'الدانماركية' },
    { value: 'no', en: 'Norwegian', fr: 'Norvégien', ar: 'النرويجية' },
    { value: 'fi', en: 'Finnish', fr: 'Finnois', ar: 'الفنلندية' },
    { value: 'is', en: 'Icelandic', fr: 'Islandais', ar: 'الأيسلندية' },
    { value: 'sr', en: 'Serbian', fr: 'Serbe', ar: 'الصربية' },
    { value: 'hr', en: 'Croatian', fr: 'Croate', ar: 'الكرواتية' },
    { value: 'bs', en: 'Bosnian', fr: 'Bosnien', ar: 'البوسنية' },
    { value: 'sq', en: 'Albanian', fr: 'Albanais', ar: 'الألبانية' },
    { value: 'sl', en: 'Slovenian', fr: 'Slovène', ar: 'السلوفينية' },
    { value: 'et', en: 'Estonian', fr: 'Estonien', ar: 'الإستونية' },
    { value: 'lv', en: 'Latvian', fr: 'Letton', ar: 'اللاتفية' },
    { value: 'lt', en: 'Lithuanian', fr: 'Lituanien', ar: 'الليتوانية' },
    { value: 'ga', en: 'Irish', fr: 'Irlandais', ar: 'الأيرلندية' },
    { value: 'cy', en: 'Welsh', fr: 'Gallois', ar: 'الويلزية' },
    { value: 'mt', en: 'Maltese', fr: 'Maltais', ar: 'المالطية' },
    { value: 'ca', en: 'Catalan', fr: 'Catalan', ar: 'الكتالونية' },
    { value: 'eu', en: 'Basque', fr: 'Basque', ar: 'الباسكية' },
    { value: 'gl', en: 'Galician', fr: 'Galicien', ar: 'الجاليكية' },
];

const PREFERRED_LANGUAGE_ORDER = ['ar', 'fr', 'en', 'zgh', 'es'];

function getDisplayNames(locale, type) {
    try {
        return new Intl.DisplayNames([locale], { type });
    } catch {
        return null;
    }
}

export function buildCountryOptions(locale = 'en') {
    const englishNames = getDisplayNames('en', 'region');
    const localizedNames = getDisplayNames(locale, 'region');

    return ALL_COUNTRY_CODES
        .map((code) => {
            const value = englishNames?.of(code) ?? code;
            const label = localizedNames?.of(code) ?? value;

            return { value, label };
        })
        .filter((item) => item.value && item.label)
        .sort((a, b) => a.label.localeCompare(b.label));
}

export function buildLanguageOptions(locale = 'en') {
    return LANGUAGE_DATASET
        .map((item) => {
            const localizedLabel = item[locale] ?? item.en;

            return {
                value: item.value,
                label: localizedLabel,
                searchText:
                    `${localizedLabel} ${item.en} ${item.fr} ${item.ar} ${item.value}`.toLowerCase(),
            };
        })
        .filter((item) => item.value && item.label)
        .sort((a, b) => {
            const aIndex = PREFERRED_LANGUAGE_ORDER.indexOf(a.value);
            const bIndex = PREFERRED_LANGUAGE_ORDER.indexOf(b.value);
            if (aIndex !== -1 || bIndex !== -1) {
                return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
            }
            return a.label.localeCompare(b.label);
        });
}
