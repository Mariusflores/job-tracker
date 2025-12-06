import {ApplicationForm} from "./ApplicationForm.tsx";

export function AddApplicationModal(props: { isOpen: boolean, onClose: () => void, onSubmit: () => void }) {

    if (props.isOpen) {
        console.log("rendering modal")
        return (
            <div>
                <div onClick={props.onClose} className={"overlay fixed inset-0 bg-black opacity-5"}>'
                </div>
                <div className="modal-container fixed inset-0 flex justify-center items-center pointer-events-none">
                    <div
                        className="modal-box max-h-[80vh] overflow-y-auto w-screen
                        max-w-md rounded-lg text-black bg-white pointer-events-auto">
                        <ApplicationForm onClose={props.onClose} onSubmit={props.onSubmit}/>

                    </div>
                </div>
            </div>

        );

    } else {
        return null;
    }
}