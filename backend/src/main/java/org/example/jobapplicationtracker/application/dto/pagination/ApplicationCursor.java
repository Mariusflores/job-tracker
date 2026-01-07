package org.example.jobapplicationtracker.application.dto.pagination;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.jobapplicationtracker.application.error.InvalidCursorException;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Base64;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationCursor {
    private LocalDate appliedDate;
    private Long applicationId;

    public static String Encode(ApplicationCursor cursor) {
        if (cursor == null) {
            throw new InvalidCursorException("Cursor is null");
        }

        String raw =
                cursor.appliedDate.toString()
                        + "|"
                        + cursor.applicationId.toString();

        return Base64.getEncoder().encodeToString(raw.getBytes(StandardCharsets.UTF_8));

    }

    public static ApplicationCursor Decode(String encoded) {
        if (encoded == null) {
            throw new InvalidCursorException("Encoded Cursor is null");
        }

        byte[] decoded =
                Base64.getDecoder().decode(encoded);
        String raw =
                new String(decoded, StandardCharsets.UTF_8);

        String[] parts = raw.split("\\|");

        if (parts.length != 2) {
            throw new InvalidCursorException("Invalid cursor format");
        }

        return new ApplicationCursor(
                LocalDate.parse(parts[0]),
                Long.valueOf(parts[1])
        );
    }
}
