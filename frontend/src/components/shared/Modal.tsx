import {useEffect} from "react";
import {useEscapeKey} from "../../hooks/useEscapeKey.ts";

let openModalCount = 0;
export default function Modal({isOpen, onClose, form, style}: {
    isOpen: boolean,
    onClose: () => void,
    form: React.ReactNode,
    style: string

}) {


    useEscapeKey(() => {
        if (isOpen) {
            onClose();
        }
    });

    // Prevent Body Scroll
    useEffect(() => {
        if (isOpen) {
            openModalCount++;

            // If this is the FIRST modal opened → lock scroll
            if (openModalCount === 1) {
                document.body.style.overflow = "hidden";
            }
        }

        return () => {
            if (isOpen) {
                openModalCount--;

                // If this was the LAST modal → restore scroll
                if (openModalCount === 0) {
                    document.body.style.overflow = "";
                }
            }
        };
    }, [isOpen]);


    if (!isOpen) return null;

    return (
        <div className={"z-50"}>
            <div onClick={onClose} className={"overlay fixed inset-0 bg-black opacity-70 z-40"}>
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

}