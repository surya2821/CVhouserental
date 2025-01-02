import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface House {
  id: string;
  title: string;
  image_url: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  owner_id: string;
  description: string;
}

export const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHouse() {
      setLoading(true);
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching house:', error);
        setLoading(false);
        return;
      }

      setHouse(data);
      setLoading(false);
    }

    fetchHouse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!house) {
    return <div className="text-center text-gray-500 mt-20">Property not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-4">{house.title}</h1>
      <img
        src={house.image_url}
        alt={house.title}
        className="w-full rounded-lg mb-4"
      />
      <p className="text-gray-700">{house.description}</p>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <p className="font-semibold text-gray-800">Price:</p>
          <p className="text-gray-600">₹{house.price}/mo</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Location:</p>
          <p className="text-gray-600">{house.location}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Bedrooms:</p>
          <p className="text-gray-600">{house.bedrooms}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Bathrooms:</p>
          <p className="text-gray-600">{house.bathrooms}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Area:</p>
          <p className="text-gray-600">{house.area} sqft</p>
        </div>
      </div>
      <p className="mt-6 text-gray-600">
        Contact Seller: <span className="text-blue-600">{house.owner_id}</span>
      </p>
    </div>
  );
};
