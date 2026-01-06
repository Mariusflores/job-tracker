import {useState} from "react";
import type {ApplicationData, CreateApplicationRequest} from "../../../types/application.ts";
import {ApplicationForm} from "./ApplicationForm.tsx";
import type {Enrichment} from "../../../types/enrichment.ts";
import {AutofillFromUrl} from "../actions/AutofillFromUrl.tsx";

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
            <AutofillFromUrl
                disabled={!data.descriptionUrl}
                isLoading={isAutoFilling}
                enrichment={enrichment}
                onClick={() => handleAutofill(data.descriptionUrl)}
            />


            <ApplicationForm
                data={data}
                setData={setData}
                onClose={onClose}
                onSubmit={handleCreate}
                isSubmitting={isSubmitting} title={"Add Application"}
            />
        </>
    );
}