package org.example.jobapplicationtracker.application.dto.pagination;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.jobapplicationtracker.application.dto.response.ApplicationResponse;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationPageResponse {

    private List<ApplicationResponse> content;
    private String nextCursor;
    private boolean hasMore;
}
