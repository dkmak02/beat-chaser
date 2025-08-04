package com.beatchaser.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "songs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    private String genre;

    @Column(name = "audio_url", nullable = false)
    private String audioUrl;
}