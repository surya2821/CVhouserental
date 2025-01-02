import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { House } from '../types';

export function AddProject({ onAdd }: { onAdd: (house: House) => void }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');

  const handleAddProject = async () => {
    try {
      const { data, error } = await supabase
        .from('houses')
        .insert([{ title, location, price }])
        .select('*');

      if (error) throw error;
      if (data) {
        onAdd(data[0]); // Pass the new house to the Dashboard component
      }

      // Clear the form
      setTitle('');
      setLocation('');
      setPrice('');
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Project</h2>
      <div className="grid gap-4 mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <button
        onClick={handleAddProject}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Add Project
      </button>
    </div>
  );
}
