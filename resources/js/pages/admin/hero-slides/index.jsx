import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, GripVertical, Pencil, Plus, Power, Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

const KNOWN_ROUTE_KEYS = [
    'home', 'about', 'tililab', 'tilila', 'gouvernance',
    'experts', 'events', 'opportunities', 'media',
];

function SortableRow({ slide, index, total, onMoveUp, onMoveDown, onToggle, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: slide.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell className="w-8 px-2">
                <button
                    type="button"
                    className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
                    aria-label="Drag to reorder"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="size-4" />
                </button>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-0.5">
                    <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => onMoveUp(index)}
                        className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Move up"
                    >
                        <ChevronUp className="size-4" />
                    </button>
                    <button
                        type="button"
                        disabled={index === total - 1}
                        onClick={() => onMoveDown(index)}
                        className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Move down"
                    >
                        <ChevronDown className="size-4" />
                    </button>
                </div>
            </TableCell>
            <TableCell>
                {slide.image_url ? (
                    <div className="w-14 h-10 overflow-hidden rounded-lg border border-border bg-muted">
                        <img
                            src={slide.image_url}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-14 h-10 rounded-lg border border-border bg-muted" />
                )}
            </TableCell>
            <TableCell>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    {slide.slide_key}
                </code>
            </TableCell>
            <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                {slide.title_before?.fr ?? slide.title_before?.en ?? '—'}
                {slide.title_accent?.fr ? (
                    <span className="text-beta-blue"> {slide.title_accent.fr}</span>
                ) : null}
            </TableCell>
            <TableCell>
                <Badge variant="outline" className="text-xs capitalize">
                    {slide.display_mode === 'banner_image' ? 'Banner' : 'Normal'}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge
                    variant="outline"
                    className={cn(
                        'text-xs',
                        slide.is_active
                            ? 'border-alpha-green/40 bg-beta-green text-alpha-green'
                            : 'border-border bg-muted text-muted-foreground',
                    )}
                >
                    {slide.is_active ? 'Active' : 'Inactive'}
                </Badge>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/hero-slides/${slide.id}/edit`}>
                            <Pencil className="size-3.5" />
                            Edit
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onToggle(slide)}
                        title={slide.is_active ? 'Deactivate' : 'Activate'}
                    >
                        <Power className="size-3.5" />
                        {slide.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(slide)}
                    >
                        <Trash2 className="size-3.5" />
                        Delete
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default function AdminHeroSlidesIndex({ slides: initialSlides = [] }) {
    const [slides, setSlides] = useState(initialSlides);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleToggle = (slide) => {
        router.patch(`/admin/hero-slides/${slide.id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const sendReorder = (reordered) => {
        router.post('/admin/hero-slides/reorder', {
            ordered_ids: reordered.map((s) => s.id),
        }, { preserveScroll: true });
    };

    const handleMoveUp = (index) => {
        if (index === 0) return;
        const reordered = [...slides];
        [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
        setSlides(reordered);
        sendReorder(reordered);
    };

    const handleMoveDown = (index) => {
        if (index === slides.length - 1) return;
        const reordered = [...slides];
        [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
        setSlides(reordered);
        sendReorder(reordered);
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/admin/hero-slides/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    };

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIndex = slides.findIndex((s) => s.id === active.id);
        const newIndex = slides.findIndex((s) => s.id === over.id);
        const previous = slides;
        const reordered = arrayMove(slides, oldIndex, newIndex);
        setSlides(reordered);
        router.post(
            '/admin/hero-slides/reorder',
            { ordered_ids: reordered.map((s) => s.id) },
            { preserveScroll: true, onError: () => setSlides(previous) },
        );
    };

    return (
        <>
            <Head title="Hero Carousel" />

            <div className="mx-auto flex w-full max-w-[min(100%,90rem)] flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:px-10 lg:pb-10">
                <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-8">
                    <div>
                        <p className="text-sm font-medium text-tgray">Contenu</p>
                        <h1 className="text-2xl font-bold tracking-tight text-tblack">
                            Hero Carousel
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-tgray">
                            Manage the hero carousel slides shown across the site. Drag or use the arrows to reorder.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/hero-slides/create" className="gap-2">
                            <Plus className="size-4" />
                            New slide
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-border">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={slides.map((s) => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-8 px-2">
                                            <span className="sr-only">drag to reorder</span>
                                        </TableHead>
                                        <TableHead className="w-16">Order</TableHead>
                                        <TableHead className="w-20">Image</TableHead>
                                        <TableHead>Slide key</TableHead>
                                        <TableHead>Title (FR)</TableHead>
                                        <TableHead>Mode</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {slides.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-10">
                                                No slides yet. Create your first slide.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {slides.map((slide, index) => (
                                        <SortableRow
                                            key={slide.id}
                                            slide={slide}
                                            index={index}
                                            total={slides.length}
                                            onMoveUp={handleMoveUp}
                                            onMoveDown={handleMoveDown}
                                            onToggle={handleToggle}
                                            onDelete={setDeleteTarget}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>

            <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete slide "{deleteTarget?.slide_key}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                            {KNOWN_ROUTE_KEYS.includes(deleteTarget?.slide_key ?? '') && (
                                <span className="mt-2 block font-semibold text-amber-600">
                                    Warning: "{deleteTarget?.slide_key}" is a built-in slide key. Deleting it will leave the hero blank on that route.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

AdminHeroSlidesIndex.layout = (page) => <AppLayout>{page}</AppLayout>;
