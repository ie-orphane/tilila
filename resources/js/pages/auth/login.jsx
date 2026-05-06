import { Form, Head, setLayoutProps } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/contexts/TranslationContext';
import { store as loginForm } from '@/routes/login';
import { request } from '@/routes/password';

export default function Login({ status, canResetPassword }) {
    const { t } = useTranslation();

    setLayoutProps({
        title: t('auth.login.layoutTitle'),
        description: t('auth.login.layoutDescription'),
    });

    return (
        <>
            <Head title={t('auth.login.headTitle')} />

            <div className="flex flex-col gap-6 text-tblack">
                <Form
                    {...loginForm.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-tblack"
                                    >
                                        {t('auth.login.emailLabel')}
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder={t(
                                            'auth.common.emailPlaceholder',
                                        )}
                                        className="border-border bg-twhite text-tblack placeholder:text-tgray focus-visible:border-beta-blue focus-visible:ring-beta-blue/25"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label
                                            htmlFor="password"
                                            className="text-tblack"
                                        >
                                            {t('auth.common.passwordLabel')}
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request.url()}
                                                className="ml-auto text-sm font-semibold text-beta-blue decoration-beta-blue/30 hover:text-beta-blue hover:decoration-beta-blue"
                                                tabIndex={5}
                                            >
                                                {t('auth.login.forgotPassword')}
                                            </TextLink>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder={t(
                                            'auth.common.passwordPlaceholder',
                                        )}
                                        className="border-border bg-twhite text-tblack placeholder:text-tgray focus-visible:border-beta-blue focus-visible:ring-beta-blue/25"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm text-tgray"
                                    >
                                        {t('auth.login.rememberMe')}
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 w-full rounded-full bg-beta-blue text-sm font-semibold text-twhite shadow-sm transition hover:bg-beta-blue/90 focus-visible:ring-2 focus-visible:ring-beta-blue/40 focus-visible:ring-offset-2"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner />}
                                    {t('auth.login.submit')}
                                </Button>
                            </div>

                        </>
                    )}
                </Form>
            </div>

            {status && (
                <div className="mt-4 rounded-lg border border-border bg-beta-green px-4 py-3 text-center text-sm font-medium text-alpha-green">
                    {status}
                </div>
            )}
        </>
    );
}
