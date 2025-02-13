export interface ProfessionalProfile {
    id: number;
    native_languages: string;
    education: string;
    degree: string;
    employment_status: string;
    experience: string;
    softwares: string;
    translator: number;
}

export interface LanguageCombination {
    id: number;
    source_language: string;
    target_language: string;
    services: string;
    text_types: string;
    price_per_word: string;
    sworn_price_per_word: string | null;
    price_per_hour: string | null;
    translator: number;
}

export interface Translator {
    id: number;
    professional_profile: ProfessionalProfile;
    language_combination: LanguageCombination[];
    password: string;
    last_login: string;
    is_superuser: boolean;
    email: string;
    first_name: string;
    last_name: string;
    address: string;
    postal_code: number;
    province: string;
    country: string;
    gender: string;
    mobile_phone: string;
    birth_date: string;
    registration_date: string;
    last_access: string;
    is_active: boolean;
    is_staff: boolean;
    groups: any[];
    user_permissions: any[];
}