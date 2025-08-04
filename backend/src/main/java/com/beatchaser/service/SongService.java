package com.beatchaser.service;

import com.beatchaser.dto.SongDTO;
import com.beatchaser.mapper.SongMapper;
import com.beatchaser.model.Song;
import com.beatchaser.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;

    public Song getRandomSong() {
        List<Song> songs = songRepository.findAll();
        if (songs.isEmpty()) {
            throw new IllegalStateException("No songs found");
        }
        return songs.get(new Random().nextInt(songs.size()));
    }
    public List<SongDTO> getAllSongs() {
        return songRepository.findAll()
                .stream()
                .map(SongMapper::toDto)
                .toList();
    }
}