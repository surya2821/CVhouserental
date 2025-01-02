-- Create houses table
CREATE TABLE houses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  location text NOT NULL,
  bedrooms integer NOT NULL CHECK (bedrooms >= 0),
  bathrooms integer NOT NULL CHECK (bathrooms >= 0),
  area integer NOT NULL CHECK (area >= 0),
  image_url text NOT NULL,
  owner_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);



-- Enable Row Level Security (RLS) for houses table
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read houses
CREATE POLICY "Anyone can read houses"
  ON houses
  FOR SELECT
  TO public
  USING (true);

-- Policy: Authenticated users can create houses
CREATE POLICY "Authenticated users can create houses"
  ON houses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can update their own houses
CREATE POLICY "Users can update their own houses"
  ON houses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can delete their own houses
CREATE POLICY "Users can delete their own houses"
  ON houses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Policy: Allow logged-in users to count houses
CREATE POLICY "Allow logged in users to count houses"
  ON houses
  FOR SELECT
  USING (auth.uid() IS NOT NULL);
-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fullname text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL
);

-- Enable Row Level Security (RLS) for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to access their own profiles
CREATE POLICY "Allow users to access their profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Allow users to update their own profiles
CREATE POLICY "Allow users to update their profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Allow authenticated users to create profiles
CREATE POLICY "Allow users to create their profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
