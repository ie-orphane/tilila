import { Head, Link, router, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import HeroSlideForm from '@/pages/admin/hero-slides/partials/HeroSlideForm';

function emptyTri() {
    return { en: '', fr: '', ar: '' };
}

export default function AdminHeroSlideEdit({ slide }) {
    const { data, setData, errors, setError, clearErrors } = useForm({
        slide_key: slide.slide_key ?? '',
        path_prefix: slide.path_prefix ?? '',
        is_active: slide.is_active ?? true,
        sort_order: slide.sort_order ?? 0,
        display_mode: slide.display_mode ?? 'normal',
        image_contain: slide.image_contain ?? false,
        banner_image_contain: slide.banner_image_contain ?? false,
        image_position: slide.image_position ?? null,
        image_bg: slide.image_bg ?? null,
        image_url: slide.image_url ?? null,
        image: null,
        image_alt: slide.image_alt ?? emptyTri(),
        badge: slide.badge ?? emptyTri(),
        kicker: slide.kicker ?? emptyTri(),
        title_before: slide.title_before ?? emptyTri(),
        title_accent: slide.title_accent ?? emptyTri(),
        description: slide.description ?? emptyTri(),
        card_line: slide.card_line ?? emptyTri(),
        ctas: slide.ctas ?? [],
    });

    const [processing, setProcessing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        router.put(`/admin/hero-slides/${slide.id}`, data, {
            forceFormData: true,
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onError: (serverErrors) => setError(serverErrors),
        });
    };

    return (
        <>
            <Head title={`Edit slide — ${slide.slide_key}`} />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-8">
                    <div>
                        <p className="text-sm font-medium text-tgray">Hero Carousel</p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Edit slide
                            <code className="ml-2 rounded bg-muted px-2 py-0.5 text-base font-mono">
                                {slide.slide_key}
                            </code>
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Update this hero carousel slide's content and settings.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/admin/hero-slides" className="gap-2">
                            <ChevronLeft className="size-4" />
                            Back to list
                        </Link>
                    </Button>
                </div>

                <HeroSlideForm
                    mode="edit"
                    data={data}
                    setData={setData}
                    errors={errors}
                    submitLabel="Save changes"
                    processing={processing}
                    onSubmit={submit}
                />
            </div>
        </>
    );
}

AdminHeroSlideEdit.layout = (page) => <AppLayout>{page}</AppLayout>;
