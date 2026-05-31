export interface Translator {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  postal_code: string;
  province: string;
  country: string;
  gender: string;
  registration_date: string
  last_access: string
  mobile_phone: string
  professional_profile: ProfessionalProfile;   
  language_combination: LanguageCombination[];
  files: {
      cv_file?: string; 
      voice_note?: string; 
  }   
  approved_combinations?: LanguageCombinationApproval[]; // Añade esta línea   
}


export interface ProfessionalProfile {
  native_languages: string;
  education: string;
  experience: string;
  softwares: string;
}

export interface LanguageCombination {
  id: number;
  source_language: string;
  target_language: string;
  services: string;
  text_types: string;
  price_per_word: number;
  sworn_price_per_word?: number;
  price_per_hour?: number;}

export interface LanguageCombinationApproval {
  id: number;
  superuser: number;
  superuser_email: string;
  translator: number;
  translator_name: string;
  language_combination: number;
  combination_details: string;
  approved_at: string;
  is_approved: boolean;
  notes: string;
}

export interface ApprovedCombinationsResponse {
    success: boolean;
    count: number;
    data: LanguageCombinationApproval[];
}

export interface Language {
    code: string;
    name: string;
}

export interface AvailableLanguagesResponse {
    success: boolean;
    source_languages: Language[];
    target_languages: Language[];
    total_sources: number;
    total_targets: number;
}

export interface DashboardStats {
    total_translators: number;
    active_translators: number;
    total_combinations: number;
    total_approved_combinations: number;
    total_saved_queries: number;
    popular_language_pairs: Array<{ pair: string; count: number }>;
    recent_queries: Array<{ id: number; name: string; created_at: string }>;    
}

export interface Field {
  name: string;
  model: string;
  type: string;
  verbose_name?: string;
  choices?: [string, string][];
}

export interface Condition {
  model: string;
  field: string;
  operator: string;
  value: string;
  logical: string;
  fieldType: string;
  choices: [string, string][] | null;
}

export interface QueryCondition {
  logical: string | null;
  model: string;
  field: string;
  operator: string;
  value: string;
}

export interface Query {
  id: string;
  name: string;
  created_at: string | number | Date;
  query: QueryCondition[]; 
}

export interface ApiResponse<T> {
  success?: boolean;
  queries?: never[];
  data?: T;
  message?: string;
  status?: number;
  error?: string;
}

// Tipo para la respuesta de autenticación
export interface AuthResponse {
  access_token: string; // Token JWT
  refresh_token?: string; // Token de refresco (opcional)
  user: { // Información de usuario
    name: string;
    email: string;
  };  
}


export interface ResultRow {
  Translator: Translator;
  ProfessionalProfile: ProfessionalProfile;
  LanguageCombination: LanguageCombination[];
}


export interface ExportRow {
  [key: string]: string | undefined;
}

export type ProcessedRow = {
  [columnKey: string]: string | LanguageCombination[] | undefined;
  LanguageCombination?: LanguageCombination[];
};

export interface FieldMapping {
  [key: string]: {
    [key: string]: string;
  };
}



