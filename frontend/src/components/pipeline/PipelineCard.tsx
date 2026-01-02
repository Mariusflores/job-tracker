import {StatusBadge} from "../application/badges/StatusBadge.tsx";
import type {PipelineProps} from "../../types/pipeline.ts";
import {ArrowsPointingOutIcon} from "@heroicons/react/16/solid";
import {IconButton} from "../shared/IconButton.tsx";

export function PipelineCard({application, onOpenDetails, isOverlay = false}: PipelineProps) {
    return (
        <div className="
            relative
            bg-white border rounded-lg shadow p-3
            cursor-grab active:cursor-grabbing
            transition hover:shadow-md
        ">
            {onOpenDetails && !isOverlay && (
                <div className="absolute top-2 right-2">
                    <IconButton
                        onPointerDown={(e) => {
                            e.stopPropagation();
                            onOpenDetails(application.id);
                        }}
                        icon={<ArrowsPointingOutIcon className="w-4 h-4"/>}
                    />
                </div>
            )}

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

