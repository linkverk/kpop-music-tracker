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
    _count: ArtistCount
  }

  type ArtistCount {
    members: Int!
    albums: Int!
    tracks: Int!
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
    _count: AlbumCount
  }

  type AlbumCount {
    tracks: Int!
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
    profileImageUrl: String
    favorites: [Favorite!]!
    createdAt: String!
    updatedAt: String!
  }

  type Favorite {
    id: ID!
    user: User!
    artist: Artist
    album: Album
    track: Track
    createdAt: String!
  }

  type Statistics {
    artists: Int!
    albums: Int!
    tracks: Int!
    users: Int!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # Queries
  type Query {
    # Artist queries
    artists(skip: Int, take: Int): [Artist!]!
    artist(id: ID!): Artist
    
    # Album queries
    albums(skip: Int, take: Int): [Album!]!
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
    
    # Search queries
    searchArtists(query: String!): [Artist!]!
    searchAlbums(query: String!): [Album!]!
    searchTracks(query: String!): [Track!]!
    
    # Recent releases
    recentReleases(take: Int): [Album!]!
    
    # Statistics
    statistics: Statistics!
  }

  # Mutations
  type Mutation {
    # Artist mutations
    createArtist(input: CreateArtistInput!): Artist!
    updateArtist(id: ID!, input: UpdateArtistInput!): Artist
    deleteArtist(id: ID!): Boolean!
    
    # Album mutations
    createAlbum(input: CreateAlbumInput!): Album!
    updateAlbum(id: ID!, input: UpdateAlbumInput!): Album
    deleteAlbum(id: ID!): Boolean!
    
    # Track mutations
    createTrack(input: CreateTrackInput!): Track!
    updateTrack(id: ID!, input: UpdateTrackInput!): Track
    deleteTrack(id: ID!): Boolean!
    
    # Member mutations
    createMember(input: CreateMemberInput!): Member!
    updateMember(id: ID!, input: UpdateMemberInput!): Member
    deleteMember(id: ID!): Boolean!
    
    # User mutations
    createUser(username: String!, email: String!, password: String!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User
    login(email: String!, password: String!): AuthPayload!
    
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

  input UpdateAlbumInput {
    title: String
    koreanTitle: String
    releaseDate: String
    type: AlbumType
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

  input UpdateTrackInput {
    title: String
    koreanTitle: String
    duration: Int
    trackNumber: Int
    isTitle: Boolean
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

  input UpdateMemberInput {
    name: String
    koreanName: String
    stageName: String
    birthDate: String
    position: [String!]
    imageUrl: String
    isActive: Boolean
  }

  input UpdateUserInput {
    username: String
    email: String
    profileImageUrl: String
  }

  input AddFavoriteInput {
    artistId: ID
    albumId: ID
    trackId: ID
  }
`;