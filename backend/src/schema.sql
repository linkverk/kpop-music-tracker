-- backend/database/schema.sql
-- K-pop Music Tracker PostgreSQL Schema

-- Create database
-- CREATE DATABASE kpop_tracker;
-- \c kpop_tracker;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables (for development)
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS tracks CASCADE;
DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS artists CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS album_type CASCADE;

-- Create custom types
CREATE TYPE album_type AS ENUM (
    'SINGLE',
    'MINI_ALBUM',
    'FULL_ALBUM',
    'REPACKAGE',
    'SPECIAL',
    'JAPANESE',
    'DIGITAL_SINGLE'
);

-- Artists table
CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    korean_name VARCHAR(255),
    debut_date DATE,
    company VARCHAR(255),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Members table
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    korean_name VARCHAR(255),
    stage_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    position TEXT[], -- Array of positions
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Albums table
CREATE TABLE albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    korean_title VARCHAR(255),
    release_date DATE NOT NULL,
    type album_type NOT NULL,
    cover_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tracks table
CREATE TABLE tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    korean_title VARCHAR(255),
    duration INTEGER, -- Duration in seconds
    track_number INTEGER NOT NULL,
    is_title BOOLEAN DEFAULT false,
    music_video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table (junction table for user favorites)
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Ensure at least one favorite type is selected
    CONSTRAINT check_favorite_type CHECK (
        artist_id IS NOT NULL OR 
        album_id IS NOT NULL OR 
        track_id IS NOT NULL
    ),
    -- Prevent duplicate favorites
    UNIQUE(user_id, artist_id),
    UNIQUE(user_id, album_id),
    UNIQUE(user_id, track_id)
);

-- Create indexes for better performance
CREATE INDEX idx_members_artist_id ON members(artist_id);
CREATE INDEX idx_albums_artist_id ON albums(artist_id);
CREATE INDEX idx_albums_release_date ON albums(release_date);
CREATE INDEX idx_tracks_album_id ON tracks(album_id);
CREATE INDEX idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_artist_id ON favorites(artist_id);
CREATE INDEX idx_favorites_album_id ON favorites(album_id);
CREATE INDEX idx_favorites_track_id ON favorites(track_id);

-- Create update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO artists (name, korean_name, debut_date, company, is_active) VALUES
    ('BLACKPINK', '블랙핑크', '2016-08-08', 'YG Entertainment', true),
    ('BTS', '방탄소년단', '2013-06-13', 'HYBE Labels', true),
    ('NewJeans', '뉴진스', '2022-07-22', 'ADOR', true),
    ('TWICE', '트와이스', '2015-10-20', 'JYP Entertainment', true),
    ('Stray Kids', '스트레이 키즈', '2018-03-25', 'JYP Entertainment', true);

-- Insert BLACKPINK members
INSERT INTO members (artist_id, name, korean_name, stage_name, birth_date, position) 
SELECT 
    id, 
    'Lalisa Manobal', 
    '리사', 
    'Lisa', 
    '1997-03-27', 
    ARRAY['Main Dancer', 'Lead Rapper', 'Sub Vocalist', 'Maknae']
FROM artists WHERE name = 'BLACKPINK';

INSERT INTO members (artist_id, name, korean_name, stage_name, birth_date, position) 
SELECT 
    id, 
    'Kim Jisoo', 
    '지수', 
    'Jisoo', 
    '1995-01-03', 
    ARRAY['Lead Vocalist', 'Visual']
FROM artists WHERE name = 'BLACKPINK';

INSERT INTO members (artist_id, name, korean_name, stage_name, birth_date, position) 
SELECT 
    id, 
    'Park Chaeyoung', 
    '로제', 
    'Rosé', 
    '1997-02-11', 
    ARRAY['Main Vocalist', 'Lead Dancer']
FROM artists WHERE name = 'BLACKPINK';

INSERT INTO members (artist_id, name, korean_name, stage_name, birth_date, position) 
SELECT 
    id, 
    'Kim Jennie', 
    '제니', 
    'Jennie', 
    '1996-01-16', 
    ARRAY['Main Rapper', 'Lead Vocalist']
FROM artists WHERE name = 'BLACKPINK';

-- Insert sample albums
INSERT INTO albums (artist_id, title, korean_title, release_date, type)
SELECT 
    id, 
    'BORN PINK', 
    '본 핑크', 
    '2022-09-16', 
    'FULL_ALBUM'
FROM artists WHERE name = 'BLACKPINK';

INSERT INTO albums (artist_id, title, korean_title, release_date, type)
SELECT 
    id, 
    'THE ALBUM', 
    '디 앨범', 
    '2020-10-02', 
    'FULL_ALBUM'
FROM artists WHERE name = 'BLACKPINK';

-- Insert sample tracks for BORN PINK
INSERT INTO tracks (album_id, artist_id, title, korean_title, track_number, is_title, duration)
SELECT 
    a.id, 
    ar.id, 
    'Pink Venom', 
    '핑크 베놈', 
    1, 
    true, 
    187
FROM albums a
JOIN artists ar ON a.artist_id = ar.id
WHERE a.title = 'BORN PINK' AND ar.name = 'BLACKPINK';

INSERT INTO tracks (album_id, artist_id, title, korean_title, track_number, is_title, duration)
SELECT 
    a.id, 
    ar.id, 
    'Shut Down', 
    '셧 다운', 
    2, 
    true, 
    175
FROM albums a
JOIN artists ar ON a.artist_id = ar.id
WHERE a.title = 'BORN PINK' AND ar.name = 'BLACKPINK';

INSERT INTO tracks (album_id, artist_id, title, korean_title, track_number, is_title, duration)
SELECT 
    a.id, 
    ar.id, 
    'Typa Girl', 
    NULL, 
    3, 
    false, 
    179
FROM albums a
JOIN artists ar ON a.artist_id = ar.id
WHERE a.title = 'BORN PINK' AND ar.name = 'BLACKPINK';

-- Create views for common queries
CREATE VIEW artist_with_member_count AS
SELECT 
    a.*,
    COUNT(m.id) as member_count
FROM artists a
LEFT JOIN members m ON a.id = m.artist_id
GROUP BY a.id;

CREATE VIEW album_with_track_count AS
SELECT 
    al.*,
    ar.name as artist_name,
    COUNT(t.id) as track_count
FROM albums al
JOIN artists ar ON al.artist_id = ar.id
LEFT JOIN tracks t ON al.id = t.album_id
GROUP BY al.id, ar.name;