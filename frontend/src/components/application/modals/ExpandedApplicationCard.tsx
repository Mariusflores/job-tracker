import type {Application} from "../../../types/application.ts";
import Modal from "../../shared/Modal.tsx";
import {ExpandedApplicationForm} from "../forms/ExpandedApplicationForm.tsx";

export function ExpandedApplicationCard({expandedAppId, onClose, application, publishNotes}: {
    expandedAppId: boolean,
    onClose: () => void,
    application: Application,
    publishNotes: (notes: string, id: number) => void
}) {
    return <Modal isOpen={expandedAppId} onClose={onClose}
                  form={<ExpandedApplicationForm application={application} onClose={onClose}
                                                 publishNotes={publishNotes}/>}
                  style="h-screen overflow-y-auto w-full max-w-md ml-auto shadow-xl bg-white animate-slide-in"
    />;
}