import { Head, Link, router, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import HeroSlideForm from '@/pages/admin/hero-slides/partials/HeroSlideForm';

function emptyTri() {
    return { en: '', fr: '', ar: '' };
}

export default function AdminHeroSlideCreate() {
    const { data, setData, errors, setError, clearErrors } = useForm({
        slide_key: '',
        path_prefix: '',
        is_active: true,
        sort_order: 0,
        display_mode: 'normal',
        image_contain: false,
        banner_image_contain: false,
        image_position: null,
        image_bg: null,
        image_url: null,
        image: null,
        image_alt: emptyTri(),
        badge: emptyTri(),
        kicker: emptyTri(),
        title_before: emptyTri(),
        title_accent: emptyTri(),
        description: emptyTri(),
        card_line: emptyTri(),
        ctas: [],
    });

    const [processing, setProcessing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();
        router.post('/admin/hero-slides', data, {
            forceFormData: true,
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onError: (serverErrors) => setError(serverErrors),
        });
    };

    return (
        <>
            <Head title="New hero slide" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-8">
                    <div>
                        <p className="text-sm font-medium text-tgray">Hero Carousel</p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            New slide
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Create a new hero carousel slide.
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
                    mode="create"
                    data={data}
                    setData={setData}
                    errors={errors}
                    submitLabel="Create slide"
                    processing={processing}
                    onSubmit={submit}
                />
            </div>
        </>
    );
}

AdminHeroSlideCreate.layout = (page) => <AppLayout>{page}</AppLayout>;
