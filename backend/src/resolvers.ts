// In je resolvers.ts
import { artistRepository, albumRepository, memberRepository, Artist } from './database';

export const resolvers = {
  Query: {
    artists: () => artistRepository.findAll(),
    artist: (_: any, { id }: { id: string }) => artistRepository.findById(id),
    albums: () => albumRepository.findAll()
  },
  Mutation: {
    createArtist: (_: any, { name, data }: any) => {
      return artistRepository.create(name, data);
    }
  },
  Artist: {
    albums: (artist: Artist) => albumRepository.findByArtist(artist.id),
    members: (artist: Artist) => memberRepository.findByArtist(artist.id)
  }
};