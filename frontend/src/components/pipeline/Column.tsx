import {useDroppable} from "@dnd-kit/core";
import {DraggableCard} from "./DraggableCard.tsx";
import type {Application} from "../../types/application.ts";

export function Column({status, cards, activeId}: { status: string, cards: Application[], activeId: number | null }) {
    const {setNodeRef} = useDroppable({id: status});

    return (
        <div className="bg-gray-50 p-3 rounded-lg border min-h-[400px]" ref={setNodeRef}>
            <h3 className="text-black font-semibold mb-2">{status}</h3>

            <div className="space-y-3">
                {cards.map(card => (
                    card.id === activeId
                        ? <div key={card.id} className="h-[92px] opacity-0"/> // match card height
                        : <DraggableCard key={card.id} application={card}/>
                ))}
            </div>
        </div>
    );
}

