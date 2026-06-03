import { Eye, Mail } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function NewsletterEmailPreview({ subject, body, audienceLabel }) {
    const hasContent = subject.trim() || body.trim();

    return (
        <div className="flex h-full min-h-[320px] flex-col rounded-xl border border-border/70 bg-beta-white">
            <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
                <Eye className="size-4 text-beta-blue" aria-hidden />
                <span className="text-sm font-semibold text-tblack">
                    Email preview
                </span>
                <span className="ml-auto text-xs text-tgray">Live</span>
            </div>

            <div className="flex flex-1 flex-col overflow-hidden p-4">
                <div className="mx-auto w-full max-w-sm flex-1 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                    <div className="bg-gradient-to-br from-beta-blue to-beta-blue/80 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-md bg-twhite/15">
                                <Mail className="size-4 text-twhite" />
                            </span>
                            <span className="text-sm font-bold tracking-wide text-twhite">
                                TILILA
                            </span>
                        </div>
                        <div className="mt-2 h-0.5 w-10 rounded-full bg-gold" />
                    </div>

                    <div className="space-y-3 p-4">
                        {hasContent ? (
                            <>
                                <p className="text-sm font-bold leading-snug text-tblack">
                                    {subject.trim() || (
                                        <span className="font-normal text-tgray">
                                            Subject line…
                                        </span>
                                    )}
                                </p>
                                <div
                                    className={cn(
                                        'text-sm leading-relaxed text-tgray',
                                        'whitespace-pre-wrap break-words',
                                    )}
                                >
                                    {body.trim() || (
                                        <span className="italic text-tgray/80">
                                            Your message will appear here…
                                        </span>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="py-8 text-center text-xs leading-relaxed text-tgray">
                                Start typing to preview how your newsletter
                                will look in the inbox.
                            </p>
                        )}
                    </div>

                    <div className="border-t border-border bg-tblack px-4 py-3 text-center">
                        <p className="text-[10px] leading-relaxed text-twhite/70">
                            Sending to{' '}
                            <span className="font-medium text-twhite">
                                {audienceLabel}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
