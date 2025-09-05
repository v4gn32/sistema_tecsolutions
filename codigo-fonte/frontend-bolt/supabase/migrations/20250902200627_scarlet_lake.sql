/*
  # Schema inicial para Sistema de Propostas TecSolutions

  1. Tabelas Principais
    - `clients` - Clientes da empresa
    - `services` - Catálogo de serviços
    - `products` - Catálogo de produtos
    - `proposals` - Propostas comerciais
    - `hardware_inventory` - Inventário de hardware dos clientes
    - `software_inventory` - Inventário de software dos clientes
    - `service_records` - Registros de atendimentos

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Políticas para usuários autenticados
*/

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text NOT NULL,
  cnpj text,
  address text NOT NULL,
  type text NOT NULL CHECK (type IN ('contrato', 'avulso')) DEFAULT 'avulso',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem gerenciar clientes"
  ON clients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Tabela de Serviços
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL CHECK (category IN ('infraestrutura', 'helpdesk', 'nuvem', 'backup', 'cabeamento', 'outros')) DEFAULT 'outros',
  unit text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem gerenciar serviços"
  ON services
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL CHECK (category IN ('cabos', 'conectores', 'equipamentos', 'acessorios', 'outros')) DEFAULT 'outros',
  unit text NOT NULL,
  brand text,
  model text,
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem gerenciar produtos"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Tabela de Propostas
CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  number text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]',
  product_items jsonb NOT NULL DEFAULT '[]',
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  discount decimal(10,2) NOT NULL DEFAULT 0,
  total decimal(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('rascunho', 'enviada', 'aprovada', 'recusada')) DEFAULT 'rascunho',
  valid_until timestamptz NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem gerenciar propostas"
  ON proposals
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Tabela de Inventário de Hardware
CREATE TABLE IF NOT EXISTS hardware_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  brand text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  serial_number text NOT NULL DEFAULT '',
  processor text NOT NULL DEFAULT '',
  memory text NOT NULL DEFAULT '',
  storage text NOT NULL DEFAULT '',
  operating_system text NOT NULL DEFAULT '',
  device_name text NOT NULL DEFAULT '',
  office text NOT NULL DEFAULT '',
  antivirus text NOT NULL DEFAULT '',
  username text NOT NULL DEFAULT '',
  password text NOT NULL DEFAULT '',
  pin text NOT NULL DEFAULT '',
  warranty text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hardware_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem gerenciar inventário de hardware"
  ON hardware_inventory
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Tabela de Inventário de Software
CREATE TABLE IF NOT EXISTS software_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  login text NOT NULL DEFAULT '',
  password text NOT NULL DEFAULT '',
  software_name text NOT NULL DEFAULT '',
  software_type text NOT NULL CHECK (software_type IN ('local', 'cloud', 'subscription', 'license', 'outros')) DEFAULT 'local',
  expiration_alert timestamptz NOT NULL DEFAULT now(),
  monthly_value decimal(10,2),
  annual_value decimal(10,2),
  user_control text NOT NULL CHECK (user_control IN ('ad_local', 'cloud', 'none')) DEFAULT 'none',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE software_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem gerenciar inventário de software"
  ON software_inventory
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Tabela de Registros de Atendimento
CREATE TABLE IF NOT EXISTS service_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('remote', 'onsite', 'laboratory', 'third_party')),
  date timestamptz NOT NULL,
  description text NOT NULL,
  services text[] NOT NULL DEFAULT '{}',
  arrival_time text,
  departure_time text,
  lunch_break boolean DEFAULT false,
  total_hours decimal(4,1),
  device_received timestamptz,
  device_returned timestamptz,
  lab_services text[],
  third_party_company text,
  sent_date timestamptz,
  returned_date timestamptz,
  cost decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem gerenciar registros de atendimento"
  ON service_records
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Inserir dados iniciais de exemplo
INSERT INTO clients (name, email, phone, company, cnpj, address, type) VALUES
('João Silva', 'joao@empresa.com', '(11) 99999-9999', 'Empresa ABC Ltda', '12.345.678/0001-90', 'Rua das Flores, 123 - São Paulo, SP', 'contrato'),
('Maria Santos', 'maria@comercio.com', '(11) 88888-8888', 'Comércio XYZ', '98.765.432/0001-10', 'Av. Paulista, 456 - São Paulo, SP', 'avulso')
ON CONFLICT DO NOTHING;

INSERT INTO services (name, description, price, category, unit) VALUES
('Configuração de Servidor', 'Instalação e configuração completa de servidor Windows/Linux', 800.00, 'infraestrutura', 'unidade'),
('Suporte Técnico Premium', 'Suporte técnico 24/7 com atendimento prioritário', 150.00, 'helpdesk', 'mês'),
('Backup em Nuvem', 'Solução de backup automatizado em nuvem com criptografia', 200.00, 'backup', 'TB/mês'),
('Migração para AWS', 'Migração completa de infraestrutura para Amazon Web Services', 2500.00, 'nuvem', 'projeto'),
('Cabeamento Estruturado', 'Instalação de rede estruturada com certificação', 80.00, 'cabeamento', 'ponto')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, category, unit, brand, model, stock) VALUES
('Cabo de Rede Cat6 UTP', 'Cabo de rede categoria 6 UTP 4 pares 24AWG', 2.50, 'cabos', 'metro', 'Furukawa', 'Cat6 UTP', 1000),
('Conector RJ45 Cat6', 'Conector RJ45 categoria 6 para cabo UTP', 0.80, 'conectores', 'unidade', 'Panduit', 'CJ688TGBU', 500),
('Power Balun Passivo', 'Balun passivo para transmissão de vídeo e energia via UTP', 25.00, 'equipamentos', 'par', 'Intelbras', 'VB 1001 P', 50),
('Patch Panel 24 Portas', 'Patch panel 24 portas categoria 6 19 polegadas', 120.00, 'equipamentos', 'unidade', 'Furukawa', 'PP24C6', 20),
('Abraçadeira Plástica', 'Abraçadeira plástica para fixação de cabos', 0.15, 'acessorios', 'unidade', 'Hellermann', 'T50R', 2000)
ON CONFLICT DO NOTHING;