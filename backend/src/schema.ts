// backend/src/schema.ts
import { gql } from "apollo-server";

export const typeDefs = gql`
  # Enums
  enum AlbumType {
    SINGLE
    MINI_ALBUM
    FULL_ALBUM
    REPACKAGE
    SPECIAL
    JAPANESE
    DIGITAL_SINGLE
  }

  # Types
  type Artist {
    id: ID!
    name: String!
    koreanName: String
    debutDate: String
    company: String
    members: [Member!]
    albums: [Album!]
    imageUrl: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Member {
    id: ID!
    name: String!
    koreanName: String
    stageName: String!
    birthDate: String
    position: [String!]
    artist: Artist
    imageUrl: String
    isActive: Boolean!
  }

  type Album {
    id: ID!
    title: String!
    koreanTitle: String
    artist: Artist!
    releaseDate: String!
    type: AlbumType!
    tracks: [Track!]
    coverUrl: String
    createdAt: String!
  }

  type Track {
    id: ID!
    title: String!
    koreanTitle: String
    album: Album!
    artist: Artist!
    duration: Int
    trackNumber: Int!
    isTitle: Boolean!
    musicVideoUrl: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    favorites: [Favorite!]!
    createdAt: String!
  }

  type Favorite {
    id: ID!
    user: User!
    artist: Artist
    album: Album
    track: Track
    createdAt: String!
  }

  # Queries
  type Query {
    # Artist queries
    artists: [Artist!]!
    artist(id: ID!): Artist
    
    # Album queries
    albums: [Album!]!
    album(id: ID!): Album
    albumsByArtist(artistId: ID!): [Album!]!
    
    # Track queries
    track(id: ID!): Track
    tracksByAlbum(albumId: ID!): [Track!]!
    
    # Member queries
    member(id: ID!): Member
    membersByArtist(artistId: ID!): [Member!]!
    
    # User queries
    user(id: ID!): User
    me: User
  }

  # Mutations
  type Mutation {
    # Artist mutations
    createArtist(input: CreateArtistInput!): Artist!
    updateArtist(id: ID!, input: UpdateArtistInput!): Artist
    deleteArtist(id: ID!): Boolean!
    
    # Album mutations
    createAlbum(input: CreateAlbumInput!): Album!
    
    # Track mutations
    createTrack(input: CreateTrackInput!): Track!
    
    # Member mutations
    createMember(input: CreateMemberInput!): Member!
    
    # User mutations
    createUser(username: String!, email: String!): User!
    
    # Favorite mutations
    addFavorite(input: AddFavoriteInput!): Favorite
    removeFavorite(id: ID!): Boolean!
  }

  # Input types
  input CreateArtistInput {
    name: String!
    koreanName: String
    debutDate: String
    company: String
    imageUrl: String
  }

  input UpdateArtistInput {
    name: String
    koreanName: String
    company: String
    imageUrl: String
    isActive: Boolean
  }

  input CreateAlbumInput {
    title: String!
    koreanTitle: String
    artistId: ID!
    releaseDate: String!
    type: AlbumType!
    coverUrl: String
  }

  input CreateTrackInput {
    title: String!
    koreanTitle: String
    albumId: ID!
    artistId: ID!
    duration: Int
    trackNumber: Int!
    isTitle: Boolean!
    musicVideoUrl: String
  }

  input CreateMemberInput {
    name: String!
    koreanName: String
    stageName: String!
    birthDate: String
    position: [String!]
    artistId: ID!
    imageUrl: String
  }

  input AddFavoriteInput {
    artistId: ID
    albumId: ID
    trackId: ID
  }
`;