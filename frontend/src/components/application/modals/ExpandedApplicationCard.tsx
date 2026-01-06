import type {Application, StatusChange} from "../../../types/application.ts";
import Modal from "../../shared/Modal.tsx";
import {ExpandedApplicationForm} from "../forms/ExpandedApplicationForm.tsx";

export function ExpandedApplicationCard({expanded, onClose, application, updateNotes, getStatusHistory}: {
    expanded: boolean,
    onClose: () => void,
    application: Application,
    updateNotes: (notes: string, id: number) => Promise<void>,
    getStatusHistory: (applicationId: number) => Promise<StatusChange[]>
}) {
    return <Modal isOpen={expanded} onClose={onClose}
                  form={<ExpandedApplicationForm application={application} onClose={onClose}
                                                 updateNotes={updateNotes}
                                                 getStatusHistory={getStatusHistory}/>}
                  style="h-screen overflow-y-auto w-full max-w-md ml-auto shadow-xl bg-white animate-slide-in"
    />;
}