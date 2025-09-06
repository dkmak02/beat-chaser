package com.beatchaser.mapper;

import com.beatchaser.dto.SongDTO;
import com.beatchaser.model.Song;

public class SongMapper {
    public static SongDTO toSongDTO(Song song) {
        return SongDTO.builder()
                .id(song.getId())
                .title(song.getTitle())
                .artist(song.getArtist())
                .album(song.getAlbum())
                .durationSeconds(song.getDurationSeconds())
                .audioPreviewUrl(song.getAudioPreviewUrl())
                .build();
    }
}
