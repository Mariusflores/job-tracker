import type {Enrichment} from "../../../types/enrichment.ts";
import {SOURCE_UI} from "../../../constants/enrichmentSource.ts";

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
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                        Auto-fill from URL
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