package com.beatchaser.repository;

import com.beatchaser.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {

//    @Query(value = "SELECT * FROM songs ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
//    Song findRandomSong();

    @Query(value = "SELECT * FROM songs ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Song> findRandomSongs(@Param("limit") int limit);

    @Query(value = "SELECT * FROM songs WHERE id = (" +
            "SELECT song_id FROM game_rounds " +
            "WHERE round_number = :round AND game_session_id = :gameSessionId)",
            nativeQuery = true)
    Optional<Song> findSongBySessionAndRound(@Param("round") int round,
                                             @Param("gameSessionId") long gameSessionId);


}