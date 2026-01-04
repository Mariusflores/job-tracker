package org.example.jobapplicationtracker.enrichment.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.jobapplicationtracker.enrichment.client.FinnClient;
import org.example.jobapplicationtracker.enrichment.client.NavClient;
import org.example.jobapplicationtracker.enrichment.model.EnrichedJobData;
import org.example.jobapplicationtracker.enrichment.model.EnrichmentSource;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EnrichmentService {
    private final FinnClient finnClient;
    private final NavClient navClient;

    public EnrichedJobData enrich(String url) {
        log.info("Checking if url contains finn.no");

        if (url.contains("finn.no")) {
            log.info("url contains finn.no, fetching data...");
            return finnClient.enrich(url);
        } else if (url.contains("arbeidsplassen.nav.no")) {
            return navClient.enrich(url);
        }
        return new EnrichedJobData(null, null, EnrichmentSource.UNKNOWN);
    }
}
