import {useState} from "react";
import type {ApplicationData, CreateApplicationRequest} from "../../../types/application.ts";
import {ApplicationForm} from "./ApplicationForm.tsx";

export function AddApplicationForm({onClose, onSubmit}: {
    onClose: () => void,
    onSubmit: (request: CreateApplicationRequest) => Promise<void>,
}) {
    const today = new Date().toISOString().split("T")[0];
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [data, setData] = useState<ApplicationData>({
        jobTitle: "",
        companyName: "",
        descriptionUrl: "",
        status: "APPLIED",
        appliedDate: today,
        notes: ""
    })

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
        <ApplicationForm
            data={data}
            setData={setData}
            onClose={onClose}
            onSubmit={handleCreate}
            isSubmitting={isSubmitting}
        />

    );
}