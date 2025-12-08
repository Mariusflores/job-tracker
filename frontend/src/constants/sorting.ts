import type {Application} from "../types/application.ts";

export const SORTERS: Record<
    keyof typeof SORT_LABELS,
    (a: Application, b: Application) => number
> = {
    status: (a, b) => a.status.localeCompare(b.status),
    date: (a, b) => a.appliedDate.localeCompare(b.appliedDate),
    company: (a, b) => a.companyName.localeCompare(b.companyName),
    title: (a, b) => a.jobTitle.localeCompare(b.jobTitle),
};

export const SORT_LABELS: Record<string, string> = {
    date: "Applied Date",
    status: "Status",
    company: "Company",
    title: "Job Title",
};