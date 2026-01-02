import type {Application, UpdateApplicationRequest} from "../../../types/application.ts";
import Modal from "../../shared/Modal.tsx";
import {EditApplicationForm} from "../forms/EditApplicationForm.tsx";

export function EditApplicationModal({isOpen, onClose, onSubmit, application}: {
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (request: UpdateApplicationRequest, id: number) => void,
    application: Application
}) {

    return (
        <Modal isOpen={isOpen} onClose={onClose}
               form={
                   <EditApplicationForm onClose={onClose} onSubmit={onSubmit}
                                        application={application}/>
               }
               style="max-h-[80vh] overflow-y-auto w-screen z-50
                        max-w-md rounded-lg text-black bg-white"
        />
    )
}