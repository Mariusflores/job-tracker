package org.example.jobapplicationtracker.enrichment.service;

import io.micrometer.core.instrument.MeterRegistry;
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

    private final MeterRegistry meterRegistry;


    public EnrichedJobData enrich(String url) {
        meterRegistry.counter("enrichment.requests").increment();

        if (url.contains("finn.no")) {
            EnrichedJobData result = finnClient.enrich(url);
            recordResult(result);
            return result;
        } else if (url.contains("arbeidsplassen.nav.no")) {
            EnrichedJobData result = navClient.enrich(url);
            recordResult(result);
            return result;
        }
        meterRegistry.counter("enrichment.failure", "source", "UNKNOWN").increment();
        return new EnrichedJobData(null, null, EnrichmentSource.UNKNOWN);
    }

    private void recordResult(EnrichedJobData result) {
        if (result.jobTitle() != null || result.companyName() != null) {
            meterRegistry.counter(
                            "enrichment.success",
                            "source",
                            result.source().name())
                    .increment();
        } else {
            meterRegistry.counter(
                            "enrichment.failure",
                            "source",
                            result.source().name())
                    .increment();
        }
    }
}
