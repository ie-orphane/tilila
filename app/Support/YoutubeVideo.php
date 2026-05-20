<?php

namespace App\Support;

final class YoutubeVideo
{
    /**
     * Convert a YouTube watch, live, short, youtu.be, or embed URL to a canonical embed URL, or null if invalid.
     */
    public static function embedUrlFromInput(string $url): ?string
    {
        $url = trim($url);
        if ($url === '') {
            return null;
        }

        if (preg_match('#youtube(?:-nocookie)?\.com/embed/([a-zA-Z0-9_-]+)#', $url, $m)) {
            return 'https://www.youtube.com/embed/'.$m[1];
        }

        if (preg_match('#(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/(?:shorts|live)/)([a-zA-Z0-9_-]+)#', $url, $m)) {
            return 'https://www.youtube.com/embed/'.$m[1];
        }

        return null;
    }
}
