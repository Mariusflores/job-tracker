import {useEffect} from "react";

export function useOutsideClick(
    ref: React.RefObject<HTMLElement | null>,
    isActive: boolean,
    onOutsideClick: () => void
) {
    useEffect(() => {
        if (!isActive) return;

        function handleMouseDown(e: MouseEvent) {
            if (!ref.current?.contains(e.target as Node)) {
                onOutsideClick();
            }
        }

        document.addEventListener("mousedown", handleMouseDown);
        return () => document.removeEventListener("mousedown", handleMouseDown);
    }, [isActive, onOutsideClick, ref]);
}
