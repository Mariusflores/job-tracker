import type {Application, ApplicationRequest} from "../../types/application.ts";
import Modal from "../ui/Modal.tsx";
import {EditApplicationForm} from "./EditApplicationForm.tsx";

export function EditApplicationModal(props: {
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (id: number, request: ApplicationRequest) => void,
    application: Application
}) {

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}
               form={
                   <EditApplicationForm onClose={props.onClose} onSubmit={props.onSubmit}
                                        application={props.application}/>
               }/>
    )
}