<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterBroadcast;
use App\Models\NewsletterSubscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class NewsletterSubscriptionController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email' => 'required|email|max:255',
            'locale' => 'nullable|string|max:8',
        ]);

        NewsletterSubscription::query()->updateOrCreate(
            ['email' => strtolower(trim($data['email']))],
            [
                'locale' => $data['locale'] ?? null,
                'subscribed_at' => now(),
            ]
        );

        return back()->with('success', 'Thank you — you are subscribed.');
    }

    public function index(Request $request): Response
    {
        $query = NewsletterSubscription::query()->orderByDesc('subscribed_at')->orderByDesc('id');

        if ($search = trim((string) $request->query('search', ''))) {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like) {
                $q->where('email', 'like', $like)
                    ->orWhere('locale', 'like', $like);
            });
        }

        if ($locale = $request->query('locale')) {
            if (in_array($locale, ['en', 'fr', 'ar'], true)) {
                $query->where('locale', $locale);
            }
        }

        $baseQuery = NewsletterSubscription::query();

        return Inertia::render('admin/newsletter/index', [
            'subscribers' => $query->paginate(15)->withQueryString(),
            'filters' => [
                'search' => $request->query('search', ''),
                'locale' => $request->query('locale', ''),
            ],
            'stats' => [
                'total' => (clone $baseQuery)->count(),
                'en' => (clone $baseQuery)->where('locale', 'en')->count(),
                'fr' => (clone $baseQuery)->where('locale', 'fr')->count(),
                'ar' => (clone $baseQuery)->where('locale', 'ar')->count(),
                'unknown' => (clone $baseQuery)->where(function ($q) {
                    $q->whereNull('locale')->orWhere('locale', '');
                })->count(),
            ],
            'localeOptions' => [
                ['value' => 'all', 'label' => 'All subscribers'],
                ['value' => 'en', 'label' => 'English (EN)'],
                ['value' => 'fr', 'label' => 'French (FR)'],
                ['value' => 'ar', 'label' => 'Arabic (AR)'],
            ],
        ]);
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $query = NewsletterSubscription::query()->orderByDesc('subscribed_at');

        if ($search = trim((string) $request->query('search', ''))) {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like) {
                $q->where('email', 'like', $like)
                    ->orWhere('locale', 'like', $like);
            });
        }

        if ($locale = $request->query('locale')) {
            if (in_array($locale, ['en', 'fr', 'ar'], true)) {
                $query->where('locale', $locale);
            }
        }

        $filename = 'newsletter-subscribers-'.now()->format('Ymd-His').'.csv';

        return response()->streamDownload(function () use ($query): void {
            $out = fopen('php://output', 'w');
            if ($out === false) {
                return;
            }

            fwrite($out, "\xEF\xBB\xBF");
            $delimiter = ';';

            fputcsv($out, ['id', 'email', 'locale', 'subscribed_at', 'created_at'], $delimiter);

            $query->chunkById(200, function ($rows) use ($out, $delimiter): void {
                foreach ($rows as $row) {
                    fputcsv($out, [
                        $row->id,
                        (string) $row->email,
                        (string) ($row->locale ?? ''),
                        optional($row->subscribed_at)->toIso8601String(),
                        optional($row->created_at)->toIso8601String(),
                    ], $delimiter);
                }
            });

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function send(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'body' => 'required|string|max:50000',
            'locales' => 'required|array|min:1',
            'locales.*' => 'string|in:all,en,fr,ar',
        ]);

        $locales = array_values(array_unique($validated['locales']));
        if (in_array('all', $locales, true)) {
            $locales = ['all'];
        }

        $bodyHtml = nl2br(e($validated['body']));

        $query = NewsletterSubscription::query()->orderBy('id');

        if (! in_array('all', $locales, true)) {
            $query->whereIn('locale', $locales);
        }

        $sent = 0;
        $failed = 0;

        $query->chunkById(100, function ($subscribers) use ($validated, $bodyHtml, &$sent, &$failed): void {
            foreach ($subscribers as $subscriber) {
                try {
                    Mail::to($subscriber->email)->send(new NewsletterBroadcast(
                        emailSubject: $validated['subject'],
                        bodyHtml: $bodyHtml,
                    ));
                    $sent++;
                } catch (\Throwable) {
                    $failed++;
                }
            }
        });

        if ($sent === 0 && $failed === 0) {
            return back()->with('warning', 'No subscribers match the selected audience.');
        }

        if ($failed > 0) {
            return back()->with(
                'warning',
                "Newsletter sent to {$sent} subscriber(s). {$failed} could not be delivered — check mail configuration."
            );
        }

        return back()->with('success', "Newsletter sent to {$sent} subscriber(s).");
    }

    public function destroy(NewsletterSubscription $subscription): RedirectResponse
    {
        $subscription->delete();

        return back()->with('success', 'Subscriber removed.');
    }
}
