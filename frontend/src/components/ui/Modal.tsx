export default function Modal({isOpen, onClose, form}: {
    isOpen: boolean,
    onClose: () => void,
    form: React.ReactNode

}) {
    if (isOpen) {
        console.log("rendering modal")
        return (
            <div className={"z-50"}>
                <div onClick={onClose} className={"overlay fixed inset-0 bg-black opacity-5 z-40"}>'
                </div>
                <div
                    className="modal-container fixed inset-0 flex justify-center items-center pointer-events-none z-50">
                    <div
                        className="modal-box max-h-[80vh] overflow-y-auto w-screen z-50
                        max-w-md rounded-lg text-black bg-white pointer-events-auto">
                        {form}
                    </div>
                </div>
            </div>

        );

    } else {
        return null;
    }
}