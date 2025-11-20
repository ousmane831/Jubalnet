const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                     (window.location.hostname === 'localhost' 
                        ? 'http://localhost:8000/api' 
                        : 'http://10.121.221.230:8001/api');

console.log('API Base URL:', API_BASE_URL);

// ---------------- Types ---------------- //
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role: string;
    is_anonymous: boolean;
    preferred_language: string;
  };
  token: string;
  message: string;
}

export interface CrimeReportData {
  category: number;
  title: string;
  description: string;
  other_crime_specification?: string;
  location_text?: string;
  latitude?: number;
  longitude?: number;
  region: string;
  department?: string;
  commune?: string;
  incident_date: string;
  incident_time?: string;
  priority: string;
  is_anonymous: boolean;
  contact_allowed: boolean;
  language: string;
}

// Structure pour la pagination Django REST
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export interface ComplaintData {
  plaintiff_first_name: string;
  plaintiff_last_name: string;
  plaintiff_birth_date: string;
  plaintiff_birth_place: string;
  plaintiff_nationality: string;
  plaintiff_address: string;
  plaintiff_city: string;
  plaintiff_postal_code: string;

  defendant_first_name?: string;
  defendant_last_name?: string;
  defendant_birth_date?: string;
  defendant_birth_place?: string;
  defendant_nationality?: string;
  defendant_address?: string;
  defendant_city?: string;
  defendant_postal_code?: string;
  defendant_unknown: boolean;

  facts: string;
  lawyer_name?: string;
  lawyer_address?: string;
  complaint_date: string;
  complaint_city: string;

  // facultatif : fichiers joints
  attachments?: File[];
}
// ---------------- Service ---------------- //
class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    console.log('Token from localStorage:', token ? 'PRESENT' : 'MISSING');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Token ${token}`;
      console.log('Authorization header set with token');
    } else {
      console.warn('No auth token found in localStorage');
    }
    
    return headers;
  }


  private getMultipartHeaders(): HeadersInit {
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorDetails: any = {};
      
      try {
        // Essayer d'extraire le message d'erreur de la réponse
        const errorData = await response.json().catch(() => ({}));
        errorDetails = errorData;
        
        // Si la réponse contient un message d'erreur, l'utiliser
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors.join(', ');
        } else if (typeof errorData === 'object') {
          // Si c'est un objet, essayer d'afficher les erreurs de champ
          const fieldErrors = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          if (fieldErrors) errorMessage = fieldErrors;
        }
        
        console.error('API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          error: errorData
        });
      } catch (e) {
        console.error('Could not parse error response as JSON:', e);
      }
      
      const error = new Error(errorMessage) as any;
      error.status = response.status;
      error.details = errorDetails;
      throw error;
    }
    
    try {
      return await response.json();
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      throw new Error('Erreur lors de la lecture de la réponse du serveur');
    }
  }

  // ---------------- Auth ---------------- //
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse<LoginResponse>(response);
    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async register(userData: {
    email: string;
    password: string;
    confirm_password: string;
    full_name: string;
    phone?: string;
    preferred_language: string;
  }): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await this.handleResponse<LoginResponse>(response);
    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return data;
  }

  async loginAnonymous(language: string = 'fr'): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/anonymous-login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // juste le content-type
    body: JSON.stringify({ language }),
  });

  const data = await this.handleResponse<LoginResponse>(response);
  this.token = data.token;
  localStorage.setItem('auth_token', data.token);
  return data;
}


  async logout(): Promise<void> {
    if (this.token) {
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
    }
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async getProfile(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // ---------------- Crime Categories ---------------- //
  async getCategories(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/categories/`, {
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse<PaginatedResponse<any>>(response);
    return data.results ?? [];
  }

  // ---------------- Crime Reports ---------------- //
  async createReport(
    reportData: CrimeReportData,
    files?: File[],
    audioFile?: File
  ): Promise<any> {
    const formData = new FormData();

    // Ajout des données
    Object.entries(reportData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Ajout des fichiers
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append(`files`, file);
      });
    }

    // Ajout audio
    if (audioFile) {
      formData.append('audio_file', audioFile);
    }

    const response = await fetch(`${API_BASE_URL}/reports/`, {
      method: 'POST',
      headers: this.getMultipartHeaders(),
      body: formData,
    });

    return this.handleResponse(response);
  }

  async getReports(params?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
  }): Promise<PaginatedResponse<any>> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }

    const url = `${API_BASE_URL}/reports/${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    return this.handleResponse<PaginatedResponse<any>>(response);
  }

  async getUserReports(): Promise<PaginatedResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/reports/my-reports/`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<PaginatedResponse<any>>(response);
  }

  async getReport(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/reports/${id}/`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateReportStatus(reportId: string, status: string, comment?: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/update-status/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, comment }),
    });
    return this.handleResponse(response);
  }

// ---------------- Complaints ---------------- //
async createComplaint(complaintData: ComplaintData, attachments: File[] = []): Promise<any> {
  const formData = new FormData();

  // Ajout de toutes les données
  Object.entries(complaintData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  // Fichiers joints
  if (attachments) {
    attachments.forEach(file => {
      formData.append("attachments", file);
    });
  }

  // Requête vers l’API avec token pour submitted_by
  const response = await fetch(`${API_BASE_URL}/complaints/`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${localStorage.getItem('auth_token') || ''}`,
      // ne PAS mettre Content-Type ici pour FormData
    },
    body: formData,
  });

  return this.handleResponse(response);
}


async getComplaints(params?: {
  status?: string;
  search?: string;
  page?: number;
}): Promise<PaginatedResponse<any>> {
  try {
    console.log('Début de la récupération des plaintes avec les paramètres:', params);
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/complaints/${queryString ? '?' + queryString : ''}`;
    
    console.log('URL de la requête:', url);
    
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    console.log('Réponse reçue, statut:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erreur lors de la récupération des plaintes:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        error: errorData
      });
    }

    const data = await this.handleResponse<PaginatedResponse<any>>(response);
    console.log('Données des plaintes reçues:', data);
    return data;
  } catch (error) {
    console.error('Erreur dans getComplaints:', error);
    throw error;
  }
}

async getComplaint(id: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/complaints/${id}/`, {
    headers: this.getHeaders(),
  });
  return this.handleResponse(response);
}

async updateComplaintStatus(complaintId: string, status: string, comment?: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/update-status/`, {
    method: 'POST',
    headers: this.getHeaders(),
    body: JSON.stringify({ status, comment }),
  });
  return this.handleResponse(response);
}

// ---------------- Complaint Messages ---------------- //
async getComplaintMessages(complaintId: string): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/messages/`, {
    headers: this.getHeaders(),
  });
  return this.handleResponse<any[]>(response);
}

async sendComplaintMessage(complaintId: string, message: string): Promise<any> {
  const formData = new FormData();
  formData.append('message', message);
  formData.append('complaint', complaintId); // Ajout de l'ID de la plainte
  
  const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/messages/`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${this.token}`
      // Ne pas définir Content-Type, il sera défini automatiquement avec la bonne boundary
    },
    body: formData
  });
  return this.handleResponse(response);
}

async markComplaintMessagesRead(complaintId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/mark_messages_read/`, {
    method: 'POST',
    headers: this.getHeaders(),
  });
  return this.handleResponse(response);
}


  // ---------------- Statistics ---------------- //
async getStatistics(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/reports/statistics/`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return this.handleResponse(response);
}

async getCrimeByRegion(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/reports/statistics/regions/`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return this.handleResponse<any[]>(response);
}
  
  // ---------------- Emergency Contacts ---------------- //
  async getEmergencyContacts(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/auth/emergency-contacts/`);
    return this.handleResponse<any[]>(response);
  }

  // ---------------- Notifications ---------------- //
  async getNotifications(): Promise<PaginatedResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/notifications/`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<PaginatedResponse<any>>(response);
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/notifications/${notificationId}/read/`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
  }

  async markAllNotificationsRead(): Promise<void> {
    await fetch(`${API_BASE_URL}/notifications/mark-all-read/`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
  }

  // ---------------- User Management (Admin only) ---------------- //
async getUsers(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/auth/users/`, {
    headers: this.getHeaders(),
  });
  return this.handleResponse<any[]>(response);
}

async updateUserRole(userId: string, role: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/update-role/`, {
    method: "POST",
    headers: this.getHeaders(),
    body: JSON.stringify({ role }),
  });
  return this.handleResponse<any>(response);
}




}

export const apiService = new ApiService();
