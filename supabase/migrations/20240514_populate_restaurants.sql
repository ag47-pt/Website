-- 1. Ensure the table exists (it should, but just in case of missing columns)
-- ALTER TABLE restag_restaurants ADD COLUMN IF NOT EXISTS meta_data JSONB DEFAULT '{}'::jsonb;
-- ALTER TABLE restag_restaurants ADD COLUMN IF NOT EXISTS city TEXT;
-- ALTER TABLE restag_restaurants ADD COLUMN IF NOT EXISTS branding_color TEXT DEFAULT '#10b981';

-- 2. Insert/Update Bipolar
INSERT INTO restag_restaurants (
  id, 
  name, 
  slug, 
  description, 
  address, 
  city, 
  status, 
  branding_color, 
  meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- MOCK_ID for Bipolar
  'Bipolar Grill & Wine',
  'bipolar',
  'A brasa de tradição reinventada. A convergência entre a força do fogo e a precisão da engenharia gastronômica.',
  'Lisboa, Portugal',
  'Lisboa',
  'active',
  '#10b981', -- Emerald
  '{
    "cardTitle": "*Bipolar*",
    "tag": "Reinventada",
    "heroTitle": "A brasa de tradição",
    "heroSubtitle": "A convergência entre a força do fogo e a precisão da engenharia gastronômica.",
    "cuisine": "Portuguesa",
    "priceRange": "avg. 25,00 €",
    "rating": 4.8,
    "phone": "+351 21 586 5388",
    "descriptionLong": "Neste refúgio gastronômico em Lisboa, a consistência e a autenticidade são os pilares de cada prato. O Bipolar é onde o calor da brasa encontra uma garrafeira curada, criando um ambiente moderno e familiar que celebra o melhor da cozinha contemporânea reinventada. Os pratos grelhados são o destaque absoluto, preparados com precisão técnica e paixão pela tradição.",
    "metaDescription": "Descobre o melhor do **grill e vinhos** em Lisboa. Ambiente acolhedor e **sabores autênticos** reinventados.",
    "gallery": [
      "/restag/franguia_gallery_0.png",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop"
    ],
    "video": "/restag/videos/bipolar-explanada.mp4",
    "videoWatermark": "Bipolar Explanada",
    "features": ["Grelha a Carvão", "Family-Friendly", "Ambiente Moderno", "Garrafeira Premium", "Estacionamento Fácil"],
    "results": [
      { "value": "15+", "label": "Anos de história", "desc": "Mais de uma década servindo excelência em Lisboa." },
      { "value": "4.8", "label": "Avaliação média", "desc": "Baseado em mais de 1000 reviews de clientes satisfeitos." },
      { "value": "250", "label": "Rótulos de vinho", "desc": "Uma das garrafeiras mais completas da região." }
    ],
    "process": [
      { "step": "01", "title": "A Chegada", "desc": "Sê recebido num ambiente que respira história e modernidade.", "detail": "O nosso host irá guiar-te até à tua mesa pré-configurada." },
      { "step": "02", "title": "O Menu", "desc": "Explora pratos que respeitam a sazonalidade dos ingredientes.", "detail": "Ingredientes frescos vindos diretamente de produtores locais." },
      { "step": "03", "title": "O Brinde", "desc": "Harmonização perfeita sugerida pelo nosso sommelier.", "detail": "Cada trago é pensado para elevar o sabor da tua escolha." }
    ],
    "menu": [
      {
        "category": "Entradas",
        "items": [
          { "name": "Pica-pau de Novilho", "price": "12€", "desc": "Cubos de lombo com molho de cerveja e pickles caseiros.", "popular": true },
          { "name": "Queijo de Azeitão", "price": "8€", "desc": "Queijo amanteigado com tostas de pão de mafra." }
        ]
      },
      {
        "category": "Pratos Principais",
        "items": [
          { "name": "Frango na Brasa \"Bipolar\"", "price": "15€", "desc": "O nosso clássico com molho secreto e batata frita.", "popular": true },
          { "name": "Arroz de Marisco", "price": "22€", "desc": "Arroz malandrinho com gambas, amêijoas e coentros." }
        ]
      }
    ],
    "operatingHours": {
      "Segunda": "Encerrado",
      "Terça": "Encerrado",
      "Quarta": "18:00 - 01:00",
      "Quinta": "18:00 - 01:00",
      "Sexta": "18:00 - 01:00",
      "Sábado": "18:00 - 01:00",
      "Domingo": "13:00 - 21:00"
    },
    "reservationSettings": {
      "maxPartySize": 12,
      "intervals": 30,
      "notice": "1 hour"
    }
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET meta_data = EXCLUDED.meta_data, status = EXCLUDED.status;

-- 3. Insert Carbon Core
INSERT INTO restag_restaurants (
  id, 
  name, 
  slug, 
  description, 
  address, 
  city, 
  status, 
  branding_color, 
  meta_data
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Carbon Core Thermal Dining',
  'carbon-core',
  'Where molecular physics meets the art of the perfect sear. A technical dining readout.',
  'Labs District, Lisbon',
  'Lisboa',
  'active',
  '#3b82f6', -- Blue
  '{
    "cardTitle": "*Carbon Core*",
    "tag": "LABS_CERTIFIED_v1.0",
    "heroTitle": "Precision *Thermal* Gastronomy",
    "heroSubtitle": "Where molecular physics meets the art of the perfect sear. A technical dining readout.",
    "cuisine": "Molecular/Experimental",
    "priceRange": "avg. 85,00 €",
    "rating": 4.9,
    "phone": "+351 21 000 0000",
    "descriptionLong": "Carbon Core é um protótipo de gastronomia termal onde a física molecular se encontra com a arte do selado perfeito.",
    "metaDescription": "Experience the precision of thermal cooking at Carbon Core.",
    "gallery": [
      "/restag/carbon_core_gallery_0.png",
      "https://images.unsplash.com/photo-1550966841-3ee7adac1668?q=80&w=1000&auto=format&fit=crop"
    ],
    "features": ["Molecular Lab", "Thermal Sensors", "Experimental Dining"],
    "results": [
      { "value": "99%", "label": "Thermal Accuracy", "desc": "Maximum variance of 0.1°C across all proteins." }
    ],
    "process": [
      { "step": "01", "title": "System Scan", "desc": "Arrive at the air-locked entrance.", "detail": "Your sensory profile is established upon entry." }
    ],
    "menu": [
      {
        "category": "Prototypes",
        "items": [
          { "name": "Cured Carbon Beef", "price": "45€", "desc": "Sous-vide for 72 hours.", "popular": true }
        ]
      }
    ],
    "operatingHours": {
      "Segunda - Sexta": "19:00 - 23:00",
      "Sábado": "19:00 - 00:00",
      "Domingo": "Encerrado"
    },
    "reservationSettings": {
      "maxPartySize": 4,
      "intervals": 60,
      "notice": "24 hours"
    }
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET meta_data = EXCLUDED.meta_data, status = EXCLUDED.status;
