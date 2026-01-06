import type {Enrichment} from "../../../types/enrichment.ts";
import {SOURCE_UI} from "../../../constants/enrichmentSource.ts";
import {InformationCircleIcon} from "@heroicons/react/16/solid";
import {useEffect, useRef, useState} from "react";

export function InfoPopover({children}: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative inline-flex">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="text-gray-400 hover:text-gray-600"
            >
                <InformationCircleIcon className="h-4 w-4"/>
            </button>

            {open && (
                <div className="
                absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2
                rounded-md border bg-white p-3 text-xs text-gray-600 shadow-lg
                whitespace-normal break-words"
                >
                    {children}
                </div>
            )}
        </div>
    );
}

export function AutofillFromUrl({
                                    disabled,
                                    isLoading,
                                    enrichment,
                                    onClick,
                                }: {
    disabled: boolean;
    isLoading: boolean;
    enrichment: Enrichment | null;
    onClick: () => void;
}) {
    return (
        <>
            <div className="px-4 pt-2">
                <div className="flex items-center justify-center gap-3">
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                        Auto-fill from URL
                         <InfoPopover>
                            <p>
                                Auto-fill works for some job boards, like
                                <span className="font-medium"> Finn.no</span> and
                                <span className="font-medium"> Nav Arbeidsplassen</span>.
                            </p>
                            <p className="mt-1">
                                If it doesn’t work, you can always fill the form manually.
                            </p>
                        </InfoPopover>
                    </span>

                    <button
                        type="button"
                        disabled={disabled}
                        onClick={onClick}
                        className="
                            px-3 py-1.5
                            text-sm
                            bg-gray-100 border rounded-md
                            hover:bg-gray-200
                            disabled:opacity-50
                        "
                    >
                        {isLoading ? "Fetching…" : "Auto-fill"}
                    </button>
                </div>
            </div>

            {enrichment && (
                <div className="mt-1 ml-4 text-xs text-gray-500">
                    Auto-filled from{" "}
                    <span className="font-medium">
                        {SOURCE_UI[enrichment.source]}
                    </span>
                </div>
            )}
        </>
    );
}