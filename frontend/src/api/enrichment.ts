import {api} from "./client.ts";
import type {Enrichment} from "../types/enrichment.ts";


export async function fetchJobPostingEnrichmentApi(url: string) {
    const response = await api.post<Enrichment>("/enrichment", {url});
    return response.data;
}