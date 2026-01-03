import type {CreateApplicationRequest} from "../../../types/application.ts";
import {AddApplicationForm} from "../forms/AddApplicationForm.tsx";
import Modal from "../../shared/Modal.tsx";

export function AddApplicationModal({isOpen, onClose, onSubmit}: {
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (request: CreateApplicationRequest) => Promise<void>
}) {


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            form={
                <AddApplicationForm onClose={onClose} onSubmit={onSubmit}/>
            }
            style=" max-h-[80vh] overflow-y-auto w-screen z-50
                max-w-md rounded-lg text-black bg-white"

        />


    )


}