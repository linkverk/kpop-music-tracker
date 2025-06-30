// GraphQL resolvers
let artists: any[] = [];
let idCounter = 1;

export const resolvers = {
  Query: {
    artists: () => artists
  },
  Mutation: {
    createArtist: (_: any, { name }: any) => {
      const newArtist = { id: idCounter++, name };
      artists.push(newArtist);
      return newArtist;
    }
  }
};
