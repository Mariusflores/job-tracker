import {useEffect, useState} from "react";
import {IconButton} from "../../shared/IconButton.tsx";
import {PencilSquareIcon} from "@heroicons/react/20/solid";

export function EditableNotes({
                                  initialNotes,
                                  onSave,
                              }: {
    initialNotes: string;
    onSave: (notes: string) => Promise<void>;
}) {
    const [notes, setNotes] = useState(initialNotes);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [lastSavedNotes, setLastSavedNotes] = useState(initialNotes);


    useEffect(() => {
        setNotes(initialNotes);
        setLastSavedNotes(initialNotes);
    }, [initialNotes]);


    // 🔧 keep in sync with parent
    useEffect(() => {
        setNotes(initialNotes);
    }, [initialNotes]);

    useEffect(() => {
        if (!isEditing) return;
        if (notes === lastSavedNotes) return

        const handler = setTimeout(() => {
            submit();
        }, 1000);

        return () => clearTimeout(handler);
    }, [notes, isEditing]);

    function submit() {
        setIsSaving(true);

        (async () => {
            await onSave(notes);
            setIsSaving(false);
            setLastSaved(new Date());
        })();
    }


    return (
        <div className="p-4 bg-gray-50 rounded-lg border space-y-2">
            <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">
                    Notes
                </label>
                <IconButton
                    onClick={() => setIsEditing(!isEditing)}
                    icon={<PencilSquareIcon className="h-5 w-5"/>}
                />
            </div>

            {!isEditing && (
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <p className="text-sm font-medium text-gray-700">
                        {notes || "No notes yet"}
                    </p>
                    {isSaving && <span>Saving…</span>}
                    {!isSaving && lastSaved && (
                        <span className="text-gray-400">
        Saved {lastSaved.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
    </span>
                    )}

                </div>
            )}

            {isEditing && (
                <div>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="w-full p-2 border rounded-md bg-white text-gray-800 focus:ring focus:ring-blue-200"
                        rows={4}
                    />
                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                        <span>
                            {notes.length} characters
                        </span>
                        {isSaving && <span>Saving…</span>}
                        {!isSaving && lastSaved && (
                            <span className="text-gray-400">
                                Saved {lastSaved.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
    </span>
                        )}

                    </div>

                </div>
            )}
        </div>
    );
}