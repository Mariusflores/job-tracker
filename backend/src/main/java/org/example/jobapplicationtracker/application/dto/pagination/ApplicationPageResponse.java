package org.example.jobapplicationtracker.application.dto.pagination;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.jobapplicationtracker.application.model.Application;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationPageResponse {

    private List<Application> content;
    private String nextCursor;
    private boolean hasMore;
}
