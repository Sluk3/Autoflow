// N8N API Client - Sostituisce Base44
const N8N_BASE_URL = 'https://n8n.srv1041062.hstgr.cloud/webhook';
const API_KEY = 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance';

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY
};

class EntityAPI {
  constructor(entityName, webhookId) {
    this.entityName = entityName;
    this.webhookId = webhookId;
  }

  async list(sort) {
    try {
      const response = await fetch(`${N8N_BASE_URL}/${this.webhookId}`, { headers });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Error fetching ${this.entityName}:`, error);
      return [];
    }
  }

  async get(id) {
    try {
      const response = await fetch(`${N8N_BASE_URL}/${this.webhookId}/${id}`, { headers });
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${this.entityName} ${id}:`, error);
      return null;
    }
  }

  async create(data) {
    try {
      const response = await fetch(`${N8N_BASE_URL}/${this.webhookId}`, {
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
      const response = await fetch(`${N8N_BASE_URL}/${this.webhookId}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error(`Error updating ${this.entityName}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await fetch(`${N8N_BASE_URL}/${this.webhookId}/${id}`, {
        method: 'DELETE',
        headers
      });
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.entityName}:`, error);
      throw error;
    }
  }
}

// Mock auth per sostituire base44.auth
const auth = {
  me: async () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  login: async (email, password) => {
    // Simulazione login - in produzione chiamerebbe N8N
    const user = {
      email,
      full_name: email.split('@')[0],
      id: '1'
    };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('auth_token', 'demo_token');
    return user;
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
    Customer: new EntityAPI('Customer', 'customers'),
    CustomerVehicle: new EntityAPI('CustomerVehicle', 'vehicles'),
    WorkLog: new EntityAPI('WorkLog', 'workorders'),
    CallLog: new EntityAPI('CallLog', 'calllogs'),
  }
};

export default base44;
