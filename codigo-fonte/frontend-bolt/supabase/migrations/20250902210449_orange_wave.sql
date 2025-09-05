/*
  # Fix RLS policies for anonymous access

  1. Security Changes
    - Update RLS policies to allow anonymous users to perform CRUD operations
    - This is for development purposes - in production, proper authentication should be implemented
    
  2. Tables affected
    - clients: Allow anonymous INSERT, SELECT, UPDATE, DELETE
    - services: Allow anonymous INSERT, SELECT, UPDATE, DELETE  
    - products: Allow anonymous INSERT, SELECT, UPDATE, DELETE
    - proposals: Allow anonymous INSERT, SELECT, UPDATE, DELETE
    - hardware_inventory: Allow anonymous INSERT, SELECT, UPDATE, DELETE
    - software_inventory: Allow anonymous INSERT, SELECT, UPDATE, DELETE
    - service_records: Allow anonymous INSERT, SELECT, UPDATE, DELETE
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar clientes" ON clients;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar serviços" ON services;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar produtos" ON products;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar propostas" ON proposals;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar inventário de hardware" ON hardware_inventory;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar inventário de software" ON software_inventory;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar registros de atendimento" ON service_records;

-- Create permissive policies for development (allow anonymous access)
CREATE POLICY "Allow anonymous access to clients"
  ON clients
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous access to services"
  ON services
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous access to products"
  ON products
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous access to proposals"
  ON proposals
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous access to hardware_inventory"
  ON hardware_inventory
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous access to software_inventory"
  ON software_inventory
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous access to service_records"
  ON service_records
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Also create policies for authenticated users
CREATE POLICY "Allow authenticated access to clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated access to services"
  ON services
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated access to products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated access to proposals"
  ON proposals
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated access to hardware_inventory"
  ON hardware_inventory
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated access to software_inventory"
  ON software_inventory
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated access to service_records"
  ON service_records
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);