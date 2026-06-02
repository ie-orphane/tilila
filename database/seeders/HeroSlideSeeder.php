<?php

namespace Database\Seeders;

use App\Models\HeroSlide;
use Illuminate\Database\Seeder;

/**
 * Seeds hero_slides from the 9 static slides previously defined in
 * resources/js/data/hero-carousel-data.js. Uses firstOrCreate keyed on
 * slide_key so it is safe to re-run without creating duplicates.
 *
 * slide_key values are the routing anchor — they must never change.
 */
class HeroSlideSeeder extends Seeder
{
    public function run(): void
    {
        $slides = $this->slides();

        foreach ($slides as $index => $data) {
            HeroSlide::query()->firstOrCreate(
                ['slide_key' => $data['slide_key']],
                array_merge($data, ['sort_order' => $index]),
            );
        }
    }

    /** @return list<array<string, mixed>> */
    private function slides(): array
    {
        return [
            // 0 — home
            [
                'slide_key'   => 'home',
                'path_prefix' => '/',
                'is_active' => true,
                'display_mode' => 'normal',
                'image_contain' => false,
                'banner_image_contain' => false,
                'image_position' => null,
                'image_bg' => null,
                'image_path' => '/assets/hero.png',
                'image_alt' => [
                    'en' => 'Women experts in discussion',
                    'fr' => 'Expertes en discussion',
                    'ar' => "\u{062E}\u{0628}\u{064A}\u{0631}\u{0627}\u{062A} \u{0641}\u{064A} \u{0646}\u{0642}\u{0627}\u{0634}",
                ],
                'badge' => [
                    'en' => 'An initiative by Tilila',
                    'fr' => 'Une initiative de Tilila',
                    'ar' => "\u{0645}\u{0628}\u{0627}\u{062F}\u{0631}\u{0629} \u{0645}\u{0646} \u{062A}\u{064A}\u{0644}\u{064A}\u{0644}\u{0627}",
                ],
                'kicker' => [
                    'en' => 'Voices of change',
                    'fr' => 'Voix du changement',
                    'ar' => "\u{0623}\u{0635}\u{0648}\u{0627}\u{062A} \u{0627}\u{0644}\u{062A}\u{063A}\u{064A}\u{064A}\u{0631}",
                ],
                'title_before' => [
                    'en' => 'Empowering Women Experts,',
                    'fr' => 'Valoriser les expertes,',
                    'ar' => "\u{062A}\u{0645}\u{0643}\u{064A}\u{0646} \u{0627}\u{0644}\u{062E}\u{0628}\u{064A}\u{0631}\u{0627}\u{062A}\u{060C}",
                ],
                'title_accent' => [
                    'en' => 'Shaping the Future',
                    'fr' => "fa\u{00E7}onner l\u{2019}avenir",
                    'ar' => "\u{0648}\u{0635}\u{0646}\u{0627}\u{0639}\u{0629} \u{0627}\u{0644}\u{0645}\u{0633}\u{062A}\u{0642}\u{0628}\u{0644}",
                ],
                'description' => [
                    'en' => 'Connecting Moroccan and African women experts with media and institutions to drive parity, inclusion, and diversity in public discourse.',
                    'fr' => "Relier les expertes marocaines et africaines aux m\u{00E9}dias et aux institutions pour promouvoir la parit\u{00E9}, l\u{2019}inclusion et la diversit\u{00E9} dans le d\u{00E9}bat public.",
                    'ar' => "\u{0631}\u{0628}\u{0637} \u{0627}\u{0644}\u{062E}\u{0628}\u{064A}\u{0631}\u{0627}\u{062A} \u{0627}\u{0644}\u{0645}\u{063A}\u{0631}\u{0628}\u{064A}\u{0627}\u{062A} \u{0648}\u{0627}\u{0644}\u{0625}\u{0641}\u{0631}\u{064A}\u{0642}\u{064A}\u{0627}\u{062A} \u{0628}\u{0648}\u{0633}\u{0627}\u{0626}\u{0644} \u{0627}\u{0644}\u{0625}\u{0639}\u{0644}\u{0627}\u{0645} \u{0648}\u{0627}\u{0644}\u{0645}\u{0624}\u{0633}\u{0633}\u{0627}\u{062A} \u{0644}\u{062A}\u{0639}\u{0632}\u{064A}\u{0632} \u{0627}\u{0644}\u{0645}\u{0633}\u{0627}\u{0648}\u{0627}\u{0629} \u{0648}\u{0627}\u{0644}\u{0625}\u{062F}\u{0645}\u{0627}\u{062C} \u{0648}\u{0627}\u{0644}\u{062A}\u{0646}\u{0648}\u{0639} \u{0641}\u{064A} \u{0627}\u{0644}\u{062E}\u{0637}\u{0627}\u{0628} \u{0627}\u{0644}\u{0639}\u{0627}\u{0645}.",
                ],
                'card_line' => [
                    'en' => 'Bridging expertise and visibility.',
                    'fr' => 'Lier expertise et visibilit\u{00E9}.',
                    'ar' => "\u{0631}\u{0628}\u{0637} \u{0627}\u{0644}\u{062E}\u{0628}\u{0631}\u{0629} \u{0628}\u{0627}\u{0644}\u{0638}\u{0647}\u{0648}\u{0631}.",
                ],
                'ctas' => [
                    ['label' => ['en' => 'Find an Expert', 'fr' => 'Trouver une experte', 'ar' => "\u{0627}\u{0639}\u{062B}\u{0631} \u{0639}\u{0644}\u{0649} \u{062E}\u{0628}\u{064A}\u{0631}\u{0629}"], 'url' => '/experts', 'style' => 'primary', 'is_active' => true],
                    ['label' => ['en' => 'Join Tilila Connect', 'fr' => 'Rejoindre Tilila Connect', 'ar' => "\u{0627}\u{0646}\u{0636}\u{0645} \u{0625}\u{0644}\u{0649} Tilila Connect"], 'url' => '/about', 'style' => 'secondary', 'is_active' => true],
                ],
            ],
            // 1 — about
            [
                'slide_key'   => 'about',
                'path_prefix' => '/about',
                'is_active' => true,
                'display_mode' => 'normal',
                'image_contain' => false,
                'banner_image_contain' => false,
                'image_position' => null,
                'image_bg' => null,
                'image_path' => '/assets/hero.png',
                'image_alt' => [
                    'en' => 'Team collaboration',
                    'fr' => "Collaboration d\u{2019}\u{00E9}quipe",
                    'ar' => "\u{062A}\u{0639}\u{0627}\u{0648}\u{0646} \u{0627}\u{0644}\u{0641}\u{0631}\u{064A}\u{0642}",
                ],
                'badge' => [
                    'en' => 'About Tilila',
                    'fr' => "\u{00C0} propos de Tilila",
                    'ar' => "\u{062D}\u{0648}\u{0644} \u{062A}\u{064A}\u{0644}\u{064A}\u{0644}\u{0627}",
                ],
                'kicker' => [
                    'en' => 'Who we are',
                    'fr' => 'Qui sommes-nous',
                    'ar' => "\u{0645}\u{0646} \u{0646}\u{062D}\u{0646}",
                ],
                'title_before' => [
                    'en' => 'Transparency, parity, and',
                    'fr' => "Transparence, parit\u{00E9} et",
                    'ar' => "\u{0627}\u{0644}\u{0634}\u{0641}\u{0627}\u{0641}\u{064A}\u{0629} \u{0648}\u{0627}\u{0644}\u{062A}\u{0643}\u{0627}\u{0641}\u{0624} \u{0648}",
                ],
                'title_accent' => [
                    'en' => 'collective impact',
                    'fr' => 'impact collectif',
                    'ar' => "\u{0627}\u{0644}\u{0623}\u{062B}\u{0631} \u{0627}\u{0644}\u{062C}\u{0645}\u{0627}\u{0639}\u{064A}",
                ],
                'description' => [
                    'en' => 'Discover our mission, values, and how we mobilize partners across media and civil society.',
                    'fr' => "D\u{00E9}couvrez notre mission, nos valeurs et comment nous mobilisons des partenaires dans les m\u{00E9}dias et la soci\u{00E9}t\u{00E9} civile.",
                    'ar' => "\u{0627}\u{0643}\u{062A}\u{0634}\u{0641} \u{0645}\u{0647}\u{0645}\u{062A}\u{0646}\u{0627} \u{0648}\u{0642}\u{064A}\u{0645}\u{0646}\u{0627} \u{0648}\u{0643}\u{064A}\u{0641} \u{0646}\u{062D}\u{0634}\u{062F} \u{0627}\u{0644}\u{0634}\u{0631}\u{0643}\u{0627}\u{0621} \u{0641}\u{064A} \u{0627}\u{0644}\u{0625}\u{0639}\u{0644}\u{0627}\u{0645} \u{0648}\u{0627}\u{0644}\u{0645}\u{062C}\u{062A}\u{0645}\u{0639} \u{0627}\u{0644}\u{0645}\u{062F}\u{0646}\u{064A}.",
                ],
                'card_line' => [
                    'en' => 'A more representative public conversation.',
                    'fr' => "Un d\u{00E9}bat public plus repr\u{00E9}sentatif.",
                    'ar' => "\u{062D}\u{0648}\u{0627}\u{0631} \u{0639}\u{0627}\u{0645} \u{0623}\u{0643}\u{062B}\u{0631} \u{062A}\u{0645}\u{062B}\u{064A}\u{0644}\u{0627}\u{064B}.",
                ],
                'ctas' => [
                    ['label' => ['en' => 'Learn more', 'fr' => 'En savoir plus', 'ar' => "\u{0627}\u{0639}\u{0631}\u{0641} \u{0627}\u{0644}\u{0645}\u{0632}\u{064A}\u{062F}"], 'url' => '/about', 'style' => 'primary', 'is_active' => true],
                ],
            ],
            // 2 — tililab
            [
                'slide_key'   => 'tililab',
                'path_prefix' => '/tililab',
                'is_active' => true,
                'display_mode' => 'banner_image',
                'image_contain' => false,
                'banner_image_contain' => false,
                'image_position' => null,
                'image_bg' => null,
                'image_path' => '/assets/tililab/tililab-banner.png',
                'image_alt' => [
                    'en' => 'Concours Tililab — creative bootcamp by 2M',
                    'fr' => 'Concours Tililab — bootcamp créatif par 2M',
                    'ar' => "\u{0645}\u{0633}\u{0627}\u{0628}\u{0642}\u{0629} \u{062A}\u{064A}\u{0644}\u{064A}\u{0644}\u{0627}\u{0628} \u{2014} \u{0645}\u{0639}\u{0633}\u{0643}\u{0631} \u{0625}\u{0628}\u{062F}\u{0627}\u{0639}\u{064A} \u{0645}\u{0646} 2M",
                ],
                'badge' => null,
                'kicker' => null,
                'title_before' => null,
                'title_accent' => null,
                'description' => null,
                'card_line' => null,
                'ctas' => [
                    ['label' => ['en' => 'Past editions', 'fr' => "\u{00C9}ditions pass\u{00E9}es", 'ar' => "\u{0627}\u{0644}\u{062F}\u{0648}\u{0631}\u{0627}\u{062A} \u{0627}\u{0644}\u{0633}\u{0627}\u{0628}\u{0642}\u{0629}"], 'url' => '/tililab#past-editions', 'style' => 'primary', 'is_active' => true],
                    ['label' => ['en' => 'Apply now', 'fr' => 'Postuler', 'ar' => "\u{0642}\u{062F}\u{0651}\u{0645} \u{0627}\u{0644}\u{0622}\u{0646}"], 'url' => '/tililab#how-to-apply', 'style' => 'secondary', 'is_active' => true],
                ],
            ],
            // 3 — tilila
            [
                'slide_key'   => 'tilila',
                'path_prefix' => '/tilila',
                'is_active' => true,
                'display_mode' => 'banner_image',
                'image_contain' => false,
                'banner_image_contain' => true,
                'image_position' => 'center',
                'image_bg' => null,
                'image_path' => '/assets/tilila/tilila-awards-logo.png',
                'image_alt' => [
                    'en' => 'Les Débats Tilila — Trophée Tilila',
                    'fr' => 'Les Débats Tilila — Trophée Tilila',
                    'ar' => "\u{0627}\u{0644}\u{0645}\u{0646}\u{0627}\u{0638}\u{0631}\u{0627}\u{062A} \u{062A}\u{064A}\u{0644}\u{064A}\u{0644}\u{0627} \u{2014} \u{062A}\u{0631}\u{0648}\u{0641}\u{064A} \u{062A}\u{064A}\u{0644}\u{064A}\u{0644}\u{0627}",
                ],
                'badge' => null,
                'kicker' => null,
                'title_before' => null,
                'title_accent' => null,
                'description' => null,
                'card_line' => null,
                'ctas' => [
                    ['label' => ['en' => 'Past editions', 'fr' => "\u{00C9}ditions pass\u{00E9}es", 'ar' => "\u{0627}\u{0644}\u{062F}\u{0648}\u{0631}\u{0627}\u{062A} \u{0627}\u{0644}\u{0633}\u{0627}\u{0628}\u{0642}\u{0629}"], 'url' => '/tilila#past-editions', 'style' => 'primary', 'is_active' => true],
                    ['label' => ['en' => 'Participate', 'fr' => 'Participer', 'ar' => "\u{0634}\u{0627}\u{0631}\u{0643}"], 'url' => '/tilila#how-to-apply', 'style' => 'secondary', 'is_active' => true],
                ],
            ],
            // 4 — gouvernance
            [
                'slide_key'   => 'gouvernance',
                'path_prefix' => '/gouvernance',
                'is_active' => true,
                'display_mode' => 'normal',
                'image_contain' => true,
                'banner_image_contain' => false,
                'image_position' => null,
                'image_bg' => null,
                'image_path' => '/assets/organizer-logo.png',
                'image_alt' => [
                    'en' => 'Governance and partnership visual',
                    'fr' => 'Visuel gouvernance et partenariat',
                    'ar' => "\u{0635}\u{0648}\u{0631}\u{0629} \u{0627}\u{0644}\u{062D}\u{0648}\u{0643}\u{0645}\u{0629} \u{0648}\u{0627}\u{0644}\u{0634}\u{0631}\u{0627}\u{0643}\u{0629}",
                ],
                'badge' => [
                    'en' => 'Governance',
                    'fr' => 'Gouvernance',
                    'ar' => "\u{0627}\u{0644}\u{062D}\u{0648}\u{0643}\u{0645}\u{0629}",
                ],
                'kicker' => [
                    'en' => 'CPD & charter',
                    'fr' => 'CPD et charte',
                    'ar' => "\u{0627}\u{0644}\u{0645}\u{064A}\u{062B}\u{0627}\u{0642} \u{0648}\u{0627}\u{0644}\u{0633}\u{064A}\u{0627}\u{0633}\u{0627}\u{062A}",
                ],
                'title_before' => [
                    'en' => 'Accountability and',
                    'fr' => 'La responsabilité et',
                    'ar' => "\u{0627}\u{0644}\u{0645}\u{0633}\u{0627}\u{0621}\u{0644}\u{0629} \u{0648}",
                ],
                'title_accent' => [
                    'en' => 'inclusive standards',
                    'fr' => 'des standards inclusifs',
                    'ar' => "\u{0645}\u{0639}\u{0627}\u{064A}\u{064A}\u{0631} \u{0634}\u{0627}\u{0645}\u{0644}\u{0629}",
                ],
                'description' => [
                    'en' => 'Our charter and policies ensure transparent, ethical collaboration across the media ecosystem.',
                    'fr' => "Notre charte et nos politiques garantissent une collaboration transparente et \u{00E9}thique dans l\u{2019}\u{00E9}cosyst\u{00E8}me m\u{00E9}diatique.",
                    'ar' => "\u{064A}\u{0636}\u{0645}\u{0646} \u{0645}\u{064A}\u{062B}\u{0627}\u{0642}\u{0646}\u{0627} \u{0648}\u{0633}\u{064A}\u{0627}\u{0633}\u{0627}\u{062A}\u{0646}\u{0627} \u{062A}\u{0639}\u{0627}\u{0648}\u{0646}\u{0627}\u{064B} \u{0634}\u{0641}\u{0627}\u{0641}\u{0627}\u{064B} \u{0648}\u{0623}\u{062E}\u{0644}\u{0627}\u{0642}\u{064A}\u{0627}\u{064B} \u{0641}\u{064A} \u{0627}\u{0644}\u{0645}\u{0646}\u{0638}\u{0648}\u{0645}\u{0629} \u{0627}\u{0644}\u{0625}\u{0639}\u{0644}\u{0627}\u{0645}\u{064A}\u{0629}.",
                ],
                'card_line' => [
                    'en' => 'Commitments you can trust.',
                    'fr' => 'Des engagements fiables.',
                    'ar' => "\u{0627}\u{0644}\u{062A}\u{0632}\u{0627}\u{0645}\u{0627}\u{062A} \u{0645}\u{0648}\u{062B}\u{0648}\u{0642}\u{0629}.",
                ],
                'ctas' => [
                    ['label' => ['en' => 'View governance', 'fr' => 'Voir la gouvernance', 'ar' => "\u{0639}\u{0631}\u{0636} \u{0627}\u{0644}\u{062D}\u{0648}\u{0643}\u{0645}\u{0629}"], 'url' => '/gouvernance', 'style' => 'primary', 'is_active' => true],
                ],
            ],
            // 5 — experts
            [
                'slide_key'   => 'experts',
                'path_prefix' => '/experts',
                'is_active' => true,
                'display_mode' => 'normal',
                'image_contain' => false,
                'banner_image_contain' => false,
                'image_position' => null,
                'image_bg' => null,
                'image_path' => '/assets/hero.png',
                'image_alt' => [
                    'en' => 'Expert profiles and media',
                    'fr' => "Profils d\u{2019}expertes et m\u{00E9}dias",
                    'ar' => "\u{0645}\u{0644}\u{0641}\u{0627}\u{062A} \u{0627}\u{0644}\u{062E}\u{0628}\u{064A}\u{0631}\u{0627}\u{062A} \u{0648}\u{0648}\u{0633}\u{0627}\u{0626}\u{0644} \u{0627}\u{0644}\u{0625}\u{0639}\u{0644}\u{0627}\u{0645}",
                ],
                'badge' => [
                    'en' => 'Experts',
                    'fr' => 'Expertes et experts',
                    'ar' => "\u{0627}\u{0644}\u{062E}\u{0628}\u{0631}\u{0627}\u{0621}",
                ],
                'kicker' => [
                    'en' => 'Expert network',
                    'fr' => "R\u{00E9}seau d\u{2019}expertes",
                    'ar' => "\u{0634}\u{0628}\u{0643}\u{0629} \u{0627}\u{0644}\u{062E}\u{0628}\u{064A}\u{0631}\u{0627}\u{062A}",
                ],
                'title_before' => [
                    'en' => 'Find the right voice for',
                    'fr' => 'Trouvez la bonne voix pour',
                    'ar' => "\u{0627}\u{0639}\u{062B}\u{0631} \u{0639}\u{0644}\u{0649} \u{0627}\u{0644}\u{0635}\u{0648}\u{062A} \u{0627}\u{0644}\u{0645}\u{0646}\u{0627}\u{0633}\u{0628} \u{0644}\u{0640}",
                ],
                'title_accent' => [
                    'en' => 'your next story',
                    'fr' => 'votre prochain sujet',
                    'ar' => "\u{0642}\u{0635}\u{062A}\u{0643} \u{0627}\u{0644}\u{0642}\u{0627}\u{062F}\u{0645}\u{0629}",
                ],
                'description' => [
                    'en' => 'Search profiles across economics, technology, health, law, and more — available for media and institutions.',
                    'fr' => "Recherchez des profils en \u{00E9}conomie, tech, sant\u{00E9}, droit et plus encore \u{2014} disponibles pour m\u{00E9}dias et institutions.",
                    'ar' => "\u{0627}\u{0628}\u{062D}\u{062B} \u{0639}\u{0646} \u{0645}\u{0644}\u{0641}\u{0627}\u{062A} \u{0641}\u{064A} \u{0627}\u{0644}\u{0627}\u{0642}\u{062A}\u{0635}\u{0627}\u{062F} \u{0648}\u{0627}\u{0644}\u{062A}\u{0642}\u{0646}\u{064A}\u{0629} \u{0648}\u{0627}\u{0644}\u{0635}\u{062D}\u{0629} \u{0648}\u{0627}\u{0644}\u{0642}\u{0627}\u{0646}\u{0648}\u{0646} \u{0648}\u{063A}\u{064A}\u{0631}\u{0647}\u{0627} \u{2014} \u{062C}\u{0627}\u{0647}\u{0632}\u{0629} \u{0644}\u{0644}\u{0625}\u{0639}\u{0644}\u{0627}\u{0645} \u{0648}\u{0627}\u{0644}\u{0645}\u{0624}\u{0633}\u{0633}\u{0627}\u{062A}.",
                ],
                'card_line' => [
                    'en' => 'Verified expertise, one click away.',
                    'fr' => "Expertise v\u{00E9}rifi\u{00E9}e, en un clic.",
                    'ar' => "\u{062E}\u{0628}\u{0631}\u{0629} \u{0645}\u{0648}\u{062B}\u{0651}\u{0642}\u{0629} \u{0628}\u{0633}\u{0647}\u{0648}\u{0644}\u{0629}.",
                ],
                'ctas' => [
                    ['label' => ['en' => 'Become an Expert', 'fr' => 'Devenir experte', 'ar' => "\u{0623}\u{0635}\u{0628}\u{062D}\u{064A} \u{062E}\u{0628}\u{064A}\u{0631}\u{0629}"], 'url' => '/experts/become', 'style' => 'primary', 'is_active' => true],
                    ['label' => ['en' => 'Browse experts', 'fr' => 'Parcourir les profils', 'ar' => "\u{062A}\u{0635}\u{0641}\u{062D} \u{0627}\u{0644}\u{062E}\u{0628}\u{0631}\u{0627}\u{0621}"], 'url' => '/experts#experts-directory', 'style' => 'secondary', 'is_active' => true],
                ],
            ],
            // 6 — events
            [
                'slide_key'   => 'events',
                'path_prefix' => '/events',
                'is_active' => true,
                'display_mode' => 'normal',
                'image_contain' => true,
                'banner_image_contain' => false,
                'image_position' => null,
                'image_bg' => 'white',
                'image_path' => '/assets/tilitalks/tilitalks-logo.png',
                'image_alt' => ['en' => 'TiliTalks', 'fr' => 'TiliTalks', 'ar' => 'TiliTalks'],
                'badge' => [
                    'en' => 'Events',
                    'fr' => "\u{00C9}v\u{00E9}nements",
                    'ar' => "\u{0627}\u{0644}\u{0641}\u{0639}\u{0627}\u{0644}\u{064A}\u{0627}\u{062A}",
                ],
                'kicker' => [
                    'en' => 'On the agenda',
                    'fr' => "\u{00C0} l\u{2019}agenda",
                    'ar' => "\u{0641}\u{064A} \u{0627}\u{0644}\u{0623}\u{062C}\u{0646}\u{062F}\u{0629}",
                ],
                'title_before' => [
                    'en' => 'Workshops, webinars, and',
                    'fr' => 'Ateliers, webinaires et',
                    'ar' => "\u{0648}\u{0631}\u{0634} \u{0648}\u{0646}\u{062F}\u{0648}\u{0627}\u{062A} \u{0648}",
                ],
                'title_accent' => ['en' => 'TiliTalks', 'fr' => 'TiliTalks', 'ar' => 'TiliTalks'],
                'description' => [
                    'en' => 'Stay connected with agendas, replays, and live discussions shaping media and parity.',
                    'fr' => "Restez inform\u{00E9} des agendas, rediffusions et \u{00E9}changes en direct sur les m\u{00E9}dias et la parit\u{00E9}.",
                    'ar' => "\u{0627}\u{0628}\u{0642}\u{064E} \u{0639}\u{0644}\u{0649} \u{0627}\u{0637}\u{0644}\u{0627}\u{0639} \u{0628}\u{062C}\u{062F}\u{0627}\u{0648}\u{0644} \u{0627}\u{0644}\u{0623}\u{0639}\u{0645}\u{0627}\u{0644} \u{0648}\u{0625}\u{0639}\u{0627}\u{062F}\u{0627}\u{062A} \u{0627}\u{0644}\u{0628}\u{062B} \u{0648}\u{0627}\u{0644}\u{0646}\u{0642}\u{0627}\u{0634}\u{0627}\u{062A} \u{0627}\u{0644}\u{062D}\u{064A}\u{0629} \u{062D}\u{0648}\u{0644} \u{0627}\u{0644}\u{0625}\u{0639}\u{0644}\u{0627}\u{0645} \u{0648}\u{0627}\u{0644}\u{062A}\u{0643}\u{0627}\u{0641}\u{0624}.",
                ],
                'card_line' => [
                    'en' => 'Join the conversation.',
                    'fr' => "Participez aux \u{00E9}changes.",
                    'ar' => "\u{0627}\u{0646}\u{0636}\u{0645} \u{0625}\u{0644}\u{0649} \u{0627}\u{0644}\u{0646}\u{0642}\u{0627}\u{0634}.",
                ],
                'ctas' => [
                    ['label' => ['en' => 'See events', 'fr' => "Voir les \u{00E9}v\u{00E9}nements", 'ar' => "\u{0634}\u{0627}\u{0647}\u{062F} \u{0627}\u{0644}\u{0641}\u{0639}\u{0627}\u{0644}\u{064A}\u{0627}\u{062A}"], 'url' => '/events', 'style' => 'primary', 'is_active' => true],
                ],
            ],
            // 7 — opportunities
            [
                'slide_key'   => 'opportunities',
                'path_prefix' => '/opportunities',
                'is_active' => true,
                'display_mode' => 'normal',
                'image_contain' => false,
                'banner_image_contain' => false,
                'image_position' => null,
                'image_bg' => null,
                'image_path' => '/assets/trophee.png',
                'image_alt' => [
                    'en' => 'Opportunities and recognition',
                    'fr' => "Opportunit\u{00E9}s et reconnaissance",
                    'ar' => "\u{0641}\u{0631}\u{0635} \u{0648}\u{062A}\u{0643}\u{0631}\u{064A}\u{0645}",
                ],
                'badge' => [
                    'en' => 'Opportunities',
                    'fr' => "Opportunit\u{00E9}s",
                    'ar' => "\u{0627}\u{0644}\u{0641}\u{0631}\u{0635}",
                ],
                'kicker' => [
                    'en' => 'Open calls',
                    'fr' => 'Appels en cours',
                    'ar' => "\u{062F}\u{0639}\u{0648}\u{0627}\u{062A} \u{0645}\u{0641}\u{062A}\u{0648}\u{062D}\u{0629}",
                ],
                'title_before' => [
                    'en' => 'Grants, residencies, and',
                    'fr' => "Subventions, r\u{00E9}sidences et",
                    'ar' => "\u{0645}\u{0646}\u{062D} \u{0648}\u{0625}\u{0642}\u{0627}\u{0645}\u{0627}\u{062A} \u{0648}",
                ],
                'title_accent' => [
                    'en' => 'calls for projects',
                    'fr' => 'appels à projets',
                    'ar' => "\u{062F}\u{0639}\u{0648}\u{0627}\u{062A} \u{0644}\u{0644}\u{0645}\u{0634}\u{0627}\u{0631}\u{064A}\u{0639}",
                ],
                'description' => [
                    'en' => 'Discover open calls for journalists, creators, and organizations driving inclusion in media.',
                    'fr' => "D\u{00E9}couvrez les appels ouverts aux journalistes, cr\u{00E9}ateurs et organisations qui font progresser l\u{2019}inclusion m\u{00E9}diatique.",
                    'ar' => "\u{0627}\u{0643}\u{062A}\u{0634}\u{0641} \u{0627}\u{0644}\u{062F}\u{0639}\u{0648}\u{0627}\u{062A} \u{0627}\u{0644}\u{0645}\u{0641}\u{062A}\u{0648}\u{062D}\u{0629} \u{0644}\u{0644}\u{0635}\u{062D}\u{0641}\u{064A}\u{064A}\u{0646} \u{0648}\u{0627}\u{0644}\u{0645}\u{0628}\u{062F}\u{0639}\u{064A}\u{0646} \u{0648}\u{0627}\u{0644}\u{0645}\u{0646}\u{0638}\u{0645}\u{0627}\u{062A} \u{0627}\u{0644}\u{062A}\u{064A} \u{062A}\u{0639}\u{0632}\u{0632} \u{0627}\u{0644}\u{0625}\u{062F}\u{0645}\u{0627}\u{062C} \u{0641}\u{064A} \u{0627}\u{0644}\u{0625}\u{0639}\u{0644}\u{0627}\u{0645}.",
                ],
                'card_line' => [
                    'en' => 'Apply before deadlines.',
                    'fr' => "Postulez avant les dates limites.",
                    'ar' => "\u{0642}\u{062F}\u{0651}\u{0645} \u{0642}\u{0628}\u{0644} \u{0627}\u{0646}\u{062A}\u{0647}\u{0627}\u{0621} \u{0627}\u{0644}\u{0622}\u{062C}\u{0627}\u{0644}.",
                ],
                'ctas' => [
                    ['label' => ['en' => 'View opportunities', 'fr' => "Voir les opportunit\u{00E9}s", 'ar' => "\u{0639}\u{0631}\u{0636} \u{0627}\u{0644}\u{0641}\u{0631}\u{0635}"], 'url' => '/opportunities', 'style' => 'primary', 'is_active' => true],
                ],
            ],
            // 8 — media
            [
                'slide_key'   => 'media',
                'path_prefix' => '/media',
                'is_active' => true,
                'display_mode' => 'normal',
                'image_contain' => false,
                'banner_image_contain' => false,
                'image_position' => null,
                'image_bg' => null,
                'image_path' => '/assets/talk.png',
                'image_alt' => [
                    'en' => 'Media production',
                    'fr' => "Production m\u{00E9}dia",
                    'ar' => "\u{0627}\u{0644}\u{0625}\u{0646}\u{062A}\u{0627}\u{062C} \u{0627}\u{0644}\u{0625}\u{0639}\u{0644}\u{0627}\u{0645}\u{064A}",
                ],
                'badge' => [
                    'en' => 'Media',
                    'fr' => "M\u{00E9}dia",
                    'ar' => "\u{0627}\u{0644}\u{0648}\u{0633}\u{0627}\u{0626}\u{0637}",
                ],
                'kicker' => [
                    'en' => 'From the newsroom',
                    'fr' => 'De la rédaction',
                    'ar' => "\u{0645}\u{0646} \u{0627}\u{0644}\u{062A}\u{062D}\u{0631}\u{064A}\u{0631}",
                ],
                'title_before' => [
                    'en' => 'Stories, resources, and',
                    'fr' => "R\u{00E9}cits, ressources et",
                    'ar' => "\u{0642}\u{0635}\u{0635} \u{0648}\u{0645}\u{0648}\u{0627}\u{0631}\u{062F} \u{0648}",
                ],
                'title_accent' => [
                    'en' => 'curated content',
                    'fr' => 'contenus choisis',
                    'ar' => "\u{0645}\u{062D}\u{062A}\u{0648}\u{0649} \u{0645}\u{0646}\u{062A}\u{0642}\u{0649}",
                ],
                'description' => [
                    'en' => 'Explore articles, features, and tools that spotlight expertise and inclusive narratives.',
                    'fr' => "Explorez articles, reportages et outils qui mettent en lumi\u{00E8}re l\u{2019}expertise et des r\u{00E9}cits inclusifs.",
                    'ar' => "\u{0627}\u{0633}\u{062A}\u{0643}\u{0634}\u{0641} \u{0645}\u{0642}\u{0627}\u{0644}\u{0627}\u{062A} \u{0648}\u{0623}\u{062F}\u{0648}\u{0627}\u{062A} \u{062A}\u{0633}\u{0644}\u{0651}\u{0637} \u{0627}\u{0644}\u{0636}\u{0648}\u{0621} \u{0639}\u{0644}\u{0649} \u{0627}\u{0644}\u{062E}\u{0628}\u{0631}\u{0629} \u{0648}\u{0627}\u{0644}\u{0633}\u{0631}\u{062F}\u{064A}\u{0627}\u{062A} \u{0627}\u{0644}\u{0634}\u{0627}\u{0645}\u{0644}\u{0629}.",
                ],
                'card_line' => [
                    'en' => 'Depth, context, and clarity.',
                    'fr' => "Profondeur, contexte et clart\u{00E9}.",
                    'ar' => "\u{0639}\u{0645}\u{0642} \u{0648}\u{0633}\u{064A}\u{0627}\u{0642} \u{0648}\u{0648}\u{0636}\u{0648}\u{062D}.",
                ],
                'ctas' => [
                    ['label' => ['en' => 'Explore media', 'fr' => "Explorer le m\u{00E9}dia", 'ar' => "\u{0627}\u{0633}\u{062A}\u{0643}\u{0634}\u{0641} \u{0627}\u{0644}\u{0648}\u{0633}\u{0627}\u{0626}\u{0637}"], 'url' => '/media', 'style' => 'primary', 'is_active' => true],
                ],
            ],
        ];
    }
}
