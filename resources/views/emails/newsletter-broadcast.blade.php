@extends('emails.layouts.base')

@section('title', $emailSubject)

@section('preheader')
    {{ \Illuminate\Support\Str::limit(strip_tags($bodyHtml), 120) }}
@endsection

@section('footer_note')
    You received this email because you subscribed to the TILILA newsletter.
    Visit our website to discover the latest highlights and initiatives.
@endsection

@section('content')
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td style="padding-bottom: 8px;">
                <h1 style="margin: 0; font-size: 22px; font-weight: 700; line-height: 1.35; color: #0f172a;">
                    {{ $emailSubject }}
                </h1>
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 20px;">
                <div style="height: 3px; width: 48px; background-color: #0097aa; border-radius: 2px; font-size: 0; line-height: 0;">&nbsp;</div>
            </td>
        </tr>
        <tr>
            <td style="font-size: 15px; line-height: 1.7; color: #334155;">
                <div style="color: #334155;">
                    {!! $bodyHtml !!}
                </div>
            </td>
        </tr>
    </table>
@endsection
