import {useDraggable} from "@dnd-kit/core";
import type {Application} from "../../types/application.ts";
import {PipelineCard} from "./PipelineCard.tsx";

export function DraggableCard({application}: { application: Application }) {
    const {attributes, listeners, setNodeRef, transform, isDragging} =
        useDraggable({
            id: application.id,
        });

    const style = isDragging
        ? {opacity: 0}            // hide original card
        : transform
            ? {transform: `translate(${transform.x}px, ${transform.y}px)`}
            : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <PipelineCard application={application}/>
        </div>
    );
}

