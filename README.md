# AutoFlow Pro

## AI Receptionist Management System

AutoFlow Pro is a comprehensive workshop management system with integrated AI receptionist capabilities using ElevenLabs for voice calls and WhatsApp integration through N8N webhooks.

## Features

- 🎯 **Dashboard** - Overview of workshop statistics and performance
- 👥 **Customer Management** - Track and manage customer information
- 🚗 **Vehicle Management** - Register and monitor vehicles
- 🔧 **Work Orders** - Create and manage repair jobs
- 📞 **Call Logs** - AI-powered call management with ElevenLabs
- 📊 **Vehicle Catalog** - Comprehensive vehicle database

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS with glass-morphism effects
- **Backend**: Supabase (Authentication + Database)
- **AI Voice**: ElevenLabs API
- **Automation**: N8N Webhooks
- **Icons**: Lucide React

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account and project
- N8N instance (for webhooks)
- ElevenLabs API key (for AI calls)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/Sluk3/Autoflow.git
cd Autoflow

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://qtrypzzcjebvfcihiynt.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# N8N Webhook URLs
VITE_N8N_WEBHOOK_BASE_URL=https://your-n8n-instance.com/webhook
VITE_N8N_CALL_WEBHOOK=/incoming-call
VITE_N8N_WHATSAPP_WEBHOOK=/whatsapp-message

# ElevenLabs Configuration
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### 4. Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from Settings > API
3. Update the `.env` file with your credentials

### 5. Database Schema

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  make TEXT,
  model TEXT,
  year INTEGER,
  plate TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create work_orders table
CREATE TABLE work_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id),
  description TEXT,
  status TEXT DEFAULT 'pending',
  total_cost DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create call_logs table (for AI receptionist)
CREATE TABLE call_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_phone TEXT,
  call_type TEXT,
  transcript TEXT,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Run the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

## N8N Integration

### Incoming Call Webhook

Configure N8N to send incoming call data to your backend:

```javascript
// Example webhook payload
{
  "phone": "+1234567890",
  "callType": "incoming",
  "timestamp": "2025-12-04T18:00:00Z"
}
```

### WhatsApp Message Webhook

```javascript
// Example webhook payload
{
  "from": "+1234567890",
  "message": "Hello, I need to schedule a service",
  "timestamp": "2025-12-04T18:00:00Z"
}
```

## Project Structure

```
Autoflow/
├── src/
│   ├── pages/          # Page components
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── components/         # Reusable components
├── entities/           # Data entities
├── pages/              # Legacy page components
├── Layout.js           # App layout wrapper
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── package.json        # Dependencies
```

## Contributing

This is a private project for BC Performance workshop management.

## License

Private - All rights reserved
