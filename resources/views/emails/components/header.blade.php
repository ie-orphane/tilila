@php
    $homeUrl = config('app.url');
    $logoUrl = url('/assets/logo.webp');
    $tagline = $headerTagline ?? 'Impact · Media · Community';
@endphp
<tr>
    <td style="background: linear-gradient(135deg, #0097aa 0%, #007a8a 100%); padding: 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
                <td style="padding: 28px 40px 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td valign="middle" style="width: 56px;">
                                <a href="{{ $homeUrl }}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                                    <img
                                        src="{{ $logoUrl }}"
                                        alt="TILILA"
                                        width="48"
                                        height="48"
                                        style="display: block; width: 48px; height: 48px; border: 0; border-radius: 8px; background-color: rgba(255, 255, 255, 0.15);"
                                    />
                                </a>
                            </td>
                            <td valign="middle" style="padding-left: 16px;">
                                <a
                                    href="{{ $homeUrl }}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style="text-decoration: none; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 0.04em; line-height: 1.2;"
                                >
                                    TILILA
                                </a>
                                <p style="margin: 4px 0 0; font-size: 12px; font-weight: 500; color: rgba(255, 255, 255, 0.88); letter-spacing: 0.02em;">
                                    {{ $tagline }}
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="height: 4px; background-color: #c29d57; font-size: 0; line-height: 0;">&nbsp;</td>
            </tr>
        </table>
    </td>
</tr>
