import { ApolloProvider } from "@apollo/client";
import { client } from "./apolloClient";
import AddArtistForm from "./components/AddArtistForm";
import ArtistList from "./components/ArtistList";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <h1>K-pop Tracker 🎶</h1>
      <AddArtistForm />
      <ArtistList />
    </ApolloProvider>
  );
}
