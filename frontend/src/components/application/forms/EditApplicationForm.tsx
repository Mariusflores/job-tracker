import type {Application, ApplicationData, ApplicationRequest} from "../../../types/application.ts";
import {useState} from "react";
import {ApplicationForm} from "./ApplicationForm.tsx";

export function EditApplicationForm({onClose, onSubmit, application}: {
    onClose: () => void,
    onSubmit: (request: ApplicationRequest, id?: number,) => void,
    application: Application
}) {
    const [data, setData] = useState<ApplicationData>({
        jobTitle: application.jobTitle,
        companyName: application.companyName,
        descriptionUrl: application.descriptionUrl,
        status: application.status,
        appliedDate: application.appliedDate
    })


    return (
        <ApplicationForm id={application.id}
                         data={data}
                         setData={setData}
                         onClose={onClose}
                         onSubmit={onSubmit}
        />
    );
}