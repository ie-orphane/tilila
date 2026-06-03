<!DOCTYPE html>
<html lang="@yield('lang', 'en')">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>@yield('title', config('app.name'))</title>
    @stack('head')
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: #f6f7f8; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">
    @hasSection('preheader')
        <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent; mso-hide: all;">
            @yield('preheader')
        </div>
    @endif

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f6f7f8;">
        <tr>
            <td align="center" style="padding: 32px 16px;">
                <table
                    role="presentation"
                    width="600"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;"
                >
                    @include('emails.components.header')

                    <tr>
                        <td style="padding: 36px 40px 32px; font-size: 15px; line-height: 1.65; color: #0f172a;">
                            @yield('content')
                        </td>
                    </tr>

                    @include('emails.components.footer')
                </table>

                @hasSection('footer_legal')
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 600px; margin-top: 16px;">
                        <tr>
                            <td align="center" style="padding: 0 8px; font-size: 11px; line-height: 1.5; color: #94a3b8;">
                                @yield('footer_legal')
                            </td>
                        </tr>
                    </table>
                @endif
            </td>
        </tr>
    </table>
</body>
</html>
