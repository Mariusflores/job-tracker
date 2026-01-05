import {DndContext, type DragEndEvent, DragOverlay, type DragStartEvent} from "@dnd-kit/core";
import {useEffect, useMemo, useState} from "react";
import {PipelineCard} from "../components/pipeline/PipelineCard.tsx";
import {Column} from "../components/pipeline/Column.tsx";
import {arrayMove} from "@dnd-kit/sortable";
import type {Application, ApplicationStatus} from "../types/application.ts";
import {ExpandedApplicationCard} from "../components/application/modals/ExpandedApplicationCard.tsx";
import {mergeBackendApps, moveAppToBottomOfStatus, resolveTargetStatus} from "../utils/pipeline/pipelineOrder.ts";
import {STATUSES} from "../constants/status.ts";


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


    const columns = useMemo(() => ({
        APPLIED: pipelineApps.filter(a => a.status === "APPLIED"),
        INTERVIEW: pipelineApps.filter(a => a.status === "INTERVIEW"),
        OFFER: pipelineApps.filter(a => a.status === "OFFER"),
        REJECTED: pipelineApps.filter(a => a.status === "REJECTED"),
    }), [pipelineApps]);

    const [activeId, setActiveId] = useState<number | null>(null);

    const [expandedAppId, setExpandedAppId] =
        useState<number | null>(null);


    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as number;
        const overId = over.id;

        // Find active application
        const draggedApp = pipelineApps.find(a => a.id === activeId);
        if (!draggedApp) return;

        const targetStatus = resolveTargetStatus(overId, pipelineApps);

        const isSameColumn = targetStatus === draggedApp.status;


        // Move card to bottom when changing columns
        if (targetStatus && !isSameColumn) {

            setPipelineApps(prev =>
                moveAppToBottomOfStatus(prev, draggedApp.id, targetStatus)
            );
            onStatusChange(targetStatus, activeId);
            return;
        }

        // Reordering ONLY if same column
        if (isSameColumn) {
            const columnApps = pipelineApps.filter(app => app.status === draggedApp.status);
            const oldIndex = columnApps.findIndex(app => app.id === activeId);
            const newIndex = columnApps.findIndex(app => app.id === overId);

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

    function openDetails(id: number) {
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
                    updateNotes={onPublishNotes}/>
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
                            onOpenDetails={openDetails}
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
