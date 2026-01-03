import type {ToolBarProps} from "../../../types/toolbar.ts";
import {SORT_LABELS, SORTERS} from "../../../constants/sorting.ts";
import {IconButton} from "../../shared/IconButton.tsx";
import {BarsArrowDownIcon, BarsArrowUpIcon, FunnelIcon} from "@heroicons/react/20/solid";
import {useRef} from "react";
import {useOutsideClick} from "../../../hooks/useOutsideClick.ts";
import {useEscapeKey} from "../../../hooks/useEscapeKey.ts";
import {STATUS_UI, STATUSES} from "../../../constants/status.ts";

export function ToolBar({
                            sortKey,
                            sortDirection,
                            setSortDirection,
                            searchQuery,
                            setSearchQuery,
                            isFilterMenuOpen,
                            statusFilter,
                            setStatusFilter,
                            isSortMenuOpen,
                            setSortKey,
                            onToggleSortMenu,
                            onToggleFilterMenu, onCloseFilterMenu, onCloseSortMenu
                        }: ToolBarProps) {
    const sortKeyLabel = SORT_LABELS[sortKey] ?? "Unknown"
    const sortRef = useRef<HTMLDivElement | null>(null);
    const filterRef = useRef<HTMLDivElement | null>(null);

    // User Event Hooks
    useOutsideClick(sortRef, isSortMenuOpen, () => onCloseSortMenu());
    useOutsideClick(filterRef, isFilterMenuOpen, () => onCloseFilterMenu());
    useEscapeKey(() => {
        onCloseSortMenu();
        onCloseFilterMenu();
    });

    return <div className={"flex flex-row justify-between"}>
        <div className={"flex items-center gap-2"}>
            <p className="text-gray-500">
                Sort by: <span
                className="font-medium">{sortKeyLabel}</span>
            </p>
            <select
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value as "asc" | "desc")}
                className="border rounded-md px-2 py-1 text-gray-700 ml-auto"
            >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
        <div className={"flex items-center gap-2"}>
            <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border text-black rounded-md px-3 py-1 w-full"
            />


            <div ref={filterRef} className={"relative"}>
                <IconButton
                    onClick={() => onToggleFilterMenu()}
                    icon={<FunnelIcon className={"w-5 h-5"}/>
                    }
                />

                {isFilterMenuOpen && (
                    <div
                        className="absolute right-0 mt-2 bg-white border shadow-lg rounded-md text-sm z-50 w-48 p-3"
                    >
                        <p className="text-gray-700 mb-1 font-medium">Filter by Status</p>

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                onCloseFilterMenu();
                            }}
                            className="border rounded-md px-2 py-1 text-gray-700 w-full"
                        >
                            <option value="">All</option>
                            {STATUSES.map(status => (
                                <option key={status} value={status}>
                                    {STATUS_UI[status].label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}


            </div>
            <div ref={sortRef} className={"relative"}>
                <IconButton
                    onClick={onToggleSortMenu}
                    icon={
                        sortDirection == "asc"
                            ? <BarsArrowUpIcon className={"w-5 h-5"}/>
                            : <BarsArrowDownIcon className={"w-5 h-5"}/>
                    }/>

                {isSortMenuOpen && (
                    <div
                        className="absolute right-0 mt-2 bg-white border shadow-lg rounded-md text-sm z-50 w-40">
                        {Object.keys(SORTERS).map(key => (
                            <button
                                key={key}
                                className={`block w-full text-black text-left px-4 py-2 
                                        hover:bg-gray-100
                                        ${sortKey === key ? "bg-gray-100 font-semibold" : ""}
                                        `}
                                onClick={() => {
                                    setSortKey(key);
                                    onCloseSortMenu();
                                }}
                            >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </button>
                        ))}
                    </div>
                )}
            </div>


        </div>
    </div>
}