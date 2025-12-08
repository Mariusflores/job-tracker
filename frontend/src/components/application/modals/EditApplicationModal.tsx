import type {Application, ApplicationRequest} from "../../../types/application.ts";
import Modal from "../../ui/Modal.tsx";
import {EditApplicationForm} from "../forms/EditApplicationForm.tsx";

export function EditApplicationModal({isOpen, onClose, onSubmit, application}: {
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (request: ApplicationRequest, id?: number) => void,
    application: Application
}) {

    return (
        <Modal isOpen={isOpen} onClose={onClose}
               form={
                   <EditApplicationForm onClose={onClose} onSubmit={onSubmit}
                                        application={application}/>
               }/>
    )
}