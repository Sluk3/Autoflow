// N8N API Client - Sostituisce Base44
import { hashPassword } from '../utils/crypto';

const N8N_BASE_URL = 'https://n8n.srv1041062.hstgr.cloud/webhook';
const API_KEY = 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance';

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY
};

class EntityAPI {
  constructor(entityName, webhookIds) {
    this.entityName = entityName;
    this.webhookIds = webhookIds;
  }

  async list(sort) {
    const url = `${N8N_BASE_URL}/${this.webhookIds.list}`;
    console.log(`🌐 [${this.entityName}] Fetching from:`, url);
    console.log(`🔑 Headers:`, headers);
    
    try {
      const response = await fetch(url, { 
        method: 'GET',
        headers 
      });
      
      console.log(`📡 [${this.entityName}] Response status:`, response.status, response.statusText);
      console.log(`📡 [${this.entityName}] Response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [${this.entityName}] HTTP Error:`, response.status, errorText);
        return [];
      }
      
      const data = await response.json();
      console.log(`✅ [${this.entityName}] Data received:`, data);
      console.log(`📊 [${this.entityName}] Is array?`, Array.isArray(data));
      console.log(`📊 [${this.entityName}] Length:`, data?.length);
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`💥 [${this.entityName}] Exception:`, error);
      console.error(`💥 [${this.entityName}] Error details:`, {
        message: error.message,
        stack: error.stack
      });
      return [];
    }
  }

  async get(id) {
    try {
      const response = await fetch(`${N8N_BASE_URL}/${this.webhookIds.list}/${id}`, { headers });
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${this.entityName} ${id}:`, error);
      return null;
    }
  }

  async create(data) {
    try {
      const response = await fetch(`${N8N_BASE_URL}/${this.webhookIds.create}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error(`Error creating ${this.entityName}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const response = await fetch(`${N8N_BASE_URL}/${this.webhookIds.update}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ [`${this.entityName.toLowerCase()}_id`]: id, ...data })
      });
      return await response.json();
    } catch (error) {
      console.error(`Error updating ${this.entityName}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${N8N_BASE_URL}/${this.webhookIds.delete}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ [`${this.entityName.toLowerCase()}_id`]: id })
      });
      return await response.json();
    } catch (error) {
      console.error(`Error deleting ${this.entityName}:`, error);
      throw error;
    }
  }
}

// Auth API con webhook reali e SHA-256
const auth = {
  me: async () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  login: async (email, password) => {
    try {
      // Hash password with SHA-256 before sending
      const passwordHash = await hashPassword(password);
      
      const response = await fetch(`${N8N_BASE_URL}/703f6db5-8415-4bbe-86c3-dfcacf992f90`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password_hash: passwordHash })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('auth_token', userData.token || 'authenticated');
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  },
  
  redirectToLogin: (returnUrl) => {
    window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  }
};

// Export in formato compatibile con Base44
export const base44 = {
  auth,
  entities: {
    // Users webhooks
    User: new EntityAPI('User', {
      list: 'ab4804f8-0aa2-401e-9c53-f7a4097e51be',
      create: '4338f57b-1a22-48c3-ab7b-af7a0edbaadb',
      update: 'b7942b35-296d-4c85-b4a8-2b603a782dad',
      delete: '08e40c7c-f1f1-4ffc-9bc8-230b5ed05dba'
    }),
    // Customers webhooks
    Customer: new EntityAPI('Customer', {
      list: '5917132c-5c5a-4d35-b493-6062989ee46a',
      create: 'f7a0c555-e94b-419a-a699-a05120727949',
      update: '6a891e44-1c12-4ffb-aefc-1dcedc13fcd0'
    }),
    // Vehicles webhooks
    CustomerVehicle: new EntityAPI('Vehicle', {
      list: '5917132c-5c5a-4d35-b493-6012989ee46a',
      create: 'ca4bf509-dee1-4241-b9ff-0aeb71e4ad93',
      update: 'd506400d-4934-4bd6-a734-38ad303dd1f4'
    }),
    // Work Orders webhooks
    WorkLog: new EntityAPI('Work', {
      list: 'bf0b516d-cc4c-43c5-8bf6-bc622cf30674',
      create: 'e7b36266-8089-4337-932a-831a3318f559',
      update: '1119f46b-3686-4985-82f1-4da16dee66de'
    }),
    // Call Logs webhooks
    CallLog: new EntityAPI('Call', {
      list: '220571c6-1906-441d-8f40-1ea3739181fe',
      create: '220571c6-1906-441d-8f40-1ea3739181fe',
      update: '220571c6-1906-441d-8f40-1ea3739181fe'
    }),
  }
};

export default base44;
