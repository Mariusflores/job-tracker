import type {ApplicationData, ApplicationRequest} from "./application.ts";

export interface FormProps {
    id?: number,
    data: ApplicationData,
    setData: (d: ApplicationData) => void,

    onClose: () => void,
    onSubmit: (request: ApplicationRequest, id?: number) => void
}