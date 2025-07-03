import { db } from '../services/database.service';
import { GraphQLError } from 'graphql';

export const resolvers = {
  Query: {
    // Artists
    artists: async (_: any, args: { skip?: number; take?: number }) => {
      return db.getArtists(args);
    },
    artist: async (_: any, { id }: { id: string }) => {
      const artist = await db.getArtistById(id);
      if (!artist) throw new GraphQLError('Artist not found');
      return artist;
    },

    // Albums
    albums: async (_: any, args: { skip?: number; take?: number }) => {
      return db.getAlbums(args);
    },
    album: async (_: any, { id }: { id: string }) => {
      const album = await db.getAlbumById(id);
      if (!album) throw new GraphQLError('Album not found');
      return album;
    },
    albumsByArtist: async (_: any, { artistId }: { artistId: string }) => {
      return db.getAlbums({ where: { artistId } });
    },

    // Recent releases
    recentReleases: async (_: any, { take }: { take?: number }) => {
      return db.getRecentReleases(take);
    },

    // Search
    searchArtists: async (_: any, { query }: { query: string }) => {
      return db.searchArtists(query);
    },
    searchAlbums: async (_: any, { query }: { query: string }) => {
      return db.searchAlbums(query);
    },
    searchTracks: async (_: any, { query }: { query: string }) => {
      return db.searchTracks(query);
    },

    // Statistics
    statistics: async () => {
      return db.getStatistics();
    },
  },

  Mutation: {
    // Artists
    createArtist: async (_: any, { input }: { input: any }) => {
      return db.createArtist({
        ...input,
        debutDate: input.debutDate ? new Date(input.debutDate) : undefined,
      });
    },
    updateArtist: async (_: any, { id, input }: { id: string; input: any }) => {
      return db.updateArtist(id, input);
    },
    deleteArtist: async (_: any, { id }: { id: string }) => {
      await db.deleteArtist(id);
      return true;
    },

    // Albums
    createAlbum: async (_: any, { input }: { input: any }) => {
      return db.createAlbum({
        ...input,
        releaseDate: new Date(input.releaseDate),
      });
    },

    // Tracks
    createTrack: async (_: any, { input }: { input: any }) => {
      return db.createTrack(input);
    },

    // Members
    createMember: async (_: any, { input }: { input: any }) => {
      return db.createMember({
        ...input,
        birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
      });
    },

    // Users
    createUser: async (_: any, { username, email, password }: any) => {
      return db.createUser({ username, email, password });
    },

    // Favorites
    addFavorite: async (_: any, { input }: { input: any }, context: any) => {
      // In real app, get userId from context
      const userId = 'user-id-from-auth';
      return db.addFavorite({ userId, ...input });
    },
    removeFavorite: async (_: any, { id }: { id: string }) => {
      await db.removeFavorite(id);
      return true;
    },
  },

  // Field resolvers
  Artist: {
    members: async (artist: { id: string }) => {
      return db.getMembersByArtist(artist.id);
    },
    albums: async (artist: { id: string }) => {
      return db.getAlbums({ where: { artistId: artist.id } });
    },
  },

  Album: {
    tracks: async (album: { id: string }) => {
      return db.getTracksByAlbum(album.id);
    },
  },

  User: {
    favorites: async (user: { id: string }) => {
      return db.getFavoritesByUser(user.id);
    },
  },
};