package org.example.jobapplicationtracker.enrichment.model;

public record EnrichedJobData(
        String jobTitle,
        String companyName,
        EnrichmentSource source
) {
}
