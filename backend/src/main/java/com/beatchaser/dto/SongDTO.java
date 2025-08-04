package com.beatchaser.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SongDTO {
    private Long id;
    private String title;
    private String artist;
    private String genre;
    private String audioUrl;
}