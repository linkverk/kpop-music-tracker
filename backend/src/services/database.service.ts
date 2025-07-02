// backend/src/services/database.service.ts

import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  // Artist operations
  async createArtist(data: {
    name: string;
    koreanName?: string;
    debutDate?: Date;
    company?: string;
    imageUrl?: string;
  }) {
    return this.prisma.artist.create({ data });
  }

  async getArtists(params?: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.artist.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        _count: {
          select: {
            members: true,
            albums: true,
          },
        },
      },
    });
  }

  async getArtistById(id: string) {
    return this.prisma.artist.findUnique({
      where: { id },
      include: {
        members: true,
        albums: {
          orderBy: { releaseDate: 'desc' },
        },
        _count: {
          select: {
            members: true,
            albums: true,
            tracks: true,
          },
        },
      },
    });
  }

  async updateArtist(id: string, data: any) {
    return this.prisma.artist.update({
      where: { id },
      data,
    });
  }

  async deleteArtist(id: string) {
    return this.prisma.artist.delete({
      where: { id },
    });
  }

  // Member operations
  async createMember(data: {
    artistId: string;
    name: string;
    koreanName?: string;
    stageName: string;
    birthDate?: Date;
    position?: string[];
    imageUrl?: string;
  }) {
    return this.prisma.member.create({
      data,
      include: { artist: true },
    });
  }

  async getMembersByArtist(artistId: string) {
    return this.prisma.member.findMany({
      where: { artistId },
      orderBy: { birthDate: 'asc' },
    });
  }

  // Album operations
  async createAlbum(data: {
    artistId: string;
    title: string;
    koreanTitle?: string;
    releaseDate: Date;
    type: string;
    coverUrl?: string;
  }) {
    return this.prisma.album.create({
      data: {
        ...data,
        type: data.type as any,
      },
      include: { artist: true },
    });
  }

  async getAlbums(params?: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.album.findMany({
      skip,
      take,
      where,
      orderBy: orderBy || { releaseDate: 'desc' },
      include: {
        artist: true,
        _count: {
          select: { tracks: true },
        },
      },
    });
  }

  async getAlbumById(id: string) {
    return this.prisma.album.findUnique({
      where: { id },
      include: {
        artist: true,
        tracks: {
          orderBy: { trackNumber: 'asc' },
        },
      },
    });
  }

  // Track operations
  async createTrack(data: {
    albumId: string;
    artistId: string;
    title: string;
    koreanTitle?: string;
    duration?: number;
    trackNumber: number;
    isTitle?: boolean;
    musicVideoUrl?: string;
  }) {
    return this.prisma.track.create({
      data,
      include: {
        album: true,
        artist: true,
      },
    });
  }

  async getTracksByAlbum(albumId: string) {
    return this.prisma.track.findMany({
      where: { albumId },
      orderBy: { trackNumber: 'asc' },
    });
  }

  // User operations
  async createUser(data: {
    username: string;
    email: string;
    password: string;
    profileImageUrl?: string;
  }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash,
        profileImageUrl: data.profileImageUrl,
      },
    });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        profileImageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  // Favorite operations
  async addFavorite(data: {
    userId: string;
    artistId?: string;
    albumId?: string;
    trackId?: string;
  }) {
    return this.prisma.favorite.create({
      data,
      include: {
        artist: true,
        album: {
          include: { artist: true },
        },
        track: {
          include: {
            artist: true,
            album: true,
          },
        },
      },
    });
  }

  async getFavoritesByUser(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        artist: true,
        album: {
          include: { artist: true },
        },
        track: {
          include: {
            artist: true,
            album: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeFavorite(id: string) {
    return this.prisma.favorite.delete({
      where: { id },
    });
  }

  // Search operations
  async searchArtists(query: string) {
    return this.prisma.artist.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { koreanName: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  async searchAlbums(query: string) {
    return this.prisma.album.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { koreanTitle: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { artist: true },
    });
  }

  async searchTracks(query: string) {
    return this.prisma.track.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { koreanTitle: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        artist: true,
        album: true,
      },
    });
  }

  // Statistics
  async getStatistics() {
    const [artistCount, albumCount, trackCount, userCount] = await Promise.all([
      this.prisma.artist.count(),
      this.prisma.album.count(),
      this.prisma.track.count(),
      this.prisma.user.count(),
    ]);

    return {
      artists: artistCount,
      albums: albumCount,
      tracks: trackCount,
      users: userCount,
    };
  }

  // Recent releases
  async getRecentReleases(take: number = 10) {
    return this.prisma.album.findMany({
      take,
      orderBy: { releaseDate: 'desc' },
      include: {
        artist: true,
        _count: {
          select: { tracks: true },
        },
      },
    });
  }

  // Cleanup
  async disconnect() {
    await this.prisma.$disconnect();
  }
}

export const db = new DatabaseService();