export interface User {
  id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  role: 'citizen' | 'authority' | 'admin' | 'moderator';
  department?: 'cdp' | 'dsc' | 'police' | 'gendarmerie' | 'justice' | 'customs' | 'cybercrime';
  badge_number?: string;
  jurisdiction_region?: string;
  jurisdiction_department?: string;
  is_anonymous?: boolean;
  preferred_language: 'fr' | 'wo';
  created_at: string;
  updated_at: string;
}

export interface CrimeCategory {
  id: string;
  name_fr: string;
  name_wo: string;
  description_fr?: string;
  description_wo?: string;
  priority_level: 'low' | 'medium' | 'high' | 'urgent';
  color: string;
  icon: string;
  requires_specification?: boolean;
  created_at: string;
}

export interface CrimeReport {
  media_files: any;
  voice_report: any;
  id: string;
  user_id?: string;
  name: string;
  category_id: string;
  category?: number; // Ajout pour compatibilité avec le backend
  title: string;
  description: string;
  location_text?: string;
  latitude?: number;
  longitude?: number;
  region: string;
  department?: string;
  commune?: string;
  incident_date: string;
  incident_time?: string;
  status: 'submitted' | 'reviewing' | 'investigating' | 'forwarded' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_anonymous: boolean;
  contact_allowed: boolean;
  language: 'fr' | 'wo';
  created_at: string;
  updated_at: string;
  assigned_authority_id?: string;
}

export interface ReportMedia {
  id: string;
  report_id: string;
  media_type: 'image' | 'video' | 'audio' | 'document';
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  transcription?: string;
  created_at: string;
}

export interface VoiceReport {
  id: string;
  report_id: string;
  audio_url: string;
  duration_seconds: number;
  transcription_fr?: string;
  transcription_wo?: string;
  transcription_confidence: number;
  created_at: string;
}

export interface ReportStatus {
  id: string;
  report_id: string;
  status: CrimeReport['status'];
  comment?: string;
  updated_by: string;
  created_at: string;
}

export interface Authority {
  id: string;
  user_id: string;
  department: 'cdp' | 'dsc' | 'police' | 'gendarmerie' | 'justice' | 'customs' | 'cybercrime';
  jurisdiction_region?: string;
  jurisdiction_department?: string;
  badge_number?: string;
  is_active: boolean;
  created_at: string;
}

export interface Complaint {
  id: string;
  user_id?: string;
  category?: number; // Ajout pour la classification par département
  facts: string;
  lawyer_name?: string;
  lawyer_address?: string;
  complaint_date: string;
  complaint_city: string;
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
  status: 'submitted' | 'reviewing' | 'investigating' | 'forwarded' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  assigned_authority_id?: string;
}

export interface EmergencyContact {
  id: string;
  name_fr: string;
  name_wo: string;
  phone_number: string;
  department: string;
  description_fr?: string;
  description_wo?: string;
  is_active: boolean;
  sort_order: number;
}