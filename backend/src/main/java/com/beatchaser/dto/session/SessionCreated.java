package com.beatchaser.dto.session;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionCreated {
    Long id;
    int totalRounds;
    Instant createdAt;
}
