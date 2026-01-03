import type {Application} from "../../../types/application.ts";
import Modal from "../../shared/Modal.tsx";
import {ExpandedApplicationForm} from "../forms/ExpandedApplicationForm.tsx";

export function ExpandedApplicationCard({expanded, onClose, application, publishNotes}: {
    expanded: boolean,
    onClose: () => void,
    application: Application,
    publishNotes: (notes: string, id: number) => void
}) {
    return <Modal isOpen={expanded} onClose={onClose}
                  form={<ExpandedApplicationForm application={application} onClose={onClose}
                                                 publishNotes={publishNotes}/>}
                  style="h-screen overflow-y-auto w-full max-w-md ml-auto shadow-xl bg-white animate-slide-in"
    />;
}