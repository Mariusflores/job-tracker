import type {Application} from "../../../types/application.ts";
import Modal from "../../shared/Modal.tsx";
import {ExpandedApplicationForm} from "../forms/ExpandedApplicationForm.tsx";

export function ExpandedApplicationCard({expanded, onClose, application, updateNotes}: {
    expanded: boolean,
    onClose: () => void,
    application: Application,
    updateNotes: (notes: string, id: number) => Promise<void>
}) {
    return <Modal isOpen={expanded} onClose={onClose}
                  form={<ExpandedApplicationForm application={application} onClose={onClose}
                                                 updateNotes={updateNotes}/>}
                  style="h-screen overflow-y-auto w-full max-w-md ml-auto shadow-xl bg-white animate-slide-in"
    />;
}