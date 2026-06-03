import { AlertCircle, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

/**
 * Error or warning feedback dialog (single action).
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {string} props.message
 * @param {string} [props.title]
 * @param {string} [props.buttonLabel='OK']
 * @param {'error' | 'warning'} [props.variant='error']
 * @param {() => void} [props.onClose]
 */
export default function ErrorModal({
    open,
    onOpenChange,
    message,
    title,
    buttonLabel = 'OK',
    variant = 'error',
    onClose,
}) {
    const isWarning = variant === 'warning';
    const Icon = isWarning ? AlertTriangle : AlertCircle;
    const resolvedTitle =
        title ?? (isWarning ? 'Attention' : 'Something went wrong');

    const handleOpenChange = (next) => {
        onOpenChange(next);
        if (!next && onClose) {
            onClose();
        }
    };

    if (!message) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md [&>button]:hidden">
                <DialogHeader className="items-center text-center sm:items-center sm:text-center">
                    <span
                        className={cn(
                            'mx-auto flex size-12 items-center justify-center rounded-full',
                            isWarning ? 'bg-beta-yellow' : 'bg-beta-danger',
                        )}
                    >
                        <Icon
                            className={cn(
                                'size-7',
                                isWarning
                                    ? 'text-alpha-yellow'
                                    : 'text-alpha-danger',
                            )}
                            aria-hidden
                        />
                    </span>
                    <DialogTitle className="text-tblack">
                        {resolvedTitle}
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm leading-relaxed text-tgray">
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        className={cn(
                            'w-full sm:w-auto',
                            isWarning &&
                                'border-alpha-yellow/50 text-alpha-yellow hover:bg-beta-yellow',
                        )}
                        onClick={() => handleOpenChange(false)}
                    >
                        {buttonLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
