//package com.beatchaser.mapper;
//
//import com.beatchaser.dto.SongDTO;
//import org.springframework.stereotype.Component;
//
//@Component
//public class GuessMapper {
//
//    public static GuessResponseDTO toResponseDTO(boolean correct, int points, boolean gameOver, SongDTO nextSong) {
//        return GuessResponseDTO.builder()
//                .correct(correct)
//                .pointsAwarded(points)
//                .gameOver(gameOver)
//                .build();
//    }
//}