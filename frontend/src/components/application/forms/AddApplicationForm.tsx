import {useState} from "react";
import type {ApplicationData, CreateApplicationRequest} from "../../../types/application.ts";
import {ApplicationForm} from "./ApplicationForm.tsx";
import type {Enrichment} from "../../../types/enrichment.ts";

export function AddApplicationForm({onClose, onSubmit, onAutofill}: {
    onClose: () => void,
    onSubmit: (request: CreateApplicationRequest) => Promise<void>,
    onAutofill: (url: string) => Promise<Enrichment>
}) {
    const today = new Date().toISOString().split("T")[0];
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAutoFilling, setIsAutoFilling] = useState(false);

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

            setData(prev => ({
                ...prev,
                jobTitle: result.jobTitle ?? prev.jobTitle,
                companyName: result.companyName ?? prev.companyName,
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
            <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium">
                    Auto-fill from Job URL
                </label>

                <div className="flex gap-2">
                    <input
                        type="url"
                        placeholder="https://…"
                        value={data.descriptionUrl}
                        onChange={e =>
                            setData(prev => ({...prev, descriptionUrl: e.target.value}))
                        }
                        className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="button"
                        disabled={!data.descriptionUrl || isAutoFilling}
                        onClick={() => handleAutofill(data.descriptionUrl)}
                        className="px-3 py-2 bg-gray-100 border rounded-md hover:bg-gray-200 disabled:opacity-50"
                    >
                        {isAutoFilling ? "Fetching…" : "Auto-fill"}
                    </button>
                </div>
            </div>
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