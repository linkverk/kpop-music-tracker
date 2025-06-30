import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Plus, Music } from "lucide-react";

const CREATE_ARTIST = gql`
  mutation CreateArtist($name: String!) {
    createArtist(name: $name) {
      id
      name
    }
  }
`;

const GET_ARTISTS = gql`
  query {
    artists {
      id
      name
    }
  }
`;

export default function AddArtistForm() {
  const [name, setName] = useState("");
  const [createArtist, { loading }] = useMutation(CREATE_ARTIST, {
    refetchQueries: [{ query: GET_ARTISTS }],
    onCompleted: () => {
      setName("");
    },
    onError: (error) => {
      console.error("Error creating artist:", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createArtist({ variables: { name: name.trim() } });
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Plus className="h-6 w-6 mr-2 text-pink-400" />
        Nieuwe K-pop Artiest Toevoegen
      </h2>
      
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div className="flex-1 relative">
          <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bijv. BLACKPINK, BTS, NewJeans..."
            disabled={loading}
            className="w-full bg-white/10 backdrop-blur-md text-white placeholder-gray-300 pl-10 pr-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Toevoegen...</span>
            </div>
          ) : (
            "Toevoegen"
          )}
        </button>
      </form>
      
      <p className="text-gray-300 text-sm mt-3">
        Voeg je favoriete K-pop artiesten toe aan je collectie! 🎵
      </p>
    </div>
  );
}