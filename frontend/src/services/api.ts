const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';



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
  const token = localStorage.getItem('auth_token'); // toujours frais
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Token ${token}`;
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
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
async createComplaint(complaintData: ComplaintData, attachments: File[]): Promise<any> {
  const formData = new FormData();

  // Ajout de toutes les données
  Object.entries(complaintData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  // Fichiers joints
  if (complaintData.attachments) {
    complaintData.attachments.forEach(file => {
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
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
  }

  const url = `${API_BASE_URL}/complaints/${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  const response = await fetch(url, {
    headers: this.getHeaders(),
  });

  return this.handleResponse<PaginatedResponse<any>>(response);
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


  // ---------------- Statistics ---------------- //
async getStatistics(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/reports/statistics/`, {
    headers: this.getHeaders(),
  });
  return this.handleResponse(response);
}

async getCrimeByRegion(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/reports/statistics/regions/`, {
    headers: this.getHeaders(),
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
