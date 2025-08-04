package com.beatchaser.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebSocketMessage<T> {
    private String type;
    private T payload;

    @Builder.Default
    @JsonFormat(shape = JsonFormat.Shape.STRING) // ISO-8601
    private Instant timestamp = Instant.now();
}