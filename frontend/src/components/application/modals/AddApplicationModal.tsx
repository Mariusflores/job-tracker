import type {ApplicationRequest} from "../../../types/application.ts";
import {AddApplicationForm} from "../forms/AddApplicationForm.tsx";
import Modal from "../../ui/Modal.tsx";

export function AddApplicationModal({isOpen, onClose, onSubmit}: {
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (request: ApplicationRequest) => void
}) {


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            form={
                <AddApplicationForm onClose={onClose} onSubmit={onSubmit}/>
            }/>


    )


}