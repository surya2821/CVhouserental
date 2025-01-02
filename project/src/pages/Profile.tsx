import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  full_name: string;
  email: string;
}

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Profile>({
    full_name: '',
    email: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);

      // Fetch authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('User not logged in or error fetching user:', userError);
        setLoading(false);
        return;
      }

      console.log('Authenticated user:', user);

      // Fetch profile details from 'profiles' table
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error fetching profile from database:', error);
        // Handle case where profile does not exist
        if (error.code === 'PGRST116') {
          console.log('No profile found. Creating default profile...');
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ email: user.email, full_name: '' }]);

          if (insertError) throw insertError;

          // Re-fetch profile after creating it
          fetchProfile();
          return;
        }
        throw error;
      }

      console.log('Fetched profile data:', data);
      setProfile(data);
      setFormData(data); // Populate form data for editing
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
        })
        .eq('email', formData.email);

      if (error) throw error;

      console.log('Profile updated successfully');
      setProfile({ ...profile, ...formData });
      setEditing(false); // Exit editing mode
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>
      {profile ? (
        <div className="flex flex-col items-center">
          <div className="w-full">
            {!editing ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1 px-4 py-2 border rounded-lg bg-gray-100">{profile.full_name}</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 px-4 py-2 border rounded-lg bg-gray-100">{profile.email}</div>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={updateProfile}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No profile details found.</p>
      )}
    </div>
  );
};
