import React from "react";

export interface ToolBarProps {
    sortKey: string;
    sortDirection: "asc" | "desc";
    setSortDirection: React.Dispatch<React.SetStateAction<"asc" | "desc">>;

    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

    isFilterMenuOpen: boolean;

    statusFilter: string;
    setStatusFilter: React.Dispatch<React.SetStateAction<string>>;

    isSortMenuOpen: boolean;

    setSortKey: React.Dispatch<React.SetStateAction<string>>;

    toggleSortMenu: () => void;
    toggleFilterMenu: () => void;
    closeSortMenu: () => void;
    closeFilterMenu: () => void;
}
