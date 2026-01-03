import type {CreateApplicationRequest} from "../../../types/application.ts";
import {AddApplicationForm} from "../forms/AddApplicationForm.tsx";
import Modal from "../../shared/Modal.tsx";
import type {Enrichment} from "../../../types/enrichment.ts";

export function AddApplicationModal({isOpen, onClose, onSubmit, onAutofill}: {
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (request: CreateApplicationRequest) => Promise<void>,
    onAutofill: (url: string) => Promise<Enrichment>
}) {


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            form={
                <AddApplicationForm onClose={onClose}
                                    onSubmit={onSubmit}
                                    onAutofill={onAutofill}/>
            }
            style=" max-h-[80vh] overflow-y-auto w-screen z-50
                max-w-md rounded-lg text-black bg-white"

        />


    )


}