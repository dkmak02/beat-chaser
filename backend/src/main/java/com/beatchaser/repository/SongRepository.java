package com.beatchaser.repository;

import com.beatchaser.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SongRepository extends JpaRepository<Song, UUID>{
    @Query(value = "SELECT * FROM songs ORDER BY RANDOM() LIMIT :numberOfSongs", nativeQuery = true)
    Optional<List<Song>> getRandomSongs(@Param("numberOfSongs") int numberOfSongs);
}
