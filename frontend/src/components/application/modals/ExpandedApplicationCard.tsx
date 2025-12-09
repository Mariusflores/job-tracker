import type {Application} from "../../../types/application.ts";
import Modal from "../../ui/Modal.tsx";
import {ExpandedApplicationForm} from "../forms/ExpandedApplicationForm.tsx";

export function ExpandedApplicationCard({expanded, onClose, application}: {
    expanded: boolean, onClose: () => void, application: Application
}) {
    return <Modal isOpen={expanded} onClose={onClose} form={<ExpandedApplicationForm application={application}/>}
                  style="h-screen overflow-y-auto w-screen z-50
                max-w-md rounded-lg text-black bg-white"/>;
}