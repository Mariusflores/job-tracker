import {useEffect} from "react";

export default function Modal({isOpen, onClose, form, style}: {
    isOpen: boolean,
    onClose: () => void,
    form: React.ReactNode,
    style: string

}) {

    // Prevent Body Scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isOpen]);


    if (isOpen) {
        console.log("rendering modal")
        return (
            <div className={"z-50"}>
                <div onClick={onClose} className={"overlay fixed inset-0 bg-black opacity-5 z-40"}>
                </div>
                <div
                    className="modal-container fixed inset-0 flex justify-center items-center pointer-events-none z-50">
                    <div
                        className={`modal-box pointer-events-auto ${style}`}>
                        {form}
                    </div>
                </div>
            </div>

        );

    } else {
        return null;
    }
}