import {useDroppable} from "@dnd-kit/core";
import type {Application} from "../../types/application.ts";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {SortableCard} from "./SortableCard.tsx";

export function Column({status, cards}: { status: string, cards: Application[] }) {
    const {setNodeRef} = useDroppable({id: status});

    return (
        <div className="bg-gray-50 p-3 rounded-lg border min-h-[400px]" ref={setNodeRef}>
            <h3 className="text-black font-semibold mb-2">{status}</h3>

            <div className="space-y-3">
                <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {cards.map(card => (
                        <SortableCard key={card.id} application={card}/>
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}

