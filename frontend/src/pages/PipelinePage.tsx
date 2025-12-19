import {DndContext, type DragEndEvent, DragOverlay, type DragStartEvent} from "@dnd-kit/core";
import {useState} from "react";
import {PipelineCard} from "../components/pipeline/PipelineCard.tsx";
import {Column} from "../components/pipeline/Column.tsx";
import {arrayMove} from "@dnd-kit/sortable";
import type {Application} from "../types/application.ts";

const STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export function PipelinePage({applications, onStatusChange}: {
    applications: Application[],
    onStatusChange: (status: string, id: number) => void
}) {
    const [apps, setApps] = useState(applications);

    const columns = {
        APPLIED: apps.filter(a => a.status === "APPLIED"),
        INTERVIEW: apps.filter(a => a.status === "INTERVIEW"),
        OFFER: apps.filter(a => a.status === "OFFER"),
        REJECTED: apps.filter(a => a.status === "REJECTED"),
    } as const;
    const [activeId, setActiveId] = useState<number | null>(null);


    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as number;
        const overId = over.id;

        // Find active application
        const activeApp = apps.find(a => a.id === activeId);
        if (!activeApp) return;

        const isColumnChange = typeof overId === "string";
        if (isColumnChange) {
            // Changing column (status)
            setApps(prev =>
                prev.map(a =>
                    a.id === activeId
                        ? {...a, status: overId}
                        : a
                )
            );

            // trigger backend update
            onStatusChange(overId as string, activeId);
            return;
        }

        // Reordering within the same column
        const columnApps = apps.filter(a => a.status === activeApp.status);
        const oldIndex = columnApps.findIndex(a => a.id === activeId);
        const newIndex = columnApps.findIndex(a => a.id === overId);

        const reordered = arrayMove(columnApps, oldIndex, newIndex);

        setApps(prev => {
            const others = prev.filter(a => a.status !== activeApp.status);
            return [...others, ...reordered];
        });
    }


    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as number);
    }

    const activeApp = apps.find(a => a.id === activeId);

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* COLUMNS */}
            <div className="grid grid-cols-4 gap-4">
                {STATUSES.map(status => (
                    <Column
                        key={status}
                        status={status}
                        cards={columns[status as keyof typeof columns]}
                    />


                ))}
            </div>

            {/* DRAG OVERLAY */}
            <DragOverlay>
                {activeApp && (
                    <PipelineCard application={activeApp}/>
                )}
            </DragOverlay>
        </DndContext>
    );

}
