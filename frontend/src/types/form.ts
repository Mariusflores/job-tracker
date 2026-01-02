import type {ApplicationData} from "./application.ts";

export interface FormProps {
    id?: number,
    data: ApplicationData,
    setData: (d: ApplicationData) => void,

    onClose: () => void,
    onSubmit: (data: ApplicationData) => void
}