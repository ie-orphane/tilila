import { CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

/**
 * Success feedback dialog (single action).
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {string} props.message
 * @param {string} [props.title='Success']
 * @param {string} [props.buttonLabel='OK']
 * @param {() => void} [props.onClose] - Called when dialog closes
 */
export default function SuccessModal({
    open,
    onOpenChange,
    message,
    title = 'Success',
    buttonLabel = 'OK',
    onClose,
}) {
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
                    <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-beta-green">
                        <CheckCircle2
                            className="size-7 text-alpha-green"
                            aria-hidden
                        />
                    </span>
                    <DialogTitle className="text-tblack">{title}</DialogTitle>
                    <DialogDescription className="text-center text-sm leading-relaxed text-tgray">
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center">
                    <Button
                        type="button"
                        className="w-full bg-beta-blue text-twhite hover:bg-beta-blue/90 sm:w-auto"
                        onClick={() => handleOpenChange(false)}
                    >
                        {buttonLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
