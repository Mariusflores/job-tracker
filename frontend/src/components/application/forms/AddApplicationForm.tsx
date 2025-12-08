import {useState} from "react";
import type {ApplicationData, ApplicationRequest} from "../../../types/application.ts";
import {ApplicationForm} from "./ApplicationForm.tsx";

export function AddApplicationForm({onClose, onSubmit}: {
    onClose: () => void,
    onSubmit: (request: ApplicationRequest) => void
}) {
    const today = new Date().toISOString().split("T")[0];

    const [data, setData] = useState<ApplicationData>({
        jobTitle: "",
        companyName: "",
        descriptionUrl: "",
        status: "APPLIED",
        appliedDate: today
    })

    return (
        <ApplicationForm
            id={undefined}
            data={data}
            setData={setData}
            onClose={onClose}
            onSubmit={onSubmit}/>
    );
}