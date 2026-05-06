-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Labs Showcase (Projects)
CREATE TABLE labs_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  status TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  slug TEXT UNIQUE NOT NULL,
  thumbnail_url TEXT,
  specs JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Presentations (Sales Presentations)
CREATE TABLE presentations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Slides (Presentation Slides)
CREATE TABLE slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  presentation_id UUID REFERENCES presentations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT,
  icon_name TEXT, -- 'rocket', 'palette', 'cpu', 'mouse-pointer'
  order_index INTEGER NOT NULL,
  stats JSONB DEFAULT '[]', -- e.g., [{"label": "Perf", "value": "100%"}]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Leads (Slide Viewers)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  presentation_id UUID REFERENCES presentations(id) ON DELETE SET NULL,
  name TEXT,
  email TEXT,
  whatsapp TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial labs data (Optional)
INSERT INTO labs_projects (name, client, status, progress, slug) VALUES 
('Neural Interface', 'Cyberdyne Systems', 'Em Desenvolvimento', 85, 'neural-interface'),
('Astral Landing', 'Cosmos Lab', 'Finalizando', 92, 'astral-landing'),
('Carbon Dash', 'Eco Tech', 'Iniciado', 45, 'carbon-dash');

-- 5. Site Settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES 
('branding', '{"name": "Agência 47", "tagline": "Design & Tecnologia", "logo_url": ""}'::jsonb),
('social', '{"instagram": "", "linkedin": "", "github": "", "whatsapp": ""}'::jsonb);
