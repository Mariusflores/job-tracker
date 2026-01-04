package org.example.jobapplicationtracker.enrichment.controller;

import lombok.RequiredArgsConstructor;
import org.example.jobapplicationtracker.enrichment.dto.EnrichmentRequest;
import org.example.jobapplicationtracker.enrichment.model.EnrichedJobData;
import org.example.jobapplicationtracker.enrichment.service.EnrichmentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enrichment")
@RequiredArgsConstructor
public class EnrichmentController {
    private final EnrichmentService enrichmentService;


    @PostMapping
    EnrichedJobData enrich(@RequestBody EnrichmentRequest enrichmentRequest) {
        return enrichmentService.enrich(enrichmentRequest.getUrl());
    }


}
