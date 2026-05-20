<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventParticipant;
use App\Support\YoutubeVideo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $rows = Event::query()
            ->where('visibility', 'public')
            ->where('status', '!=', 'draft')
            ->orderByRaw('CASE WHEN date IS NULL THEN 1 ELSE 0 END')
            ->orderBy('date')
            ->orderBy('time')
            ->orderByDesc('id')
            ->get();

        $events = $rows->map(fn (Event $e) => $this->publicIndexPayload($e));

        $eventsByYear = [];
        foreach ($rows as $e) {
            if (! $e->date) {
                continue;
            }
            $y = (int) $e->date->format('Y');
            $eventsByYear[$y] = ($eventsByYear[$y] ?? 0) + 1;
        }
        ksort($eventsByYear);

        $initialPanel = match ($request->query('view')) {
            'hub', 'tilitalks' => $request->query('view'),
            'calendar' => 'calendar',
            default => 'calendar',
        };

        return Inertia::render('events/index', [
            'events' => $events,
            'eventStatuses' => ['upcoming', 'live', 'finished', 'archived'],
            'eventsByYear' => $eventsByYear,
            'eventsInitialPanel' => $initialPanel,
        ]);
    }

    public function show(int $id): Response
    {
        $event = Event::query()
            ->with([
                'speakers' => fn ($q) => $q->orderBy('sort')->orderBy('id'),
                'partners' => fn ($q) => $q->orderBy('sort')->orderBy('id'),
                'media' => fn ($q) => $q->orderBy('sort')->orderBy('id'),
            ])
            ->findOrFail($id);

        return Inertia::render('events/[id]', [
            'event' => $this->publicListPayloadForShow($event),
            'details' => $this->publicDetailsPayloadForShow($event),
        ]);
    }

    public function register(Request $request, int $id)
    {
        $event = Event::query()->findOrFail($id);

        $data = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:event_participants,email,NULL,id,event_id,'.$event->id,
            'phone' => 'nullable|string|max:64',
            'locale' => 'nullable|string|max:8',
        ]);

        EventParticipant::query()->create([
            'event_id' => $event->id,
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'locale' => $data['locale'] ?? null,
            'ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 1000),
        ]);

        return back()->with('success', 'Registration submitted.');
    }

    /**
     * List-card shaped payload for the public details page (matches {@see index()}).
     *
     * @return array<string, mixed>
     */
    private function publicListPayloadForShow(Event $event): array
    {
        if (is_array($event->list_payload) && $event->list_payload !== []) {
            $payload = [
                ...$event->list_payload,
                'id' => $event->id,
            ];
        } else {
            $payload = [
                'id' => $event->id,
                'type' => $event->type,
                'badge' => null,
                'dateIso' => $event->date?->format('Y-m-d'),
                'dateTimeIso' => null,
                'startTime' => $event->time ? substr((string) $event->time, 0, 5) : null,
                'endTime' => null,
                'tzLabel' => $event->timezone,
                'title' => $event->title ?? ['en' => '', 'fr' => '', 'ar' => ''],
                'excerpt' => $event->description ?? ['en' => '', 'fr' => '', 'ar' => ''],
                'location' => $event->location ?? ['en' => '', 'fr' => '', 'ar' => ''],
                'isOnline' => false,
                'categoryLabel' => null,
                'imageSrc' => null,
                'cta' => [
                    'label' => ['en' => 'View', 'fr' => 'Voir', 'ar' => 'عرض'],
                    'kind' => 'secondary',
                    'href' => '#',
                ],
            ];
        }

        if (is_string($event->cover_image_path) && $event->cover_image_path !== '') {
            $payload['imageSrc'] = Storage::url($event->cover_image_path);
        }

        $payload['status'] = $event->status;
        $payload['dateTimeIso'] = $payload['dateTimeIso'] ?? $this->publicEventDateTimeIso($event);

        return $payload;
    }

    private function publicEventDateTimeIso(Event $event): ?string
    {
        if (! $event->date) {
            return null;
        }

        $t = $event->time ? substr((string) $event->time, 0, 5) : '12:00';

        return $event->date->format('Y-m-d').'T'.$t.':00';
    }

    /**
     * @return array<string, mixed>
     */
    private function publicIndexPayload(Event $event): array
    {
        if (is_array($event->list_payload) && ($event->list_payload['id'] ?? null)) {
            $row = [
                ...$event->list_payload,
                'id' => $event->id,
            ];
        } else {
            $row = [
                'id' => $event->id,
                'type' => $event->type,
                'badge' => null,
                'dateIso' => $event->date?->format('Y-m-d'),
                'dateTimeIso' => null,
                'startTime' => $event->time ? substr((string) $event->time, 0, 5) : null,
                'endTime' => null,
                'tzLabel' => $event->timezone,
                'title' => $event->title ?? ['en' => '', 'fr' => '', 'ar' => ''],
                'excerpt' => $event->description ?? ['en' => '', 'fr' => '', 'ar' => ''],
                'location' => $event->location ?? ['en' => '', 'fr' => '', 'ar' => ''],
                'isOnline' => false,
                'categoryLabel' => null,
                'imageSrc' => null,
                'cta' => ['label' => ['en' => 'View', 'fr' => 'Voir', 'ar' => 'عرض'], 'kind' => 'secondary', 'href' => '#'],
            ];
        }

        if (is_string($event->cover_image_path) && $event->cover_image_path !== '') {
            $row['imageSrc'] = Storage::url($event->cover_image_path);
        }

        $row['status'] = $event->status;
        $row['dateTimeIso'] = $row['dateTimeIso'] ?? $this->publicEventDateTimeIso($event);

        return $row;
    }

    /**
     * Details sections for the public details page: JSON seed payload and/or DB columns + relations.
     *
     * @return array<string, mixed>
     */
    private function publicDetailsPayloadForShow(Event $event): array
    {
        $seeded = is_array($event->details_payload) && $event->details_payload !== []
            ? $event->details_payload
            : [];

        if ($seeded === []) {
            return $this->buildDetailsPayloadFromEventRecord($event);
        }

        $merged = $seeded;

        if ($event->speakers->isNotEmpty()) {
            $merged['speakers'] = $this->speakersForPublicDetails($event);
        }
        if ($event->partners->isNotEmpty()) {
            $merged['partners'] = $this->partnersForPublicDetails($event);
        }
        if ($event->media->isNotEmpty() && $this->eventAllowsReplayAndGallery($event)) {
            $merged['gallery'] = $this->galleryForPublicDetails($event);
        }

        if (($replay = $this->buildReplayPayload($event)) !== null) {
            $merged['replay'] = $replay;
        }

        if ($this->eventHasAgendaItems($event)) {
            $merged['agenda'] = $this->agendaForPublicDetails($event);
        }

        return $this->stripFinishedEventExtras($event, $merged);
    }

    /**
     * @return array<string, mixed>
     */
    private function buildDetailsPayloadFromEventRecord(Event $event): array
    {
        $desc = $event->description;
        $paragraphs = [];
        if (is_array($desc)) {
            $any = false;
            foreach (['en', 'fr', 'ar'] as $lang) {
                if (trim((string) ($desc[$lang] ?? '')) !== '') {
                    $any = true;
                    break;
                }
            }
            if ($any) {
                $paragraphs = [$desc];
            }
        }

        $payload = [
            'hero' => [
                'badge' => null,
                'dateLabel' => $this->formatPublicEventDateLabel($event),
                'locationLabel' => null,
                'title' => null,
                'subtitle' => null,
            ],
            'about' => [
                'title' => 'About the Event',
                'paragraphs' => $paragraphs,
            ],
            'speakers' => $this->speakersForPublicDetails($event),
            'agenda' => $this->agendaForPublicDetails($event),
            'partners' => $this->partnersForPublicDetails($event),
            'gallery' => $this->galleryForPublicDetails($event),
            'registration' => [
                'badge' => null,
                'title' => 'Event Registration',
                'description' => null,
                'submitLabel' => 'Complete Registration',
            ],
        ];

        if (($replay = $this->buildReplayPayload($event)) !== null) {
            $payload['replay'] = $replay;
        }

        return $this->stripFinishedEventExtras($event, $payload);
    }

    private function eventAllowsReplayAndGallery(Event $event): bool
    {
        return in_array($event->status, ['finished', 'archived'], true);
    }

    /**
     * @return array{title: string, items: list<array{time: string, label: string}>}
     */
    private function agendaForPublicDetails(Event $event): array
    {
        $a = $event->agenda;
        if (! is_array($a)) {
            return ['title' => 'Agenda', 'items' => []];
        }

        $title = isset($a['title']) && is_string($a['title']) && trim($a['title']) !== ''
            ? trim($a['title'])
            : 'Agenda';

        $items = [];
        foreach ($a['items'] ?? [] as $row) {
            if (! is_array($row)) {
                continue;
            }
            $time = trim((string) ($row['time'] ?? ''));
            $label = trim((string) ($row['label'] ?? ''));
            if ($label === '') {
                continue;
            }
            $items[] = [
                'time' => $time === '' ? '—' : $time,
                'label' => $label,
            ];
        }

        return ['title' => $title, 'items' => $items];
    }

    private function eventHasAgendaItems(Event $event): bool
    {
        return count($this->agendaForPublicDetails($event)['items']) > 0;
    }

    /**
     * @return array<string, mixed>|null
     */
    private function buildReplayPayload(Event $event): ?array
    {
        if (! $this->eventAllowsReplayAndGallery($event)) {
            return null;
        }

        $raw = trim((string) ($event->replay_video_url ?? ''));
        if ($raw === '') {
            return null;
        }

        $embed = YoutubeVideo::embedUrlFromInput($raw);
        if ($embed === null) {
            return null;
        }

        return [
            'title' => 'Event Replay',
            'videoTitle' => 'Replay',
            'durationLabel' => '',
            'embedUrl' => $embed,
            'mode' => 'replay',
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function buildLivePayload(Event $event): ?array
    {
        if ($event->status !== 'live') {
            return null;
        }

        $raw = trim((string) ($event->live_video_url ?? ''));
        if ($raw === '') {
            return null;
        }

        $embed = YoutubeVideo::embedUrlFromInput($raw);
        if ($embed === null) {
            return null;
        }

        return [
            'title' => 'Live stream',
            'videoTitle' => 'Watch live',
            'durationLabel' => '',
            'embedUrl' => $embed,
            'mode' => 'live',
        ];
    }

    /**
     * @param  array<string, mixed>  $details
     * @return array<string, mixed>
     */
    private function stripFinishedEventExtras(Event $event, array $details): array
    {
        if (! $this->eventAllowsReplayAndGallery($event)) {
            $details['gallery'] = [
                'title' => is_array($details['gallery'] ?? null) ? ($details['gallery']['title'] ?? 'Photo Gallery') : 'Photo Gallery',
                'items' => [],
            ];
            unset($details['replay']);
        }

        unset($details['live']);
        if (($live = $this->buildLivePayload($event)) !== null) {
            $details['live'] = $live;
        }

        return $details;
    }

    private function formatPublicEventDateLabel(Event $event): ?string
    {
        if (! $event->date) {
            return null;
        }

        $parts = [$event->date->format('M j, Y')];
        if ($event->time) {
            $parts[] = substr((string) $event->time, 0, 5);
        }
        if (is_string($event->timezone) && $event->timezone !== '') {
            $parts[] = $event->timezone;
        }

        return implode(' · ', $parts);
    }

    /**
     * @return array{title: string, items: list<array{name: string, role: string, image: string|null}>}
     */
    private function speakersForPublicDetails(Event $event): array
    {
        return [
            'title' => 'Speakers',
            'items' => $event->speakers
                ->map(fn ($s) => [
                    'name' => (string) $s->full_name,
                    'role' => (string) ($s->role ?? ''),
                    'image' => $s->photo_url,
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array{title: string, items: list<array{name: string, url: string|null, logo: string|null}>}
     */
    private function partnersForPublicDetails(Event $event): array
    {
        return [
            'title' => 'Partners',
            'items' => $event->partners
                ->map(fn ($p) => [
                    'name' => (string) $p->name,
                    'url' => $p->url ? (string) $p->url : null,
                    'logo' => $p->logo_url,
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array{title: string, items: list<array{label: string, isMore?: bool, src?: string|null}>}
     */
    private function galleryForPublicDetails(Event $event): array
    {
        return [
            'title' => 'Photo Gallery',
            'items' => $event->media
                ->map(fn ($m) => [
                    'label' => (string) ($m->original_name ?: 'Photo'),
                    'src' => $m->url,
                ])
                ->values()
                ->all(),
        ];
    }
}
