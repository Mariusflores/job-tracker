import {DndContext, type DragEndEvent, DragOverlay, type DragStartEvent} from "@dnd-kit/core";
import {useEffect, useState} from "react";
import {PipelineCard} from "../components/pipeline/PipelineCard.tsx";
import {Column} from "../components/pipeline/Column.tsx";
import {arrayMove} from "@dnd-kit/sortable";
import type {Application, ApplicationStatus} from "../types/application.ts";
import {ExpandedApplicationCard} from "../components/application/modals/ExpandedApplicationCard.tsx";

const STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

export function PipelinePage({applications, onStatusChange, onPublishNotes}: {
    applications: Application[],
    onStatusChange: (status: ApplicationStatus, id: number) => void
    onPublishNotes: (notes: string, id: number) => void
}) {
    // Local copy of applications to preserve column ordering
    const [apps, setApps] = useState<Application[]>(applications);

    // Backend updates are merged via useEffect without resetting order
    useEffect(() => {
        setApps(prev => {
            const backendById = new Map(applications.map(a => [a.id, a]));

            // 1. Update existing apps IN THE SAME ORDER
            const updated = prev
                .map(app => {
                    const backend = backendById.get(app.id);
                    return backend ? {...app, ...backend} : app;
                })
                // 2. Remove apps deleted in backend
                .filter(app => backendById.has(app.id));

            // 3. Append new apps that did not exist locally
            const newApps = applications.filter(
                app => !prev.some(p => p.id === app.id)
            );

            return [...updated, ...newApps];
        });
    }, [applications]);


    const columns = {
        APPLIED: apps.filter(a => a.status === "APPLIED"),
        INTERVIEW: apps.filter(a => a.status === "INTERVIEW"),
        OFFER: apps.filter(a => a.status === "OFFER"),
        REJECTED: apps.filter(a => a.status === "REJECTED"),
    } as const;
    const [activeId, setActiveId] = useState<number | null>(null);

    const [expandedApplicationId, setExpandedApplicationId] =
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
        const activeApp = apps.find(a => a.id === activeId);
        if (!activeApp) return;

        let targetStatus: ApplicationStatus | null = null;

        if (isApplicationStatus(overId)) {
            targetStatus = overId;
        } else {
            const overApp = apps.find(a => a.id === overId);
            if (overApp) {
                targetStatus = overApp.status;
            }
        }

        const isSameColumn = targetStatus === activeApp.status;


        // Remove updated application from array, then reinsert to the bottom of the column after status update
        if (targetStatus && targetStatus !== activeApp.status) {

            setApps(prev => {
                const remaining = prev.filter(a => a.id !== activeId);

                const insertIndex =
                    remaining.reduce<number | null>((lastIdx, app, idx) => {
                        return app.status === targetStatus ? idx : lastIdx;
                    }, null);

                const updated = {...activeApp, status: targetStatus};

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
            const columnApps = apps.filter(a => a.status === activeApp.status);
            const oldIndex = columnApps.findIndex(a => a.id === activeId);
            const newIndex = columnApps.findIndex(a => a.id === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
                const reordered = arrayMove(columnApps, oldIndex, newIndex);

                setApps(prev => {
                    const others = prev.filter(a => a.status !== activeApp.status);
                    return [...others, ...reordered];
                });
            }
        }

    }


    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as number);
    }

    function openExpandedView(id: number) {
        setExpandedApplicationId(id);
    }

    const activeApp = apps.find(a => a.id === activeId);

    const expandedApplication =
        apps.find(a => a.id === expandedApplicationId);

    if (!applications.length) {
        return <div className="p-6 text-gray-500">Loading pipeline…</div>;
    }

    return (
        <>
            {expandedApplication && (
                <ExpandedApplicationCard
                    application={expandedApplication}
                    onClose={() => setExpandedApplicationId(null)}
                    expanded={expandedApplicationId !== null}
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
