@extends('emails.layouts.base')

@section('title', 'Expert Back Office Access')

@section('preheader')
    Your expert application has been accepted. Sign in to manage your profile.
@endsection

@section('content')
    <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #0f172a;">
        Your expert application has been accepted
    </h2>

    <p style="margin: 0 0 14px; color: #334155;">
        Hello {{ $user->name }},
    </p>
    <p style="margin: 0 0 20px; color: #334155;">
        Your expert application was accepted. You can now access your expert back office to edit your information.
    </p>

    <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="margin: 0 0 24px; background-color: #f6f7f8; border: 1px solid #e2e8f0; border-radius: 10px;"
    >
        <tr>
            <td style="padding: 18px 20px; font-size: 14px; line-height: 1.6; color: #334155;">
                <p style="margin: 0 0 10px;">
                    <strong style="color: #0f172a;">Login URL</strong><br>
                    <a href="{{ url('/login') }}" style="color: #0097aa; text-decoration: none;">{{ url('/login') }}</a>
                </p>
                <p style="margin: 0 0 10px;">
                    <strong style="color: #0f172a;">Email</strong><br>
                    {{ $user->email }}
                </p>
                @if($temporaryPassword)
                    <p style="margin: 0 0 10px;">
                        <strong style="color: #0f172a;">Temporary password</strong><br>
                        <code style="font-family: Consolas, monospace; font-size: 13px; background: #ffffff; padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0;">{{ $temporaryPassword }}</code>
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #64748b;">
                        Please sign in and change your password from Security settings.
                    </p>
                @else
                    <p style="margin: 0; font-size: 13px; color: #64748b;">
                        Your account already existed. If needed, you can reset your password from the login page.
                    </p>
                @endif
            </td>
        </tr>
    </table>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td style="border-radius: 8px; background-color: #0097aa;">
                <a
                    href="{{ url('/expert/dashboard') }}"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none;"
                >
                    Open expert dashboard
                </a>
            </td>
        </tr>
    </table>
@endsection
