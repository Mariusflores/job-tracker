import type {Application} from "../../types/application.ts";
import {PipelineCard} from "./PipelineCard.tsx";
import {useSortable} from "@dnd-kit/sortable";

export function SortableCard({application}: { application: Application }) {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useSortable({id: application.id});

    const style: React.CSSProperties | undefined =
        isDragging
            ? {opacity: 0}  // <-- just remove height entirely
            : transform
                ? {transform: `translate(${transform.x}px, ${transform.y}px)`}
                : undefined;


    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <PipelineCard application={application}/>
        </div>
    );
}

