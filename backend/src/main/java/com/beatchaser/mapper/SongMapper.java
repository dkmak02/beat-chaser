package com.beatchaser.mapper;

import com.beatchaser.dto.SongDTO;
import com.beatchaser.model.Song;
import org.springframework.stereotype.Component;


@Component
public class SongMapper {

    public static SongDTO toDto(Song song) {
        return SongDTO.builder()
                .id(song.getId())
                .title(song.getTitle())
                .artist(song.getArtist())
                .genre(song.getGenre())
                .audioUrl(song.getAudioUrl())
                .build();
    }

    public static Song toEntity(SongDTO dto) {
        return Song.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .artist(dto.getArtist())
                .genre(dto.getGenre())
                .audioUrl(dto.getAudioUrl())
                .build();
    }
}