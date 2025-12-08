import type {ApplicationRequest} from "../../types/application.ts";
import {ApplicationForm} from "./ApplicationForm.tsx";
import Modal from "../ui/Modal.tsx";

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
                <ApplicationForm onClose={onClose} onSubmit={onSubmit}/>
            }/>


    )


}