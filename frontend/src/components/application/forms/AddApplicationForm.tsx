import {useState} from "react";
import type {ApplicationData, CreateApplicationRequest} from "../../../types/application.ts";
import {ApplicationForm} from "./ApplicationForm.tsx";
import type {Enrichment} from "../../../types/enrichment.ts";
import {SOURCE_UI} from "../../../constants/enrichmentSource.ts";

export function AddApplicationForm({onClose, onSubmit, onAutofill}: {
    onClose: () => void,
    onSubmit: (request: CreateApplicationRequest) => Promise<void>,
    onAutofill: (url: string) => Promise<Enrichment>
}) {
    const today = new Date().toISOString().split("T")[0];
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAutoFilling, setIsAutoFilling] = useState(false);
    const [enrichment, setEnrichment] = useState<Enrichment | null>(null);


    const [data, setData] = useState<ApplicationData>({
        jobTitle: "",
        companyName: "",
        descriptionUrl: "",
        status: "APPLIED",
        appliedDate: today,
        notes: ""
    })

    async function handleAutofill(url: string) {
        if (!url) return;

        setIsAutoFilling(true);

        try {
            const result = await onAutofill(url);
            console.log("Result: " + result.source)
            setEnrichment(result);
            console.log(enrichment?.source)
            setData(prev => ({
                ...prev,
                jobTitle:
                    !prev.jobTitle && result.jobTitle
                        ? result.jobTitle
                        : prev.jobTitle,

                companyName:
                    !prev.companyName && result.companyName
                        ? result.companyName
                        : prev.companyName,
            }));

        } finally {
            setIsAutoFilling(false);
        }
    }

    async function handleCreate(data: ApplicationData) {
        setIsSubmitting(true)
        try {
            const request: CreateApplicationRequest = {
                ...data,
                jobTitle: data.jobTitle.trim(),
                companyName: data.companyName.trim(),
            };
            await onSubmit(request);
            onClose()
        } finally {
            setIsSubmitting(false)
        }

    }


    return (
        <>
            <div className="px-4 pt-2">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                        Auto-fill from URL
                    </span>

                    <button
                        type="button"
                        disabled={!data.descriptionUrl || isAutoFilling}
                        onClick={() => handleAutofill(data.descriptionUrl)}
                        className="px-3 py-1.5
                        text-sm
                        bg-gray-100 border rounded-md
                        hover:bg-gray-200
                        disabled:opacity-50
            "
                    >
                        {isAutoFilling ? "Fetching…" : "Auto-fill"}
                    </button>
                </div>
            </div>
            {enrichment && (
                <div className="mt-1 text-xs text-gray-500">
                    Auto-filled from{" "}
                    <span className="font-medium">
                        {SOURCE_UI[enrichment.source]}
                    </span>
                </div>
            )}


            <ApplicationForm
                data={data}
                setData={setData}
                onClose={onClose}
                onSubmit={handleCreate}
                isSubmitting={isSubmitting}
            />
        </>
    );
}