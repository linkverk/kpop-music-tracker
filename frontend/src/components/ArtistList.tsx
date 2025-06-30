import { gql, useQuery } from "@apollo/client";

const GET_ARTISTS = gql`
  query {
    artists {
      id
      name
    }
  }
`;

export default function ArtistList() {
  const { data, loading } = useQuery(GET_ARTISTS);

  if (loading) return <p>Laden...</p>;

  return (
    <ul>
      {data.artists.map((artist: any) => (
        <li key={artist.id}>{artist.name}</li>
      ))}
    </ul>
  );
}
