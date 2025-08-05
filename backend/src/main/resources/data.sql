-- Insert sample songs for testing
INSERT INTO songs (id, title, artist, album, duration_seconds, external_id, audio_preview_url, created_at, metadata) VALUES
(gen_random_uuid(), 'Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 354, 'queen_bohemian_rhapsody', 'C:\Users\dkmak\Desktop\beat-chaser\music\queen.mp3', NOW(), '{"genre": "Rock", "year": 1975}'),
(gen_random_uuid(), 'Hotel California', 'Eagles', 'Hotel California', 391, 'eagles_hotel_california', 'C:\Users\dkmak\Desktop\beat-chaser\music\hotel_california.mp3', NOW(), '{"genre": "Rock", "year": 1976}'),
(gen_random_uuid(), 'Billie Jean', 'Michael Jackson', 'Thriller', 294, 'michael_jackson_billie_jean', 'C:\Users\dkmak\Desktop\beat-chaser\music\jack.mp3', NOW(), '{"genre": "Pop", "year": 1982}'),
(gen_random_uuid(), 'Sweet Child O Mine', 'Guns N Roses', 'Appetite for Destruction', 356, 'guns_n_roses_sweet_child', 'C:\Users\dkmak\Desktop\beat-chaser\music\seet.mp3', NOW(), '{"genre": "Rock", "year": 1987}'),
(gen_random_uuid(), 'Takiego Janicka', 'TerazMy', 'Folk Album', 240, 'terazmy_takiego_janicka', 'C:\Users\dkmak\Desktop\beat-chaser\music\janicka.mp3', NOW(), '{"genre": "Folk", "year": 2020}');
