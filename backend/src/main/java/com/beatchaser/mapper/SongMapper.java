package com.beatchaser.mapper;

import com.beatchaser.dto.SongDTO;
import com.beatchaser.model.Song;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class SongMapper {

    public static SongDTO toDto(Song song) {
        return SongDTO.builder()
                .id(song.getId())
                .title(song.getTitle())
                .artist(song.getArtist())
                .album(song.getAlbum())
                .durationSeconds(song.getDurationSeconds())
                .audioPreviewUrl(song.getAudioPreviewUrl())
                .build();
    }

    public static Song toEntity(SongDTO dto) {
        return Song.builder()
                .id(dto.getId() != null ? dto.getId() : UUID.randomUUID())
                .title(dto.getTitle())
                .artist(dto.getArtist())
                .album(dto.getAlbum())
                .durationSeconds(dto.getDurationSeconds())
                .audioPreviewUrl(dto.getAudioPreviewUrl())
                .build();
    }
}