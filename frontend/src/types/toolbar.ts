import React from "react";

export interface ToolBarProps {
    sortKey: string;
    sortDirection: "asc" | "desc";
    setSortDirection: React.Dispatch<React.SetStateAction<"asc" | "desc">>;

    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

    isFilterMenuOpen: boolean;
    setIsFilterButtonOpen: React.Dispatch<React.SetStateAction<boolean>>;

    statusFilter: string;
    setStatusFilter: React.Dispatch<React.SetStateAction<string>>;

    isSortMenuOpen: boolean;
    setIsSortButtonOpen: React.Dispatch<React.SetStateAction<boolean>>;

    setSortKey: React.Dispatch<React.SetStateAction<string>>;

    onToggleOpen: () => void;
}
