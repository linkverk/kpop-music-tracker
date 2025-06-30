// GraphQL schema definition
import { gql } from "apollo-server";

export const typeDefs = gql`
  type Artist {
    id: ID!
    name: String!
  }

  type Query {
    artists: [Artist!]!
  }

  type Mutation {
    createArtist(name: String!): Artist!
  }
`;
