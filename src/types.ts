export interface Teacher {
  id: string;
  name: string;
  qualification: string;
  subject: string;
  bio: string;
  photoUrl?: string; // Could be base64, external URL, or storage path
  createdAt?: any;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  fee: string;
  createdAt?: any;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  description: string;
  link?: string;
  createdAt?: any;
}

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  category: string;
  createdAt?: any;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  createdAt?: any;
}

export interface SiteSettings {
  id: string;
  instituteName: string;
  tagline: string;
  aboutText: string;
  missionText: string;
  visionText: string;
  historyText: string;
  email: string;
  contactNo: string;
  whatsappLink: string;
  address: string;
  stats: {
    teachers: number;
    courses: number;
    experience: number;
    students: number;
  };
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
