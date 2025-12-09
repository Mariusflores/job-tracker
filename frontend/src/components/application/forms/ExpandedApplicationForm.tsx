import type {Application} from "../../../types/application.ts";
import {StatusBadge} from "../badges/StatusBadge.tsx";

export function ExpandedApplicationForm({application}: {
    application: Application
}) {
    return <div
        className={"relative  space-y-4 bg-white rounded-lg shadow p-4 border hover:shadow-lg transition"}
    >
        <div className={"flex flex-row justify-between"}>
            <p className={"font-semibold text-2xl text-black"}>{application.jobTitle}</p>
            <div className={"flex flex-row justify-between gap-10"}>
                <p className={"text-gray-500"}>Applied: {application.appliedDate}</p>

                <StatusBadge status={application.status}/>
                {/* Kebab Menu Button */}

            </div>

        </div>

        <p className={"text-gray-500 text-lg"}>{application.companyName}</p>

    </div>
}