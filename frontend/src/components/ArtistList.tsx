import { gql, useQuery } from "@apollo/client";
import { Music, Heart, Users, Calendar } from "lucide-react";

const GET_ARTISTS = gql`
  query {
    artists {
      id
      name
    }
  }
`;

interface Artist {
  id: string;
  name: string;
}

export default function ArtistList() {
  const { data, loading, error } = useQuery(GET_ARTISTS);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-6 h-6 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
          <span className="text-white text-lg">K-pop artiesten laden...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 backdrop-blur-md rounded-2xl p-6 border border-red-500/30">
        <div className="flex items-center space-x-3">
          <Music className="h-6 w-6 text-red-400" />
          <div>
            <h3 className="text-red-200 font-semibold">Fout bij laden</h3>
            <p className="text-red-300 text-sm">Kon artiesten niet laden: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const artists: Artist[] = data?.artists || [];

  if (artists.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 text-center">
        <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Nog geen artiesten</h3>
        <p className="text-gray-300 mb-4">
          Begin met het toevoegen van je favoriete K-pop artiesten!
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>0 artiesten</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>0 favorieten</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Users className="h-6 w-6 mr-2 text-pink-400" />
          Jouw K-pop Artiesten
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <div className="flex items-center space-x-2">
            <Music className="h-4 w-4" />
            <span>{artists.length} artiest{artists.length !== 1 ? 'en' : ''}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map((artist, index) => (
          <div
            key={artist.id}
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group"
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: 'fadeInUp 0.5s ease-out forwards'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-pink-500 to-violet-500 p-2 rounded-lg">
                <Music className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg group-hover:text-pink-300 transition-colors">
                  {artist.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-400 text-xs">K-pop artiest</span>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-pink-400 transition-colors p-1"
                title="Voeg toe aan favorieten"
                aria-label="Voeg toe aan favorieten"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Toegevoegd aan collectie</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-violet-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}