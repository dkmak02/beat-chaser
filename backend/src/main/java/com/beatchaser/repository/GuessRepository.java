package com.beatchaser.repository;

import com.beatchaser.model.Game;
import com.beatchaser.model.Guess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface GuessRepository extends JpaRepository<Guess, UUID> {
}
