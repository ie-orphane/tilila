@php
    $homeUrl = config('app.url');
    $year = date('Y');
    $note = trim($__env->yieldContent('footer_note'));
    if ($note === '' && isset($footerNote)) {
        $note = $footerNote;
    }
@endphp
<tr>
    <td style="background-color: #0f172a; padding: 28px 40px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            @if($note !== '')
                <tr>
                    <td style="padding-bottom: 16px; font-size: 12px; line-height: 1.55; color: #94a3b8; text-align: center;">
                        {!! $note !!}
                    </td>
                </tr>
            @endif
            <tr>
                <td align="center" style="padding-bottom: 12px;">
                    <a href="{{ $homeUrl }}" target="_blank" rel="noopener noreferrer" style="font-size: 13px; font-weight: 600; color: #0097aa; text-decoration: none;">
                        tilila.ma
                    </a>
                    <span style="color: #475569; font-size: 13px;">&nbsp;·&nbsp;</span>
                    <a href="{{ $homeUrl }}/contact" target="_blank" rel="noopener noreferrer" style="font-size: 13px; color: #94a3b8; text-decoration: none;">
                        Contact
                    </a>
                </td>
            </tr>
            <tr>
                <td align="center" style="font-size: 12px; line-height: 1.5; color: #64748b;">
                    Best regards,<br>
                    <strong style="color: #e2e8f0; font-weight: 600;">The TILILA Team</strong>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding-top: 16px; font-size: 11px; line-height: 1.45; color: #475569;">
                    &copy; {{ $year }} TILILA &mdash; SOREAD 2M. All rights reserved.
                </td>
            </tr>
        </table>
    </td>
</tr>
