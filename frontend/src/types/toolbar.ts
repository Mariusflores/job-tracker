import React from "react";

export interface ToolBarProps {
    sortType: string;
    sortDirection: "asc" | "desc";
    setSortDirection: React.Dispatch<React.SetStateAction<"asc" | "desc">>;

    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

    isFilterOpen: boolean;
    setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;

    filterStatus: string;
    setFilterStatus: React.Dispatch<React.SetStateAction<string>>;

    isSortOpen: boolean;
    setIsSortOpen: React.Dispatch<React.SetStateAction<boolean>>;

    setSortType: React.Dispatch<React.SetStateAction<string>>;

    onToggleOpen: () => void;
}
