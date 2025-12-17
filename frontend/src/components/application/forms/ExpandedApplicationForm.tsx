import type {Application} from "../../../types/application";
import {StatusBadge} from "../badges/StatusBadge";
import {useEffect, useState} from "react";
import {IconButton} from "../../shared/IconButton.tsx";
import {PencilSquareIcon} from "@heroicons/react/20/solid";
import {parseDate} from "../../../utils/date.ts";

export function ExpandedApplicationForm({
                                            application,
                                            onClose,
                                            publishNotes
                                        }: {
    application: Application,
    onClose: () => void,
    publishNotes: (notes: string, id?: number) => void
}) {

    const [notes, setNotes] = useState(application.notes ?? "");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    useEffect(() => {

        if (!isEditing) return

        const handler = setTimeout(() => {
            submitNotes();
        }, 1000);

        return () => clearTimeout(handler)

    }, [notes]);

    function submitNotes() {
        setIsSaving(true);

        (async () => {

            // Await for [saving..] display
            await publishNotes(notes, application.id);
            setIsSaving(false);
            setLastSaved(new Date());

        })();
    }

    return (
        <div className="relative p-6 space-y-8">

            {/* Header */}
            <div className="flex justify-between items-start pb-5 border-b">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {application.companyName}
                    </h2>
                    <p className="text-gray-600 text-lg">{application.jobTitle}</p>
                </div>

                {/* Right side: badge + close */}
                <div className="flex items-start gap-3">
                    <StatusBadge status={application.status}/>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="space-y-4">

                {/* Applied Date */}
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-sm font-medium text-gray-700">Applied Date</p>
                    <p className="text-gray-800 text-md mt-1">
                        {parseDate(application.appliedDate)}
                    </p>
                </div>

                {/* Description Section */}
                <div className="p-4 bg-gray-50 rounded-lg border space-y-1">
                    <p className="text-sm font-medium text-gray-700">Job Description</p>

                    <a
                        href={application.descriptionUrl}
                        target="_blank"
                        className="text-blue-600 font-medium hover:underline mt-1 break-all"
                    >
                        {application.descriptionUrl || "No URL provided"}
                    </a>
                </div>

                {/* Optional: Notes */}
                <div className="p-4 bg-gray-50 rounded-lg border space-y-2">
                    <div className={"flex flex-row justify-between"}>
                        <label
                            htmlFor="notes"
                            className="text-sm font-medium text-gray-700"
                        >
                            Notes
                        </label>
                        <IconButton onClick={() => setIsEditing(!isEditing)}
                                    icon={<PencilSquareIcon className={"h-5 w-5"}/>}/>
                    </div>

                    {!isEditing && (
                        <p className="text-sm font-medium text-gray-700">
                            {application.notes || "No notes yet"}
                        </p>
                    )}

                    {isEditing && (
                        <div>
                        <textarea
                            id="notes"
                            name="notes"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full p-2 border rounded-md bg-white text-gray-800 focus:ring focus:ring-blue-200"
                            rows={4}
                        />
                            <p className="text-xs text-gray-500 mt-1">
                                {isSaving
                                    ? "Saving..."
                                    : lastSaved
                                        ? `Saved at ${lastSaved.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}`
                                        : ""}
                            </p>

                        </div>
                    )}
                </div>


            </div>

            {/* Optional Action Buttons (visible at bottom)
            <div className="pt-4 border-t flex justify-end gap-3">
                <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition">
                    Edit
                </button>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
                    Delete
                </button>
            </div>
            */}
        </div>
    );
}
