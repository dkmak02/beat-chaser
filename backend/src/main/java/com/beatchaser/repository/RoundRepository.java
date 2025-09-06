package com.beatchaser.repository;

import com.beatchaser.model.Round;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface RoundRepository extends JpaRepository<Round, UUID> {
}
