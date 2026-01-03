import type {Application, ApplicationStatus} from "../../types/application.ts";
import {SORTERS} from "../../constants/sorting.ts";

export function countByStatus(backendApps: Application[], status: ApplicationStatus) {
    return backendApps.filter(a => a.status == status).length;
}

export function sortAppsBy(apps: Application[], sortType: string, direction: "asc" | "desc") {
    const sorter = SORTERS[sortType as keyof typeof SORTERS];
    if (!sorter) return apps;
    const sorted = [...apps].sort(sorter);
    return direction === "asc" ? sorted : sorted.reverse();
}

export function filterApps(apps: Application[], filterStatus: string, searchQuery: string) {
    let result = apps;

    if (filterStatus) {
        result = result.filter(a => a.status === filterStatus);
    }

    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(a =>
            a.companyName.toLowerCase().includes(query) ||
            a.jobTitle.toLowerCase().includes(query)
        );
    }
    return result;
}