import { ApolloProvider } from "@apollo/client";
import { client } from "./apolloClient";
import AddArtistForm from "./components/AddArtistForm";
import ArtistList from "./components/ArtistList";
import { Music, Heart, Calendar, Users } from "lucide-react";
import { useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState('artists');

  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-800">
        {/* Header */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-pink-500 to-violet-500 p-2 rounded-xl">
                <Music className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">K-pop Tracker 🎶</h1>
                <p className="text-purple-200 text-sm">Jouw ultieme K-pop dashboard</p>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-black/10 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex space-x-8">
              {[
                { id: 'artists', label: 'Artiesten', icon: Users },
                { id: 'releases', label: 'Releases', icon: Calendar },
                { id: 'favorites', label: 'Favorieten', icon: Heart }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === id
                      ? 'border-pink-500 text-pink-400'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          {activeTab === 'artists' && (
            <div className="space-y-8">
              <AddArtistForm />
              <ArtistList />
            </div>
          )}
          
          {activeTab === 'releases' && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-pink-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Nieuwe Releases</h2>
              <p className="text-gray-300">Binnenkort beschikbaar...</p>
            </div>
          )}
          
          {activeTab === 'favorites' && (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-pink-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Favorieten</h2>
              <p className="text-gray-300">Markeer je favoriete artiesten...</p>
            </div>
          )}
        </main>
      </div>
    </ApolloProvider>
  );
}