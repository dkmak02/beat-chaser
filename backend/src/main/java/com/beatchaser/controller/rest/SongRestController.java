package com.beatchaser.controller.rest;

import com.beatchaser.dto.SongDTO;
import com.beatchaser.dto.session.SessionCreated;
import com.beatchaser.service.SongService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/song")
@Slf4j
public class SongRestController {
    private final SongService songService;

    @GetMapping()
    public ResponseEntity<List<SongDTO>> getAllSongs() {
        return ResponseEntity.ok(songService.getAllSongs());
    }
}
