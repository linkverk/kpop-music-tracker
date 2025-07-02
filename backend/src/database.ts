// backend/src/database.ts

// In-memory database types
export interface Artist {
  id: string;
  name: string;
  koreanName?: string;
  debutDate?: Date;
  company?: string;
  members?: Member[];
  albums?: Album[];
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Member {
  id: string;
  name: string;
  koreanName?: string;
  stageName: string;
  birthDate?: Date;
  position?: string[];
  artistId: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface Album {
  id: string;
  title: string;
  koreanTitle?: string;
  artistId: string;
  releaseDate: Date;
  type: AlbumType;
  tracks?: Track[];
  coverUrl?: string;
  createdAt: Date;
}

export interface Track {
  id: string;
  title: string;
  koreanTitle?: string;
  albumId: string;
  artistId: string;
  duration?: number; // in seconds
  trackNumber: number;
  isTitle: boolean;
  musicVideoUrl?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  favorites: Favorite[];
  createdAt: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  artistId?: string;
  albumId?: string;
  trackId?: string;
  createdAt: Date;
}

export enum AlbumType {
  SINGLE = 'SINGLE',
  MINI_ALBUM = 'MINI_ALBUM',
  FULL_ALBUM = 'FULL_ALBUM',
  REPACKAGE = 'REPACKAGE',
  SPECIAL = 'SPECIAL',
  JAPANESE = 'JAPANESE',
  DIGITAL_SINGLE = 'DIGITAL_SINGLE'
}

// In-memory database
class Database {
  private artists: Map<string, Artist> = new Map();
  private members: Map<string, Member> = new Map();
  private albums: Map<string, Album> = new Map();
  private tracks: Map<string, Track> = new Map();
  private users: Map<string, User> = new Map();
  private favorites: Map<string, Favorite> = new Map();
  
  private idCounters = {
    artist: 1,
    member: 1,
    album: 1,
    track: 1,
    user: 1,
    favorite: 1
  };

  constructor() {
    // Initialize with some sample data
    this.seedData();
  }

  // Artist methods
  createArtist(name: string, data?: Partial<Artist>): Artist {
    const id = `artist_${this.idCounters.artist++}`;
    const now = new Date();
    const artist: Artist = {
      id,
      name,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      ...data
    };
    this.artists.set(id, artist);
    return artist;
  }

  getArtist(id: string): Artist | undefined {
    return this.artists.get(id);
  }

  getAllArtists(): Artist[] {
    return Array.from(this.artists.values());
  }

  updateArtist(id: string, data: Partial<Artist>): Artist | null {
    const artist = this.artists.get(id);
    if (!artist) return null;
    
    const updated = {
      ...artist,
      ...data,
      id: artist.id, // Ensure ID can't be changed
      updatedAt: new Date()
    };
    this.artists.set(id, updated);
    return updated;
  }

  deleteArtist(id: string): boolean {
    return this.artists.delete(id);
  }

  // Member methods
  createMember(data: Omit<Member, 'id'>): Member {
    const id = `member_${this.idCounters.member++}`;
    const member: Member = {
      id,
      ...data
    };
    this.members.set(id, member);
    return member;
  }

  getMembersByArtist(artistId: string): Member[] {
    return Array.from(this.members.values()).filter(m => m.artistId === artistId);
  }

  // Album methods
  createAlbum(data: Omit<Album, 'id' | 'createdAt'>): Album {
    const id = `album_${this.idCounters.album++}`;
    const album: Album = {
      id,
      createdAt: new Date(),
      ...data
    };
    this.albums.set(id, album);
    return album;
  }

  getAlbumsByArtist(artistId: string): Album[] {
    return Array.from(this.albums.values()).filter(a => a.artistId === artistId);
  }

  getAllAlbums(): Album[] {
    return Array.from(this.albums.values());
  }

  // Track methods
  createTrack(data: Omit<Track, 'id'>): Track {
    const id = `track_${this.idCounters.track++}`;
    const track: Track = {
      id,
      ...data
    };
    this.tracks.set(id, track);
    return track;
  }

  getTracksByAlbum(albumId: string): Track[] {
    return Array.from(this.tracks.values())
      .filter(t => t.albumId === albumId)
      .sort((a, b) => a.trackNumber - b.trackNumber);
  }

  // User methods
  createUser(username: string, email: string): User {
    const id = `user_${this.idCounters.user++}`;
    const user: User = {
      id,
      username,
      email,
      favorites: [],
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Favorite methods
  addFavorite(userId: string, data: { artistId?: string; albumId?: string; trackId?: string }): Favorite | null {
    const user = this.users.get(userId);
    if (!user) return null;

    const id = `fav_${this.idCounters.favorite++}`;
    const favorite: Favorite = {
      id,
      userId,
      ...data,
      createdAt: new Date()
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  getFavoritesByUser(userId: string): Favorite[] {
    return Array.from(this.favorites.values()).filter(f => f.userId === userId);
  }

  // Seed data
  private seedData() {
    // Create BLACKPINK
    const blackpink = this.createArtist('BLACKPINK', {
      koreanName: '블랙핑크',
      company: 'YG Entertainment',
      debutDate: new Date('2016-08-08'),
      imageUrl: 'https://example.com/blackpink.jpg'
    });

    // Add BLACKPINK members
    this.createMember({
      name: 'Lalisa Manobal',
      stageName: 'Lisa',
      koreanName: '리사',
      birthDate: new Date('1997-03-27'),
      position: ['Main Dancer', 'Lead Rapper', 'Sub Vocalist', 'Maknae'],
      artistId: blackpink.id,
      isActive: true
    });

    this.createMember({
      name: 'Kim Jisoo',
      stageName: 'Jisoo',
      koreanName: '지수',
      birthDate: new Date('1995-01-03'),
      position: ['Lead Vocalist', 'Visual'],
      artistId: blackpink.id,
      isActive: true
    });

    this.createMember({
      name: 'Park Chaeyoung',
      stageName: 'Rosé',
      koreanName: '로제',
      birthDate: new Date('1997-02-11'),
      position: ['Main Vocalist', 'Lead Dancer'],
      artistId: blackpink.id,
      isActive: true
    });

    this.createMember({
      name: 'Kim Jennie',
      stageName: 'Jennie',
      koreanName: '제니',
      birthDate: new Date('1996-01-16'),
      position: ['Main Rapper', 'Lead Vocalist'],
      artistId: blackpink.id,
      isActive: true
    });

    // Create BTS
    const bts = this.createArtist('BTS', {
      koreanName: '방탄소년단',
      company: 'HYBE Labels',
      debutDate: new Date('2013-06-13'),
      imageUrl: 'https://example.com/bts.jpg'
    });

    // Create NewJeans
    const newjeans = this.createArtist('NewJeans', {
      koreanName: '뉴진스',
      company: 'ADOR',
      debutDate: new Date('2022-07-22'),
      imageUrl: 'https://example.com/newjeans.jpg'
    });

    // Add some albums
    const bornPink = this.createAlbum({
      title: 'BORN PINK',
      koreanTitle: '본 핑크',
      artistId: blackpink.id,
      releaseDate: new Date('2022-09-16'),
      type: AlbumType.FULL_ALBUM,
      coverUrl: 'https://example.com/born-pink.jpg'
    });

    // Add tracks to BORN PINK
    this.createTrack({
      title: 'Pink Venom',
      koreanTitle: '핑크 베놈',
      albumId: bornPink.id,
      artistId: blackpink.id,
      trackNumber: 1,
      isTitle: true,
      duration: 3 * 60 + 7, // 3:07
      musicVideoUrl: 'https://youtube.com/watch?v=...'
    });

    this.createTrack({
      title: 'Shut Down',
      albumId: bornPink.id,
      artistId: blackpink.id,
      trackNumber: 2,
      isTitle: true,
      duration: 2 * 60 + 55,
      musicVideoUrl: 'https://youtube.com/watch?v=...'
    });

    this.createTrack({
      title: 'Typa Girl',
      albumId: bornPink.id,
      artistId: blackpink.id,
      trackNumber: 3,
      isTitle: false,
      duration: 2 * 60 + 59
    });

    // Create a sample user
    const user = this.createUser('kpopfan123', 'kpopfan@example.com');
    
    // Add some favorites
    this.addFavorite(user.id, { artistId: blackpink.id });
    this.addFavorite(user.id, { albumId: bornPink.id });
  }
}

// Export singleton instance
export const db = new Database();

// Export convenience functions
export const artistRepository = {
  create: (name: string, data?: Partial<Artist>) => db.createArtist(name, data),
  findById: (id: string) => db.getArtist(id),
  findAll: () => db.getAllArtists(),
  update: (id: string, data: Partial<Artist>) => db.updateArtist(id, data),
  delete: (id: string) => db.deleteArtist(id)
};

export const memberRepository = {
  create: (data: Omit<Member, 'id'>) => db.createMember(data),
  findByArtist: (artistId: string) => db.getMembersByArtist(artistId)
};

export const albumRepository = {
  create: (data: Omit<Album, 'id' | 'createdAt'>) => db.createAlbum(data),
  findByArtist: (artistId: string) => db.getAlbumsByArtist(artistId),
  findAll: () => db.getAllAlbums()
};

export const trackRepository = {
  create: (data: Omit<Track, 'id'>) => db.createTrack(data),
  findByAlbum: (albumId: string) => db.getTracksByAlbum(albumId)
};

export const userRepository = {
  create: (username: string, email: string) => db.createUser(username, email)
};

export const favoriteRepository = {
  create: (userId: string, data: { artistId?: string; albumId?: string; trackId?: string }) => 
    db.addFavorite(userId, data),
  findByUser: (userId: string) => db.getFavoritesByUser(userId)
};