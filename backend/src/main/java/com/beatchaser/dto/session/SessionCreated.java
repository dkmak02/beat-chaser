package com.beatchaser.dto.session;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionCreated {
    UUID id;
    int totalRounds;
    Instant createdAt;
}
