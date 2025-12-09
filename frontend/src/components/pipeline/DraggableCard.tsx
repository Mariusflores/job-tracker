import {useDraggable} from "@dnd-kit/core";
import {ApplicationCard} from "../application/cards/ApplicationCard.tsx";
import type {Application} from "../../types/application.ts";

export function DraggableCard({application}: { application: Application }) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: application.id,
    });

    const style = transform
        ? {transform: `translate(${transform.x}px, ${transform.y}px)`}
        : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <ApplicationCard application={application} onDelete={() => console.log("delete")}
                             onEdit={() => console.log("edit")}/>
        </div>
    );
}
