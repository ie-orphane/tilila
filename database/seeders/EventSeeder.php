<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'id' => 'tilitalk-women-leading-tech-innovation',
                'type' => 'talk',
                'badge' => [
                    'en' => 'Next event',
                    'fr' => 'Prochain événement',
                    'ar' => 'الفعالية القادمة',
                ],
                'dateIso' => '2026-06-18',
                'dateTimeIso' => '2026-06-18T18:00:00+01:00',
                'startTime' => '18:00',
                'endTime' => '19:30',
                'tzLabel' => 'GMT+1',
                'title' => [
                    'en' => 'TiliTalk: Women Leading Tech Innovation',
                    'fr' => 'TiliTalk : Les femmes à la tête de l’innovation tech',
                    'ar' => 'TiliTalk: نساء يقدن الابتكار التقني',
                ],
                'excerpt' => [
                    'en' => 'A deep dive into the challenges and triumphs of female CTOs and tech founders in North Africa.',
                    'fr' => 'Une plongée au cœur des défis et des réussites des CTO et fondatrices tech en Afrique du Nord.',
                    'ar' => 'نظرة معمقة إلى تحديات ونجاحات مديرات التقنية والمؤسسات في شمال إفريقيا.',
                ],
                'location' => [
                    'en' => 'Hyatt Regency, Casablanca',
                    'fr' => 'Hyatt Regency, Casablanca',
                    'ar' => 'حياة ريجنسي، الدار البيضاء',
                ],
                'isOnline' => true,
                'categoryLabel' => ['en' => 'TiliTalks', 'fr' => 'TiliTalks', 'ar' => 'TiliTalks'],
                'imageSrc' => '/assets/talk.png',
                'cta' => [
                    'label' => ['en' => 'Register now', 'fr' => 'S’inscrire', 'ar' => 'سجّل الآن'],
                    'kind' => 'primary',
                    'href' => '#',
                ],
            ],
            [
                'id' => 'webinar-personal-branding-for-experts',
                'type' => 'webinar',
                'badge' => ['en' => 'Webinar', 'fr' => 'Webinaire', 'ar' => 'ندوة عبر الإنترنت'],
                'dateIso' => '2026-07-08',
                'dateTimeIso' => '2026-07-08T14:00:00+01:00',
                'startTime' => '14:00',
                'endTime' => '15:00',
                'tzLabel' => 'GMT+1',
                'title' => [
                    'en' => 'Personal Branding for Experts',
                    'fr' => 'Personal branding pour les expertes',
                    'ar' => 'بناء العلامة الشخصية للخبيرات',
                ],
                'excerpt' => [
                    'en' => 'Learn how to effectively communicate your expertise and build a strong personal brand in the digital presence.',
                    'fr' => 'Apprenez à communiquer efficacement votre expertise et à construire une marque personnelle forte en ligne.',
                    'ar' => 'تعلّم كيف توصل خبرتك بفعالية وتبني علامة شخصية قوية في الحضور الرقمي.',
                ],
                'location' => ['en' => 'Zoom', 'fr' => 'Zoom', 'ar' => 'زووم'],
                'isOnline' => true,
                'categoryLabel' => ['en' => 'Webinars', 'fr' => 'Webinaires', 'ar' => 'ندوات عبر الإنترنت'],
                'imageSrc' => null,
                'cta' => [
                    'label' => ['en' => 'Register', 'fr' => 'S’inscrire', 'ar' => 'سجّل'],
                    'kind' => 'secondary',
                    'href' => '#',
                ],
            ],
            [
                'id' => 'workshop-speaking-with-impact',
                'type' => 'workshop',
                'badge' => ['en' => 'Workshop', 'fr' => 'Atelier', 'ar' => 'ورشة'],
                'dateIso' => '2026-09-12',
                'dateTimeIso' => '2026-09-12T08:00:00+01:00',
                'startTime' => '08:00',
                'endTime' => '13:00',
                'tzLabel' => 'GMT+1',
                'title' => [
                    'en' => 'Media Training: Speaking with Impact',
                    'fr' => 'Media training : s’exprimer avec impact',
                    'ar' => 'تدريب إعلامي: التحدث بأثر',
                ],
                'excerpt' => [
                    'en' => 'Practical session on handling interviews, crafting soundbites, and navigating panel discussions.',
                    'fr' => 'Session pratique sur la conduite d’interviews, la formulation de messages et la participation aux panels.',
                    'ar' => 'جلسة عملية حول إجراء المقابلات وصياغة الرسائل والتعامل مع النقاشات في اللوحات الحوارية.',
                ],
                'location' => [
                    'en' => '2M Studio, Casablanca',
                    'fr' => 'Studio 2M, Casablanca',
                    'ar' => 'استوديو 2M، الدار البيضاء',
                ],
                'isOnline' => false,
                'categoryLabel' => ['en' => 'Workshops', 'fr' => 'Ateliers', 'ar' => 'ورشات'],
                'imageSrc' => null,
                'cta' => [
                    'label' => ['en' => 'Waitlist', 'fr' => 'Liste d’attente', 'ar' => 'قائمة الانتظار'],
                    'kind' => 'muted',
                    'href' => '#',
                ],
            ],
            [
                'id' => 'replay-financial-inclusion-for-women-entrepreneurs',
                'type' => 'webinar',
                'badge' => [
                    'en' => 'Replay available',
                    'fr' => 'Replay disponible',
                    'ar' => 'الإعادة متاحة',
                ],
                'dateIso' => '2025-09-28',
                'dateTimeIso' => '2025-09-28T16:00:00+01:00',
                'startTime' => '16:00',
                'endTime' => '17:00',
                'tzLabel' => 'GMT+1',
                'title' => [
                    'en' => 'Financial Inclusion for Women Entrepreneurs',
                    'fr' => 'Inclusion financière des femmes entrepreneures',
                    'ar' => 'الشمول المالي لرائدات الأعمال',
                ],
                'excerpt' => [
                    'en' => 'Exploring funding opportunities and financial literacy strategies for entrepreneurs.',
                    'fr' => 'Exploration des opportunités de financement et des stratégies d’éducation financière pour les entrepreneures.',
                    'ar' => 'استكشاف فرص التمويل واستراتيجيات الثقافة المالية لرائدات الأعمال.',
                ],
                'location' => ['en' => 'Webinar', 'fr' => 'Webinaire', 'ar' => 'ندوة عبر الإنترنت'],
                'isOnline' => true,
                'categoryLabel' => ['en' => 'Past Events / Replays', 'fr' => 'Événements passés / Replays', 'ar' => 'الفعاليات الماضية / الإعادات'],
                'imageSrc' => null,
                'cta' => [
                    'label' => ['en' => 'Watch replay', 'fr' => 'Voir le replay', 'ar' => 'شاهد الإعادة'],
                    'kind' => 'ghost',
                    'href' => '#',
                ],
            ],
        ];

        $details = [
            'tilitalk-women-leading-tech-innovation' => [
                'hero' => [
                    'badge' => 'Next event',
                    'dateLabel' => 'October 24, 2024',
                    'locationLabel' => 'Casablanca, Morocco',
                    'title' => 'TiliTalk: Women Leading Innovation in African Tech',
                    'subtitle' => 'A deep dive into how women leaders are reshaping the technology landscape across the continent, overcoming barriers, and driving digital transformation.',
                    'primaryCta' => ['label' => 'Watch Replay', 'href' => '#replay'],
                    'secondaryCta' => ['label' => 'Share Event', 'href' => '#share'],
                ],
                'replay' => [
                    'title' => 'Event Replay',
                    'videoTitle' => 'Replay',
                    'durationLabel' => 'Duration • 45 min',
                ],
                'about' => [
                    'title' => 'About the Event',
                    'paragraphs' => [
                        'The technology sector in Africa is evolving, yet women remain underrepresented in leadership roles. This session brings together pioneering women who are transforming their organizations and communities through technology and innovation.',
                        'From fintech to AI, panelists share how they navigated barriers, built teams, and created impact. The conversation highlights practical strategies for inclusive leadership and sustainable growth.',
                        'The role of mentorship and networking in career advancement.',
                        'Policy changes needed to support gender diversity in STEM.',
                    ],
                ],
                'speakers' => [
                    'title' => 'Speakers',
                    'items' => [
                        ['name' => 'Aziz El Mansouri', 'role' => 'CEO, TechVision'],
                        ['name' => 'Sarah Benali', 'role' => 'CTO, FinNext'],
                        ['name' => 'Khadija Ouadd', 'role' => 'Product Lead, Atlas AI'],
                    ],
                ],
                'agenda' => [
                    'title' => 'Agenda',
                    'items' => [
                        ['time' => '18:00', 'label' => 'Opening Remarks'],
                        ['time' => '18:10', 'label' => 'Panel Discussion'],
                        ['time' => '19:00', 'label' => 'Networking Session'],
                        ['time' => '19:25', 'label' => 'Closing Remarks'],
                    ],
                ],
                'partners' => [
                    'title' => 'Partners',
                    'items' => ['2M', 'TechWomen', 'BAM', 'CEED'],
                ],
                'gallery' => [
                    'title' => 'Photo Gallery',
                    'items' => [
                        ['label' => 'Photo 1'],
                        ['label' => 'Photo 2'],
                        ['label' => 'Photo 3'],
                        ['label' => 'Photo 4'],
                        ['label' => 'Photo 5'],
                        ['label' => '+12 More', 'isMore' => true],
                    ],
                ],
                'registration' => [
                    'badge' => 'Upcoming',
                    'title' => "Don't Miss the Next TiliTalk",
                    'description' => "Join the next edition to learn, network and get inspired. Capacity is limited — register today to secure your seat.",
                    'submitLabel' => 'Complete Registration',
                ],
            ],
        ];

        foreach ($events as $payload) {
            $slug = $payload['id'];
            $dt = $payload['dateTimeIso'] ?? null;

            $date = null;
            $time = null;
            if (is_string($dt) && $dt !== '') {
                try {
                    $c = Carbon::parse($dt);
                    $date = $c->format('Y-m-d');
                    $time = $c->format('H:i:s');
                } catch (\Throwable) {
                    $date = $payload['dateIso'] ?? null;
                    $time = null;
                }
            } else {
                $date = $payload['dateIso'] ?? null;
            }

            $eventDate = $date ? Carbon::parse($date)->endOfDay() : null;
            $isPast = $eventDate?->isPast() ?? false;

            Event::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'type' => $payload['type'] ?? 'other',
                    'status' => $isPast ? 'finished' : 'upcoming',
                    'visibility' => 'public',
                    'title' => $payload['title'] ?? ['en' => '', 'fr' => '', 'ar' => ''],
                    'location' => $payload['location'] ?? ['en' => '', 'fr' => '', 'ar' => ''],
                    'description' => $payload['excerpt'] ?? ['en' => '', 'fr' => '', 'ar' => ''],
                    'date' => $date,
                    'time' => $time,
                    'timezone' => $payload['tzLabel'] ?? 'GMT+1',
                    'list_payload' => $payload,
                    'details_payload' => $details[$slug] ?? null,
                ],
            );
        }
    }
}
