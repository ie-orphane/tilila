<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Support\YoutubeVideo;
use App\Models\EventPartner;
use App\Models\EventSpeaker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Event::query()->orderByDesc('updated_at');

        if ($search = trim((string) $request->query('search', ''))) {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like) {
                foreach (['en', 'fr', 'ar'] as $lang) {
                    $q->orWhere("title->{$lang}", 'like', $like)
                        ->orWhere("location->{$lang}", 'like', $like);
                }
                $q->orWhere('type', 'like', $like)
                    ->orWhere('status', 'like', $like)
                    ->orWhere('slug', 'like', $like);
            });
        }

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return Inertia::render('admin/events/index', [
            'events' => $query->paginate(15)->withQueryString(),
            'filters' => [
                'search' => $request->query('search', ''),
                'type' => $request->query('type', ''),
                'status' => $request->query('status', ''),
            ],
            'types' => $this->types(),
            'statuses' => $this->statuses(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/events/create', [
            'types' => $this->types(),
            'statuses' => $this->statuses(),
            'visibilities' => $this->visibilities(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlugFromEnglishTitle($data['title']['en']);

        $speakers = $request->input('speakers', []);
        $partners = $request->input('partners', []);

        /** @var Event $event */
        $event = DB::transaction(function () use ($request, $data, $speakers, $partners): Event {
            if ($request->hasFile('cover_image')) {
                $data['cover_image_path'] = $request->file('cover_image')->store('event-covers', 'public');
            } else {
                $data['cover_image_path'] = $data['cover_image_path'] ?? null;
            }

            $event = Event::create($data);

            $this->replaceEventSpeakers(
                $event,
                $request,
                is_array($speakers) ? $speakers : [],
                new Collection,
            );
            $this->replaceEventPartners(
                $event,
                $request,
                is_array($partners) ? $partners : [],
                new Collection,
            );

            return $event;
        });

        return redirect()->route('admin.events.index')->with('success', 'Event created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event): Response
    {
        $event->load([
            'participants' => fn ($q) => $q->latest()->limit(2000),
            'partners' => fn ($q) => $q->orderBy('sort')->orderBy('id'),
            'media' => fn ($q) => $q->orderBy('sort')->orderBy('id'),
            'speakers' => fn ($q) => $q->orderBy('sort')->orderBy('id'),
        ]);

        $total = $event->participants->count();

        return Inertia::render('admin/events/show', [
            'event' => $event,
            'stats' => [
                'total_attendees' => $total,
                'confirmed' => $total,
                'pending' => 0,
                'capacity_filled' => 0,
                'ticket_revenue' => ['label' => 'FREE', 'note' => null],
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event): Response
    {
        $event->load([
            'partners' => fn ($q) => $q->orderBy('sort')->orderBy('id'),
            'media' => fn ($q) => $q->orderBy('sort')->orderBy('id'),
            'speakers' => fn ($q) => $q->orderBy('sort')->orderBy('id'),
        ]);

        return Inertia::render('admin/events/edit', [
            'event' => $event,
            'types' => $this->types(),
            'statuses' => $this->statuses(),
            'visibilities' => $this->visibilities(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event): RedirectResponse
    {
        $data = $this->validated($request, $event);

        if (($data['title']['en'] ?? '') !== ($event->title['en'] ?? '')) {
            $data['slug'] = $this->uniqueSlugFromEnglishTitle($data['title']['en'], $event->id);
        }

        $speakers = $request->input('speakers', []);
        $partners = $request->input('partners', []);

        DB::transaction(function () use ($request, $event, $data, $speakers, $partners): void {
            if ($request->hasFile('cover_image')) {
                if (is_string($event->cover_image_path) && $event->cover_image_path !== '') {
                    Storage::disk('public')->delete($event->cover_image_path);
                }
                $data['cover_image_path'] = $request->file('cover_image')->store('event-covers', 'public');
            } elseif (! array_key_exists('cover_image_path', $data) || $data['cover_image_path'] === null || $data['cover_image_path'] === '') {
                $data['cover_image_path'] = $event->cover_image_path;
            }

            $event->update($data);

            $prevSpeakers = $event->speakers()->get();
            $prevPartners = $event->partners()->get();

            $this->replaceEventSpeakers(
                $event,
                $request,
                is_array($speakers) ? $speakers : [],
                $prevSpeakers,
            );
            $this->replaceEventPartners(
                $event,
                $request,
                is_array($partners) ? $partners : [],
                $prevPartners,
            );

            $allowsGallery = in_array($data['status'], ['finished', 'archived'], true);

            if ($allowsGallery && $request->hasFile('media_files')) {
                $sortBase = (int) $event->media()->max('sort') + 1;
                foreach ((array) $request->file('media_files') as $idx => $file) {
                    if (! $file) {
                        continue;
                    }
                    $path = $file->store('event-media', 'public');
                    $event->media()->create([
                        'path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'mime' => $file->getClientMimeType(),
                        'size' => $file->getSize(),
                        'sort' => $sortBase + (int) $idx,
                    ]);
                }
            }
        });

        return redirect()->route('admin.events.index')->with('success', 'Event updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event): RedirectResponse
    {
        $event->load(['media', 'speakers', 'partners']);
        if (is_string($event->cover_image_path) && $event->cover_image_path !== '') {
            Storage::disk('public')->delete($event->cover_image_path);
        }
        foreach ($event->media as $m) {
            if (is_string($m->path) && $m->path !== '') {
                Storage::disk('public')->delete($m->path);
            }
        }
        foreach ($event->speakers as $s) {
            if (is_string($s->photo_path) && $s->photo_path !== '') {
                Storage::disk('public')->delete($s->photo_path);
            }
        }
        foreach ($event->partners as $p) {
            if (is_string($p->logo_path) && $p->logo_path !== '') {
                Storage::disk('public')->delete($p->logo_path);
            }
        }
        $event->delete();

        return redirect()->route('admin.events.index')->with('success', 'Event deleted.');
    }

    /**
     * @return list<string>
     */
    private function types(): array
    {
        return ['tilitalk', 'trophy', 'workshop', 'other'];
    }

    /**
     * @return list<string>
     */
    private function statuses(): array
    {
        return ['draft', 'upcoming', 'live', 'finished', 'archived'];
    }

    /**
     * @return list<string>
     */
    private function visibilities(): array
    {
        return ['public', 'private'];
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Event $event = null): array
    {
        $validated = $request->validate([
            'type' => 'required|string|max:32',
            'status' => 'required|string|max:32',
            'visibility' => 'required|string|max:16',
            'title' => 'required|array',
            'title.en' => 'required|string|max:255',
            'title.fr' => 'nullable|string|max:255',
            'title.ar' => 'nullable|string|max:255',
            'location' => 'nullable|array',
            'location.en' => 'nullable|string|max:255',
            'location.fr' => 'nullable|string|max:255',
            'location.ar' => 'nullable|string|max:255',
            'description' => 'nullable|array',
            'description.en' => 'nullable|string|max:5000',
            'description.fr' => 'nullable|string|max:5000',
            'description.ar' => 'nullable|string|max:5000',
            'date' => 'nullable|date',
            'time' => 'nullable|date_format:H:i',
            'timezone' => 'nullable|string|max:16',
            'cover_image' => 'nullable|image|max:8192',
            'cover_image_path' => 'nullable|string|max:500',
            'replay_video_url' => 'nullable|string|max:2048',
            'live_video_url' => 'nullable|string|max:2048',
            'agenda' => 'nullable|array',
            'agenda.title' => 'nullable|string|max:255',
            'agenda.items' => 'nullable|array',
            'agenda.items.*.time' => 'nullable|string|max:32',
            'agenda.items.*.label' => 'nullable|string|max:500',
            'speakers' => 'nullable|array',
            'speakers.*.full_name' => 'nullable|string|max:255',
            'speakers.*.role' => 'nullable|string|max:255',
            'speakers.*.email' => 'nullable|email|max:255',
            'speakers.*.photo_path' => 'nullable|string|max:500',
            'speakers.*.photo' => 'nullable|image|max:5120',
            'partners' => 'nullable|array',
            'partners.*.name' => 'nullable|string|max:255',
            'partners.*.url' => 'nullable|url|max:2048',
            'partners.*.logo_path' => 'nullable|string|max:500',
            'partners.*.logo' => 'nullable|image|max:5120',
            'media_files' => 'nullable',
            'media_files.*' => 'file|max:10240',
        ]);

        $validated['location'] = $validated['location'] ?? ['en' => '', 'fr' => '', 'ar' => ''];
        $validated['description'] = $validated['description'] ?? ['en' => '', 'fr' => '', 'ar' => ''];
        $validated['timezone'] = $validated['timezone'] ?? ($event?->timezone ?? 'GMT+1');

        unset($validated['cover_image']);

        $validated['agenda'] = $this->normalizeAgendaInput($validated['agenda'] ?? null);

        $liveUrl = trim((string) ($validated['live_video_url'] ?? ''));
        if ($liveUrl !== '' && YoutubeVideo::embedUrlFromInput($liveUrl) === null) {
            throw ValidationException::withMessages([
                'live_video_url' => 'Enter a valid YouTube link (watch, live, shorts, youtu.be, or embed).',
            ]);
        }
        $validated['live_video_url'] = $liveUrl === '' ? null : $liveUrl;

        return $validated;
    }

    /**
     * @param  array<string, mixed>|null  $agenda
     * @return array{title: string, items: list<array{time: string, label: string}>}|null
     */
    private function normalizeAgendaInput(?array $agenda): ?array
    {
        if (! is_array($agenda)) {
            return null;
        }

        $title = trim((string) ($agenda['title'] ?? ''));
        if ($title === '') {
            $title = 'Agenda';
        }

        $items = [];
        $rawItems = $agenda['items'] ?? [];
        if (is_array($rawItems)) {
            foreach ($rawItems as $row) {
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
        }

        if ($items === []) {
            return null;
        }

        return ['title' => $title, 'items' => $items];
    }

    private function uniqueSlugFromEnglishTitle(string $englishTitle, ?int $ignoreId = null): string
    {
        $base = Str::slug($englishTitle);
        if ($base === '') {
            $base = 'event';
        }

        $slug = $base;
        $n = 1;

        while (
            Event::query()
                ->when($ignoreId !== null, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$n++;
        }

        return $slug;
    }

    /**
     * @param  array<int, mixed>  $speakers
     * @param  Collection<int, EventSpeaker>  $previous
     */
    private function replaceEventSpeakers(
        Event $event,
        Request $request,
        array $speakers,
        Collection $previous,
    ): void {
        $rows = [];
        foreach (array_values($speakers) as $idx => $s) {
            if (! is_array($s)) {
                continue;
            }
            $fullName = trim((string) ($s['full_name'] ?? ''));
            if ($fullName === '') {
                continue;
            }
            $photoPath = null;
            if ($request->hasFile("speakers.$idx.photo")) {
                $photoPath = $request->file("speakers.$idx.photo")->store('event-speakers', 'public');
            } elseif (! empty($s['photo_path']) && is_string($s['photo_path'])) {
                $photoPath = $s['photo_path'];
            }
            $rows[] = [
                'full_name' => $fullName,
                'role' => ($s['role'] ?? null) ? (string) $s['role'] : null,
                'email' => ($s['email'] ?? null) ? (string) $s['email'] : null,
                'photo_path' => $photoPath,
                'sort' => count($rows),
            ];
        }

        $keepPaths = collect($rows)->pluck('photo_path')->filter()->all();
        foreach ($previous as $old) {
            if ($old->photo_path && ! in_array($old->photo_path, $keepPaths, true)) {
                Storage::disk('public')->delete($old->photo_path);
            }
        }

        $event->speakers()->delete();
        foreach ($rows as $row) {
            $event->speakers()->create($row);
        }
    }

    /**
     * @param  array<int, mixed>  $partners
     * @param  Collection<int, EventPartner>  $previous
     */
    private function replaceEventPartners(
        Event $event,
        Request $request,
        array $partners,
        Collection $previous,
    ): void {
        $rows = [];
        foreach (array_values($partners) as $idx => $p) {
            if (! is_array($p)) {
                continue;
            }
            $name = trim((string) ($p['name'] ?? ''));
            if ($name === '') {
                continue;
            }
            $logoPath = null;
            if ($request->hasFile("partners.$idx.logo")) {
                $logoPath = $request->file("partners.$idx.logo")->store('event-partner-logos', 'public');
            } elseif (! empty($p['logo_path']) && is_string($p['logo_path'])) {
                $logoPath = $p['logo_path'];
            }
            $rows[] = [
                'name' => $name,
                'url' => ($p['url'] ?? null) ? (string) $p['url'] : null,
                'logo_path' => $logoPath,
                'sort' => count($rows),
            ];
        }

        $keepPaths = collect($rows)->pluck('logo_path')->filter()->all();
        foreach ($previous as $old) {
            if ($old->logo_path && ! in_array($old->logo_path, $keepPaths, true)) {
                Storage::disk('public')->delete($old->logo_path);
            }
        }

        $event->partners()->delete();
        foreach ($rows as $row) {
            $event->partners()->create($row);
        }
    }
}
