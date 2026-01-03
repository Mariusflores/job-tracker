import type {Application, ApplicationData, UpdateApplicationRequest} from "../../../types/application.ts";
import {useState} from "react";
import {ApplicationForm} from "./ApplicationForm.tsx";

export function EditApplicationForm({onClose, onSubmit, application}: {
    onClose: () => void,
    onSubmit: (request: UpdateApplicationRequest, id: number,) => Promise<void>,
    application: Application
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [data, setData] = useState<ApplicationData>({
        jobTitle: application.jobTitle,
        companyName: application.companyName,
        descriptionUrl: application.descriptionUrl,
        status: application.status,
        appliedDate: application.appliedDate,
        notes: application.notes
    })

    async function handleUpdate(data: ApplicationData) {
        setIsSubmitting(true);
        try {
            const request: UpdateApplicationRequest = {
                jobTitle: data.jobTitle.trim(),
                companyName: data.companyName.trim(),
                descriptionUrl: data.descriptionUrl,
                status: data.status,
                appliedDate: data.appliedDate,
            };

            await onSubmit(request, application.id);

            onClose();
        } finally {
            setIsSubmitting(false)
        }

    }


    return (
        <ApplicationForm
            data={data}
            setData={setData}
            onClose={onClose}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
        />
    );
}