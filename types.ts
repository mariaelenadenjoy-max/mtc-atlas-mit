
export interface AcupuncturePoint {
  id: string;
  name: string;
  pinyin: string;
  meridian: string;
  meridianName: string;
  location: string;
  indications: string[];
  contraindications: string[];
  applications: string;
  benefits: string; // Acciones y Beneficios Energéticos
  techniques: string;
  observations: string;
  category?: string;
  staticImage?: string; // Para usar las imágenes proporcionadas
}

export interface SearchResult {
  points: AcupuncturePoint[];
  explanation: string;
}

export enum MeridianCode {
  LU = 'LU', // Pulmón
  LI = 'LI', // Intestino Grueso
  ST = 'ST', // Estómago
  SP = 'SP', // Bazo
  HT = 'HT', // Corazón
  SI = 'SI', // Intestino Delgado
  BL = 'BL', // Vejiga
  KI = 'KI', // Riñón
  PC = 'PC', // Pericardio
  SJ = 'SJ', // San Jiao
  GB = 'GB', // Vesícula Biliar
  LR = 'LR', // Hígado
  GV = 'GV', // Du Mai
  CV = 'CV', // Ren Mai
}
