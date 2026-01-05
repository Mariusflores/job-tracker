package org.example.jobapplicationtracker.enrichment.client;

import lombok.extern.slf4j.Slf4j;
import org.example.jobapplicationtracker.enrichment.model.EnrichedJobData;
import org.example.jobapplicationtracker.enrichment.model.EnrichmentSource;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NavClient {

    private final static EnrichmentSource SOURCE = EnrichmentSource.NAV;

    public EnrichedJobData enrich(String url) {

        try {
            log.debug("Fetching Nav job page from url={}", url);
            Document document = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                            "AppleWebKit/537.36 (KHTML, like Gecko) " +
                            "Chrome/120.0.0.0 Safari/537.36"
                    )
                    .timeout(5000)
                    .get();

            Element titleElement = document.selectFirst(
                    "dd.navds-body-long.navds-body-long--medium"
            );

            if (titleElement == null) {
                log.debug("Nav: primary title selector failed, using fallback");
                titleElement = document.selectFirst("main dd");
            }

            String title = titleElement != null ? titleElement.text() : null;


            Element companyElement =
                    document.selectFirst(
                            "p.navds-body-long.navds-body-long--medium.navds-typo--semibold"
                    );

            if (companyElement == null) {
                // fallback: first bold-ish paragraph near header
                log.debug("Nav: primary company selector failed, using fallback");

                companyElement = document.selectFirst("main p");
            }

            String company = companyElement != null ? companyElement.text() : null;


            log.debug(
                    "Nav enrichment result: company='{}', title='{}'",
                    company,
                    title
            );


            return new EnrichedJobData(title, company, SOURCE);
        } catch (Exception e) {
            log.error("Finn enrichment failed for url={}", url, e);
            return new EnrichedJobData(null, null, SOURCE);
        }
    }
}
