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
    professional_profile: {
        native_languages: string;
        education: string;
        experience: string;
        softwares: string;
    };
    files: {
        cv_file?: string; 
        voice_note?: string; 
    }   
    language_combination: Array<{
        id: number;
        source_language: string;
        target_language: string;
        services: string;
        text_types: string;
        price_per_word: number;
        sworn_price_per_word?: number;
        price_per_hour?: number;
    }>;
}