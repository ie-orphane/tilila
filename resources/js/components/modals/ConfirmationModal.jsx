import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const confirmVariantClasses = {
    primary: 'bg-beta-blue text-twhite hover:bg-beta-blue/90',
    destructive:
        'bg-alpha-danger text-twhite hover:bg-alpha-danger/90 focus-visible:ring-alpha-danger/30',
    default: '',
};

/**
 * Generic confirmation dialog (cancel + confirm).
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {string} props.title
 * @param {import('react').ReactNode} [props.description]
 * @param {import('react').ReactNode} [props.children] - Extra body below description
 * @param {string} [props.confirmLabel='Confirm']
 * @param {string} [props.cancelLabel='Cancel']
 * @param {() => void} props.onConfirm
 * @param {boolean} [props.processing=false]
 * @param {boolean} [props.confirmDisabled=false]
 * @param {'primary' | 'destructive' | 'default'} [props.confirmVariant='primary']
 */
export default function ConfirmationModal({
    open,
    onOpenChange,
    title,
    description,
    children,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    processing = false,
    confirmDisabled = false,
    confirmVariant = 'primary',
}) {
    const hasDescription = Boolean(description) || Boolean(children);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {hasDescription ? (
                        <AlertDialogDescription asChild={Boolean(children)}>
                            {children ? (
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {description ? <p>{description}</p> : null}
                                    {children}
                                </div>
                            ) : (
                                description
                            )}
                        </AlertDialogDescription>
                    ) : null}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button type="button" variant="outline" disabled={processing}>
                            {cancelLabel}
                        </Button>
                    </AlertDialogCancel>
                    <Button
                        type="button"
                        className={cn(confirmVariantClasses[confirmVariant])}
                        disabled={processing || confirmDisabled}
                        onClick={onConfirm}
                    >
                        {processing ? 'Please wait…' : confirmLabel}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
