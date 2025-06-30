import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const CREATE_ARTIST = gql`
  mutation CreateArtist($name: String!) {
    createArtist(name: $name) {
      id
      name
    }
  }
`;

export default function AddArtistForm() {
  const [name, setName] = useState("");
  const [createArtist] = useMutation(CREATE_ARTIST);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (name.trim()) {
          createArtist({ variables: { name } });
          setName("");
        }
      }}
    >
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nieuwe artiest"
      />
      <button type="submit">Toevoegen</button>
    </form>
  );
}
