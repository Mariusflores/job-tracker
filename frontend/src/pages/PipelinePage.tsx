import {DndContext, type DragEndEvent, DragOverlay, type DragStartEvent} from "@dnd-kit/core";
import type {Application, ApplicationRequest} from "../types/application.ts";
import {useState} from "react";
import {PipelineCard} from "../components/pipeline/PipelineCard.tsx";
import {Column} from "../components/pipeline/Column.tsx";

const STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export function PipelinePage({applications, onStatusChange}: {
    applications: Application[],
    onStatusChange: (request: ApplicationRequest, id?: number) => void
}) {
    const columns = {
        APPLIED: applications.filter(a => a.status === "APPLIED"),
        INTERVIEW: applications.filter(a => a.status === "INTERVIEW"),
        OFFER: applications.filter(a => a.status === "OFFER"),
        REJECTED: applications.filter(a => a.status === "REJECTED"),
    } as const;
    const [activeId, setActiveId] = useState<number | null>(null);

    function handleDragEnd(event: DragEndEvent) {
        setActiveId(null)
        const {active, over} = event;

        if (!over) return;

        const newStatus = over.id as string;
        const appId = active.id as number;

        const app = applications.find(a => a.id === appId);


        if (!app) return

        const request: ApplicationRequest = {
            appliedDate: app.appliedDate,
            companyName: app.companyName,
            descriptionUrl: app.descriptionUrl,
            jobTitle: app.jobTitle,
            notes: app.notes,
            status: newStatus

        };
        onStatusChange(request, appId)

    }

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as number);
    }

    const activeApp = applications.find(a => a.id === activeId);

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
                        activeId={activeId}
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
