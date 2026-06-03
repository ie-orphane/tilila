import { Trash2 } from 'lucide-react';

import ConfirmationModal from '@/components/modals/ConfirmationModal';

/**
 * Destructive delete confirmation (wraps ConfirmationModal).
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {() => void} props.onConfirm
 * @param {boolean} [props.processing=false]
 * @param {string} [props.title='Delete this item?']
 * @param {string} [props.description]
 * @param {string} [props.itemName] - Shown in default description when description omitted
 * @param {string} [props.confirmLabel='Delete']
 * @param {string} [props.cancelLabel='Cancel']
 */
export default function DelteModal({
    open,
    onOpenChange,
    onConfirm,
    processing = false,
    title = 'Delete this item?',
    description,
    itemName,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
}) {
    const resolvedDescription =
        description ??
        (itemName
            ? `"${itemName}" will be permanently removed. This action cannot be undone.`
            : 'This action cannot be undone.');

    return (
        <ConfirmationModal
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            description={resolvedDescription}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            onConfirm={onConfirm}
            processing={processing}
            confirmVariant="destructive"
        >
            <p className="flex items-center gap-2 text-xs text-tgray">
                <Trash2 className="size-3.5 shrink-0 text-alpha-danger" aria-hidden />
                Deleted data cannot be recovered from the admin panel.
            </p>
        </ConfirmationModal>
    );
}
