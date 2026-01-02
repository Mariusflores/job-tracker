import {DndContext, type DragEndEvent, DragOverlay, type DragStartEvent} from "@dnd-kit/core";
import {useState} from "react";
import {PipelineCard} from "../components/pipeline/PipelineCard.tsx";
import {Column} from "../components/pipeline/Column.tsx";
import {arrayMove} from "@dnd-kit/sortable";
import type {Application, ApplicationStatus} from "../types/application.ts";

const STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

export function PipelinePage({applications, onStatusChange}: {
    applications: Application[],
    onStatusChange: (status: ApplicationStatus, id: number) => void
}) {
    const [apps, setApps] = useState(applications);

    const columns = {
        APPLIED: apps.filter(a => a.status === "APPLIED"),
        INTERVIEW: apps.filter(a => a.status === "INTERVIEW"),
        OFFER: apps.filter(a => a.status === "OFFER"),
        REJECTED: apps.filter(a => a.status === "REJECTED"),
    } as const;
    const [activeId, setActiveId] = useState<number | null>(null);

    function isApplicationStatus(value: unknown): value is ApplicationStatus {
        return STATUSES.includes(value as ApplicationStatus);
    }


    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as number;
        const overId = over.id;

        // Find active application
        const activeApp = apps.find(a => a.id === activeId);
        if (!activeApp) return;

        // Remove updated application from array, then reinsert to the bottom of the column after status update
        if (isApplicationStatus(overId)) {
            setApps(prev => {
                const moving = prev.find(a => a.id === activeId);
                if (!moving) return prev;

                const withoutMoving = prev.filter(a => a.id !== activeId);

                const updated = {...moving, status: overId};

                const lastIndexOfStatus = withoutMoving
                    .map((a, i) => ({a, i}))
                    .filter(({a}) => a.status === overId)
                    .pop()?.i;

                if (lastIndexOfStatus === undefined) {
                    // No items in that column → append at end
                    return [...withoutMoving, updated];
                }

                // Insert AFTER the last item of that status
                const result = [...withoutMoving];
                result.splice(lastIndexOfStatus + 1, 0, updated);
                return result;
            });

            onStatusChange(overId, activeId);
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
