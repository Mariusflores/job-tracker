import {useState} from "react";
import type {ApplicationData, CreateApplicationRequest} from "../../../types/application.ts";
import {ApplicationForm} from "./ApplicationForm.tsx";

export function AddApplicationForm({onClose, onSubmit}: {
    onClose: () => void,
    onSubmit: (request: CreateApplicationRequest) => void
}) {
    const today = new Date().toISOString().split("T")[0];

    const [data, setData] = useState<ApplicationData>({
        jobTitle: "",
        companyName: "",
        descriptionUrl: "",
        status: "APPLIED",
        appliedDate: today,
        notes: ""
    })

    function handleCreate(data: ApplicationData) {
        const request: CreateApplicationRequest = {
            ...data,
            jobTitle: data.jobTitle.trim(),
            companyName: data.companyName.trim(),
        };
        onSubmit(request);
    }


    return (
        <ApplicationForm
            data={data}
            setData={setData}
            onClose={onClose}
            onSubmit={handleCreate}/>
    );
}