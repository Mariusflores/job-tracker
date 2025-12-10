import type {Application} from "../../types/application.ts";
import {StatusBadge} from "../application/badges/StatusBadge.tsx";

export function PipelineCard({application}: { application: Application }) {
    return (
        <div className="
            bg-white border rounded-lg shadow p-3
            cursor-grab active:cursor-grabbing
            transition hover:shadow-md
        ">
            <p className="font-semibold text-gray-900 text-sm">
                {application.companyName}
            </p>

            <p className="text-gray-600 text-xs truncate">
                {application.jobTitle}
            </p>

            <div className="mt-2">
                <StatusBadge status={application.status}/>
            </div>
        </div>
    );
}
