import type {Application} from "../../../types/application.ts";
import Modal from "../../ui/Modal.tsx";
import {ExpandedApplicationForm} from "../forms/ExpandedApplicationForm.tsx";

export function ExpandedApplicationCard({expanded, onClose, application}: {
    expanded: boolean, onClose: () => void, application: Application
}) {
    return <Modal isOpen={expanded} onClose={onClose}
                  form={<ExpandedApplicationForm application={application} onClose={onClose}/>}
                  style="h-screen overflow-y-auto w-full max-w-md ml-auto shadow-xl bg-white animate-slide-in"
    />;
}