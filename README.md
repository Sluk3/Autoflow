# BC Performance - AutoFlow Pro

## AI Receptionist Management System

BC Performance AutoFlow Pro is a comprehensive workshop management system with integrated AI receptionist capabilities using ElevenLabs for voice calls and WhatsApp integration through N8N webhooks.

## 🚀 Features

### Core Management

- 🎯 **Dashboard** - Real-time overview of workshop statistics, performance metrics, and recent activities
- 👥 **Customer Management** - Complete customer database with contact information and service history
- 🚗 **Vehicle Management** - Register, track, and monitor customer vehicles with detailed specifications
- 🔧 **Work Orders** - Create, update, and manage repair jobs with status tracking and cost management
- 📞 **Call Logs** - AI-powered call management and logging with ElevenLabs integration
- 📊 **Vehicle Catalog** - Comprehensive searchable database of vehicle makes, models, and specifications

### User Management & Security

- 👤 **User Management** (Admin only)
  - Create, edit, and delete user accounts
  - Role-based access control (Admin/User)
  - SHA-256 encrypted passwords
  - User activity tracking
  - Admin-initiated password reset

- 🔐 **Authentication & Security**
  - Secure login with SHA-256 password hashing
  - Role-based authorization
  - Protected routes and admin-only pages
  - Session management
  - "Forgot Password" self-service flow
  - Email-based password reset with 5-minute expiry tokens

### AI Receptionist

- 🤖 **Voice Call Handling**
  - ElevenLabs AI voice integration
  - Automated call answering and routing
  - Natural language understanding
  - Call transcription and logging

- 💬 **WhatsApp Integration**
  - Automated message responses
  - Appointment scheduling via WhatsApp
  - Customer inquiry handling
  - Message logging and history

### Automation

- ⚡ **N8N Webhooks Integration**
  - Real-time data synchronization
  - Automated workflow triggers
  - Email notifications
  - Third-party service integration

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS with glass-morphism effects
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **UI Components**: Custom components with glass-morphism design

### Backend & Services
- **Database**: PostgreSQL (via N8N webhooks)
- **Authentication**: Custom JWT-based auth via N8N
- **API Layer**: N8N webhook endpoints
- **Password Security**: SHA-256 hashing

### AI & Automation
- **Voice AI**: ElevenLabs API
- **Automation**: N8N workflows and webhooks
- **Messaging**: WhatsApp Business API integration

## 📋 Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- N8N instance (self-hosted or cloud)
- PostgreSQL database
- ElevenLabs API key (for AI calls)
- WhatsApp Business API access

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
# N8N Configuration
VITE_N8N_BASE_URL=https://n8n.srv1041062.hstgr.cloud/webhook
VITE_N8N_API_KEY=your_api_key_here

# Webhook IDs
VITE_N8N_LOGIN_WEBHOOK=703f6db5-8415-4bbe-86c3-dfcacf992f90
VITE_N8N_USERS_LIST=ab4804f8-0aa2-401e-9c53-f7a4097e51be
VITE_N8N_USERS_CREATE=4338f57b-1a22-48c3-ab7b-af7a0edbaadb
VITE_N8N_USERS_UPDATE=b7942b35-296d-4c85-b4a8-2b603a782dad
VITE_N8N_USERS_DELETE=08e40c7c-f1f1-4ffc-9bc8-230b5ed05dba
VITE_N8N_PASSWORD_RESET=e79143b3-3aed-4965-80fd-7a1fabf78171

# ElevenLabs Configuration
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### 4. Database Schema

Run these SQL commands in your PostgreSQL database:

```sql
-- Create users table
CREATE TABLE users_webapp (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  pwd VARCHAR(255) NOT NULL,
  fullname VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vehicles table
CREATE TABLE customer_vehicles (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  make VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  plate VARCHAR(50),
  vin VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create work orders table
CREATE TABLE work_logs (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES customer_vehicles(id),
  customer_id INTEGER REFERENCES customers(id),
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  total_cost DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create call logs table (for AI receptionist)
CREATE TABLE call_logs (
  id SERIAL PRIMARY KEY,
  customer_phone VARCHAR(50),
  call_type VARCHAR(50),
  transcript TEXT,
  duration INTEGER,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create password reset tokens table
CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  new_password_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users_webapp(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_vehicles_customer ON customer_vehicles(customer_id);
CREATE INDEX idx_work_logs_vehicle ON work_logs(vehicle_id);
CREATE INDEX idx_password_tokens_token ON password_reset_tokens(token);
```

### 5. N8N Workflows Setup

You need to create the following N8N workflows:

#### Authentication Workflow
- **Login**: Validates email and SHA-256 password hash
- **Password Reset**: Generates token, sends email, and updates password on confirmation

#### CRUD Workflows (per entity)
- **List**: GET endpoint to retrieve all records
- **Create**: POST endpoint to create new records
- **Update**: POST endpoint to update existing records
- **Delete**: POST endpoint to delete records

Entities requiring CRUD workflows:
- Users
- Customers
- Vehicles
- Work Orders
- Call Logs

### 6. Run the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 🔌 API Integration

### Authentication

```javascript
// Login
POST /webhook/703f6db5-8415-4bbe-86c3-dfcacf992f90
Body: { email, password_hash }
Response: { id, email, fullname, role, token }

// Password Reset Request
POST /webhook/e79143b3-3aed-4965-80fd-7a1fabf78171
Body: { email, pwd }
Response: { success: true }
```

### User Management

```javascript
// List Users
GET /webhook/ab4804f8-0aa2-401e-9c53-f7a4097e51be

// Create User
POST /webhook/4338f57b-1a22-48c3-ab7b-af7a0edbaadb
Body: { email, pwd, fullname, role }

// Update User
POST /webhook/b7942b35-296d-4c85-b4a8-2b603a782dad
Body: { user_id, email?, fullname?, role?, pwd? }

// Delete User
POST /webhook/08e40c7c-f1f1-4ffc-9bc8-230b5ed05dba
Body: { user_id }
```

## 📁 Project Structure

```
Autoflow/
├── src/
│   ├── api/
│   │   └── n8nClient.js        # N8N API client
│   ├── components/
│   │   ├── shared/             # Reusable components
│   │   └── ui/                 # UI components
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── ForgotPassword.jsx  # Password reset page
│   │   ├── Dashboard.jsx       # Dashboard
│   │   ├── UserManagement.jsx  # User management (admin)
│   │   ├── Customers.jsx       # Customer management
│   │   ├── Vehicles.jsx        # Vehicle management
│   │   ├── WorkOrders.jsx      # Work order management
│   │   ├── CallLogs.jsx        # Call logs
│   │   └── VehicleCatalog.jsx  # Vehicle catalog
│   ├── utils/
│   │   └── crypto.js           # SHA-256 hashing utility
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── pages/                      # Legacy pages (being migrated)
├── components/                 # Legacy components
├── Layout.jsx                  # App layout wrapper
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using SHA-256 before storage
- **Role-Based Access Control**: Admin and User roles with different permissions
- **Protected Routes**: Authentication required for all internal pages
- **Session Management**: Secure token-based authentication
- **Password Reset Flow**: Time-limited tokens (5 minutes) for password reset
- **API Key Protection**: All N8N webhooks protected with API key authentication

## 🎨 Design System

- **Glass-morphism UI**: Modern frosted glass effect throughout
- **Color Scheme**: Dark theme with blue/purple gradients
- **Responsive Design**: Mobile-first approach with breakpoints
- **Icon System**: Lucide React for consistent iconography
- **Typography**: Clear hierarchy with custom font sizes

## 🤝 Contributing

This is a private project for BC Performance. For access or contributions, please contact the repository owner.

## 📄 License

Private - All rights reserved © 2025 BC Performance

## 📧 Support

For issues or questions, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Maintained by**: BC Performance Development Team
