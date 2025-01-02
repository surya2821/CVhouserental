import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { House } from '../types';
import { HouseCard } from '../components/HouseCard';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]); // For storing filtered houses
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true); // For handling auth state loading
  const [user, setUser] = useState<any>(null); // Supabase user state
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate(); // React Router's useNavigate hook

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) fetchHouses();
  }, [user]);

  useEffect(() => {
    // Filter houses based on the search term dynamically
    const lowerCasedTerm = searchTerm.toLowerCase();
    const filtered = houses.filter((house) =>
      house.title.toLowerCase().includes(lowerCasedTerm) ||
      house.location.toLowerCase().includes(lowerCasedTerm)
    );
    setFilteredHouses(filtered);
  }, [searchTerm, houses]);

  async function checkAuth() {
    setAuthLoading(true);
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    setAuthLoading(false);
  }

  async function fetchHouses() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHouses(data || []);
      setFilteredHouses(data || []); // Initialize the filtered list
    } catch (error) {
      console.error('Error fetching houses:', error);
    } finally {
      setLoading(false);
    }
  }

  const navigateToLogin = () => {
    navigate('/login'); // Navigate to the login page
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {user ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Home</h1>
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredHouses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHouses.map((house) => (
                <HouseCard key={house.id} house={house} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No houses found matching your criteria.</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to House Rentals</h1>
          <p className="text-lg text-gray-500 mb-6">
            This platform connects renters and property owners seamlessly. Sign up or log in to explore or list houses.
          </p>
          <button
            onClick={navigateToLogin}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login to Continue
          </button>
        </div>
      )}
    </div>
  );
}
