import type {Application, StatusChange} from "../../../types/application";
import {StatusBadge} from "../badges/StatusBadge";
import {parseDate} from "../../../utils/date.ts";
import {EditableNotes} from "./EditableNotes.tsx";
import {useEffect, useState} from "react";


export function ExpandedApplicationForm({
                                            application,
                                            onClose,
                                            updateNotes,
                                            getStatusHistory
                                        }: {
    application: Application,
    onClose: () => void,
    updateNotes: (notes: string, id: number) => Promise<void>
    getStatusHistory: (applicationId: number) => Promise<StatusChange[]>
}) {

    const [statusHistory, setStatusHistory] = useState<StatusChange[]>([])

    useEffect(() => {
        loadStatusHistory()
    }, []);

    async function loadStatusHistory() {
        setStatusHistory(await getStatusHistory(application.id))
    }

    async function saveNotes(notes: string) {
        await updateNotes(notes, application.id);
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
                <EditableNotes initialNotes={application.notes} onSave={saveNotes}/>

                {statusHistory.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Status history
                        </h3>

                        <ul className="space-y-4">
                            {statusHistory.map((change, index) => (
                                <li key={change.id} className="flex gap-3">
                                    {/* Timeline column */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"/>
                                        {index !== statusHistory.length - 1 && (
                                            <div className="w-px flex-1 bg-gray-300 mt-1"/>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium text-gray-800">
                                            {change.toStatus}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            from {change.fromStatus}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(change.changedAt).toLocaleString([], {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}


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
