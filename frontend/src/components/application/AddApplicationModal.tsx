import type {ApplicationRequest} from "../../types/application.ts";
import {ApplicationForm} from "./ApplicationForm.tsx";
import Modal from "../ui/Modal.tsx";

export function AddApplicationModal(props: {
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (request: ApplicationRequest) => void
}) {


    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
            form={
                <ApplicationForm onClose={props.onClose} onSubmit={props.onSubmit}/>
            }/>


    )


}