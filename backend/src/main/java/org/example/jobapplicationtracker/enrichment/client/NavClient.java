package org.example.jobapplicationtracker.enrichment.client;

import lombok.extern.slf4j.Slf4j;
import org.example.jobapplicationtracker.enrichment.model.EnrichedJobData;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NavClient {
    public EnrichedJobData enrich(String url) {

        try {
            log.info("Fetching data from " + url);
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

            String title = titleElement != null ? titleElement.text() : null;


            Element companyElement =
                    document.selectFirst(
                            "p.navds-body-long.navds-body-long--medium.navds-typo--semibold"
                    );

            String company = companyElement != null ? companyElement.text() : null;


            log.info("Fetched data: Company: " + company + " Title: " + title);


            return new EnrichedJobData(title, company);
        } catch (Exception e) {
            log.error(e.getMessage());
            return new EnrichedJobData(null, null);
        }
    }
}
