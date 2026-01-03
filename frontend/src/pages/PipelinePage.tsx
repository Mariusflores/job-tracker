import {DndContext, type DragEndEvent, DragOverlay, type DragStartEvent} from "@dnd-kit/core";
import {useEffect, useState} from "react";
import {PipelineCard} from "../components/pipeline/PipelineCard.tsx";
import {Column} from "../components/pipeline/Column.tsx";
import {arrayMove} from "@dnd-kit/sortable";
import type {Application, ApplicationStatus} from "../types/application.ts";
import {ExpandedApplicationCard} from "../components/application/modals/ExpandedApplicationCard.tsx";

const STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

function mergeBackendApps(
    local: Application[],
    backend: Application[]
): Application[] {
    const backendById = new Map(backend.map(a => [a.id, a]));

    const updated = local
        .map(app => {
            const backendApp = backendById.get(app.id);
            return backendApp ? {...app, ...backendApp} : app;
        })
        .filter(app => backendById.has(app.id));

    const newApps = backend.filter(
        app => !local.some(l => l.id === app.id)
    );

    return [...updated, ...newApps];
}


export function PipelinePage({backendApps, onStatusChange, onPublishNotes}: {
    backendApps: Application[],
    onStatusChange: (status: ApplicationStatus, id: number) => void
    onPublishNotes: (notes: string, id: number) => void
}) {
    // pipelineApps is the source of truth for column order.
    // Backend updates are merged WITHOUT changing order.
    const [pipelineApps, setPipelineApps] = useState<Application[]>(backendApps);

    // Backend updates are merged via useEffect without resetting order
    useEffect(() => {
        setPipelineApps(prev => mergeBackendApps(prev, backendApps));
    }, [backendApps]);


    const columns = {
        APPLIED: pipelineApps.filter(a => a.status === "APPLIED"),
        INTERVIEW: pipelineApps.filter(a => a.status === "INTERVIEW"),
        OFFER: pipelineApps.filter(a => a.status === "OFFER"),
        REJECTED: pipelineApps.filter(a => a.status === "REJECTED"),
    } as const;
    const [activeId, setActiveId] = useState<number | null>(null);

    const [expandedAppId, setExpandedAppId] =
        useState<number | null>(null);


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
        const draggedApp = pipelineApps.find(a => a.id === activeId);
        if (!draggedApp) return;

        let targetStatus: ApplicationStatus | null = null;

        if (isApplicationStatus(overId)) {
            targetStatus = overId;
        } else {
            const overApp = pipelineApps.find(a => a.id === overId);
            if (overApp) {
                targetStatus = overApp.status;
            }
        }

        const isSameColumn = targetStatus === draggedApp.status;


        // Remove updated application from array, then reinsert to the bottom of the column after status update
        if (targetStatus && targetStatus !== draggedApp.status) {

            setPipelineApps(prev => {
                const remaining = prev.filter(a => a.id !== activeId);

                const insertIndex =
                    remaining.reduce<number | null>((lastIdx, app, idx) => {
                        return app.status === targetStatus ? idx : lastIdx;
                    }, null);

                const updated = {...draggedApp, status: targetStatus};

                if (insertIndex === null) {
                    return [...remaining, updated];
                }

                return [
                    ...remaining.slice(0, insertIndex + 1),
                    updated,
                    ...remaining.slice(insertIndex + 1),
                ];
            });

            onStatusChange(targetStatus, activeId);
            return;
        }


// Reordering ONLY if same column
        if (isSameColumn) {
            const columnApps = pipelineApps.filter(a => a.status === draggedApp.status);
            const oldIndex = columnApps.findIndex(a => a.id === activeId);
            const newIndex = columnApps.findIndex(a => a.id === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
                const reordered = arrayMove(columnApps, oldIndex, newIndex);

                setPipelineApps(prev => {
                    const others = prev.filter(a => a.status !== draggedApp.status);
                    return [...others, ...reordered];
                });
            }
        }

    }


    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as number);
    }

    function openExpandedView(id: number) {
        setExpandedAppId(id);
    }

    const activeApp = pipelineApps.find(a => a.id === activeId);

    const expandedApplication =
        pipelineApps.find(a => a.id === expandedAppId);

    if (!backendApps.length) {
        return <div className="p-6 text-gray-500">Loading pipeline…</div>;
    }

    return (
        <>
            {expandedApplication && (
                <ExpandedApplicationCard
                    application={expandedApplication}
                    onClose={() => setExpandedAppId(null)}
                    expanded={expandedAppId !== null}
                    publishNotes={onPublishNotes}/>
            )}
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
                            onOpenDetails={openExpandedView}
                        />


                    ))}
                </div>

                {/* DRAG OVERLAY */}
                <DragOverlay>
                    {activeApp && (
                        <PipelineCard application={activeApp} isOverlay/>
                    )}
                </DragOverlay>
            </DndContext>
        </>
    );

}
