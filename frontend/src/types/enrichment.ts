export interface Enrichment {
    jobTitle: string;
    companyName: string;
    source: EnrichmentSource;
}

export type EnrichmentSource =
    | "FINN"
    | "NAV"
    | "UNKNOWN";