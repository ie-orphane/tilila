import { Head, setLayoutProps, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';

function FieldError({ error }) {
    if (!error) {
        return null;
    }

    return <p className="mt-1 text-xs text-alpha-danger">{error}</p>;
}

export default function ExpertProfileEdit({ expert }) {
    setLayoutProps({
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: '/experts/dashboard',
            },
            {
                title: 'My Profile',
                href: '#',
            },
        ],
        title: 'Edit My Profile',
        description:
            'Update your public profile and keep your expert information accurate.',
    });

    const { data, setData, patch, processing, errors } = useForm({
        name: expert?.name ?? '',
        title: expert?.title ?? '',
        email: expert?.email ?? '',
        phone: expert?.phone ?? '',
        country: expert?.country ?? '',
        city: expert?.city ?? '',
        expertise: expert?.expertise ?? '',
        bio: expert?.bio ?? '',
        linkedin_url: expert?.linkedin_url ?? '',
        portfolio_url: expert?.portfolio_url ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch('/expert/profile');
    };

    return (
        <>
            <Head title="Edit Expert Profile" />

            <div className="mx-auto flex w-full max-w-[min(100%,70rem)] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl border border-border/70 bg-card p-5 shadow-sm sm:p-6"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Full name
                            </label>
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            <FieldError error={errors.name} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Current title
                            </label>
                            <Input
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                            />
                            <FieldError error={errors.title} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Email
                            </label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                            <FieldError error={errors.email} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Phone
                            </label>
                            <Input
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                            />
                            <FieldError error={errors.phone} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Country
                            </label>
                            <Input
                                value={data.country}
                                onChange={(e) =>
                                    setData('country', e.target.value)
                                }
                            />
                            <FieldError error={errors.country} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">
                                City
                            </label>
                            <Input
                                value={data.city}
                                onChange={(e) =>
                                    setData('city', e.target.value)
                                }
                            />
                            <FieldError error={errors.city} />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Expertise
                        </label>
                        <textarea
                            value={data.expertise}
                            onChange={(e) =>
                                setData('expertise', e.target.value)
                            }
                            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        />
                        <FieldError error={errors.expertise} />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-foreground">
                            Bio
                        </label>
                        <textarea
                            value={data.bio}
                            onChange={(e) => setData('bio', e.target.value)}
                            className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        />
                        <FieldError error={errors.bio} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-foreground">
                                LinkedIn URL
                            </label>
                            <Input
                                type="url"
                                value={data.linkedin_url}
                                onChange={(e) =>
                                    setData('linkedin_url', e.target.value)
                                }
                                placeholder="https://linkedin.com/in/..."
                            />
                            <FieldError error={errors.linkedin_url} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-foreground">
                                Portfolio URL
                            </label>
                            <Input
                                type="url"
                                value={data.portfolio_url}
                                onChange={(e) =>
                                    setData('portfolio_url', e.target.value)
                                }
                                placeholder="https://..."
                            />
                            <FieldError error={errors.portfolio_url} />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
