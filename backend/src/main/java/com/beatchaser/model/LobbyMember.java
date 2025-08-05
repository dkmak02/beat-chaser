package com.beatchaser.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "lobby_members")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LobbyMember {

    @EmbeddedId
    private LobbyMemberId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("lobbyId")
    @JoinColumn(name = "lobby_id")
    private Lobby lobby;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;

    @Column(name = "is_ready", nullable = false)
    private Boolean isReady = false;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
    }

    @Embeddable
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LobbyMemberId {
        private UUID lobbyId;
        private UUID userId;
    }
} 