import type {DragEndEvent} from "@dnd-kit/core";
import {DndContext} from "@dnd-kit/core";
import {Column} from "../components/pipeline/Column.tsx";
import type {Application, ApplicationRequest} from "../types/application.ts";

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

    function handleDragEnd(event: DragEndEvent) {
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

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-4 gap-4">
                {STATUSES.map(status => (
                    <Column key={status} status={status} cards={columns[status as keyof typeof columns]}/>
                ))}
            </div>
        </DndContext>
    );
}
