@extends('emails.layouts.base')

@section('lang', 'fr')

@section('title', 'Accusé de réception — Trophée Tilila')

@section('preheader')
    Nous confirmons la bonne réception de votre participation au Trophée Tilila.
@endsection

@section('content')
    @php
        /** @var \App\Models\TililaContestParticipant $participant */
    @endphp

    <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; color: #0f172a;">
        Accusé de réception — Trophée Tilila
    </h2>

    <p style="margin: 0 0 14px; color: #334155;">
        Bonjour {{ $participant->first_name }} {{ $participant->last_name }},
    </p>
    <p style="margin: 0 0 20px; color: #334155;">
        Nous confirmons la bonne réception de votre formulaire de participation au
        <strong style="color: #0f172a;">Trophée Tilila</strong>.
    </p>

    <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="margin: 0 0 8px; background-color: #f6f7f8; border: 1px solid #e2e8f0; border-radius: 10px;"
    >
        <tr>
            <td style="padding: 18px 20px; font-size: 14px; line-height: 1.65; color: #334155;">
                <p style="margin: 0 0 8px;">
                    <strong style="color: #0f172a;">Année</strong><br>
                    {{ now()->year }}
                </p>
                @if($participant->submission_title)
                    <p style="margin: 0 0 8px;">
                        <strong style="color: #0f172a;">Titre</strong><br>
                        {{ $participant->submission_title }}
                    </p>
                @endif
                @if($participant->submission_link)
                    <p style="margin: 0 0 8px;">
                        <strong style="color: #0f172a;">Lien</strong><br>
                        <a href="{{ $participant->submission_link }}" style="color: #0097aa; word-break: break-all;">{{ $participant->submission_link }}</a>
                    </p>
                @endif
                <p style="margin: 0;">
                    <strong style="color: #0f172a;">Date</strong><br>
                    {{ $participant->created_at?->format('Y-m-d H:i') }}
                </p>
            </td>
        </tr>
    </table>
@endsection

@section('footer_note')
    Merci pour votre participation. L&rsquo;&eacute;quipe Tilila reste &agrave; votre disposition pour toute question.
@endsection
