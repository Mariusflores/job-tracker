import {useDraggable} from "@dnd-kit/core";
import type {Application} from "../../types/application.ts";
import {PipelineCard} from "./PipelineCard.tsx";

export function DraggableCard({application}: { application: Application }) {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: application.id,
    });

    const style = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
        boxShadow: isDragging ? "0 8px 20px rgba(0,0,0,0.25)" : "none",
        opacity: isDragging ? 0.9 : 1,
        cursor: isDragging ? "grabbing" : "grab",
        transition: "box-shadow 0.15s ease, opacity 0.15s ease",
    };


    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        >
            <PipelineCard application={application}/>
        </div>
    );
}
