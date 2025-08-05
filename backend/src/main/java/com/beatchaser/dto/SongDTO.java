package com.beatchaser.dto;

import lombok.*;

import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SongDTO {
    private UUID id;
    private String title;
    private String artist;
    private String album;
    private Integer durationSeconds;
    private String audioPreviewUrl;
}