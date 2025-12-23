import {useEffect} from "react";

export function useEscapeKey(
    onEscape: () => void) {
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onEscape();
            }
        }

        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onEscape])
}