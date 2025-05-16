/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
    - `medical_records`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `doctor_id` (uuid, foreign key)
      - `diagnosis` (text)
      - `treatment` (text)
      - `notes` (text)
      - `created_at` (timestamp)
    - `appointments`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `doctor_id` (uuid, foreign key)
      - `date` (timestamp)
      - `status` (text)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Medical Records table
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES users(id) NOT NULL,
  doctor_id uuid REFERENCES users(id) NOT NULL,
  diagnosis text,
  treatment text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can read own records"
  ON medical_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Medical staff can read all records"
  ON medical_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'medical'
    )
  );

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES users(id) NOT NULL,
  doctor_id uuid REFERENCES users(id) NOT NULL,
  date timestamptz NOT NULL,
  status text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = patient_id
    OR auth.uid() = doctor_id
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );