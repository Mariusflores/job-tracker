import {useDroppable} from "@dnd-kit/core";
import type {Application} from "../../types/application.ts";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {SortableCard} from "./SortableCard.tsx";

export function Column({status, cards, onOpenDetails}: {
    status: string,
    cards: Application[],
    onOpenDetails: (id: number) => void
}) {
    const {setNodeRef} = useDroppable({id: status});

    return (
        <div className="bg-gray-50 p-3 rounded-lg border min-h-[400px]" ref={setNodeRef}>
            <h3 className="text-black font-semibold mb-2">{status}</h3>

            <div className="space-y-3">
                <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {cards.map(card => (
                        <SortableCard key={card.id} application={card} onOpenDetails={onOpenDetails}/>
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}

