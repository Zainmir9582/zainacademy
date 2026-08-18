import { isFirebaseConfigured, firebaseConfig } from "./config";
import { 
  Teacher, 
  Course, 
  Notice, 
  GalleryImage, 
  ContactMessage, 
  SiteSettings 
} from "../types";

// Firebase Imports
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  getDocFromServer
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";

// --- FIRBASE ERROR HANDLING (from firebase-integration skill) ---
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentAuth = isFirebaseConfigured() ? getAuth() : null;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth?.currentUser?.uid || null,
      email: currentAuth?.currentUser?.email || null,
      emailVerified: currentAuth?.currentUser?.emailVerified || null,
      isAnonymous: currentAuth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initialize Firebase only if configured
let firebaseApp;
let firestoreDb: any = null;
let firebaseAuth: any = null;
let firebaseStorage: any = null;

const FIREBASE_ACTIVE = isFirebaseConfigured();

if (FIREBASE_ACTIVE) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firestoreDb = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
    
    // Test the connection as instructed by the skill
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(firestoreDb, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export { firestoreDb as db, firebaseAuth as auth, firebaseStorage as storage, FIREBASE_ACTIVE };

// --- SEED DATA DEFINITIONS ---
const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "prof_mir_rizwan_ali",
    name: "Prof. Mir Rizwan Ali",
    qualification: "M.A (Urdu and English)",
    subject: "Urdu & English Literature",
    bio: "An outstanding academic with over 20 years of experience in language pedagogy, fostering deep appreciation for classical Urdu and English literature.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "prof_afnan_tayyab",
    name: "Prof. Afnan Tayyab",
    qualification: "M.Phil Mathematics",
    subject: "Mathematics",
    bio: "Passionate mathematician specialized in advanced algebraic models and calculus. Known for making complex mathematical concepts accessible and engaging.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "prof_zain_ul_abideen",
    name: "Prof. Zain ul Abideen",
    qualification: "BS (Information Technology)",
    subject: "Information Technology",
    bio: "Full-stack technology strategist and researcher. Promotes coding literacy, computer systems engineering, and practical web design among students.",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "prof_saad_rizwan_mir",
    name: "Prof. Saad Rizwan Mir",
    qualification: "D. Pharmacist",
    subject: "Biology & Chemistry",
    bio: "Doctor of Pharmacy with a commitment to pure sciences. Teaches organic biochemistry and cell physiology with experimental lab integrations.",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80"
  }
];

const INITIAL_COURSES: Course[] = [
  {
    id: "class_1_8",
    title: "(1 to 8)",
    description: "Solid foundations in core disciplines including General Science, Mathematics, English, Urdu, and Social Studies designed to build analytical skills.",
    duration: "",
    fee: ""
  },
  {
    id: "pre_9_sci",
    title: "Pre-9th (Sci)",
    description: "Foundational preparation for the science group. Includes early focus on science subjects and basic concepts to excel in the upcoming matriculation board syllabus.",
    duration: "",
    fee: ""
  },
  {
    id: "pre_9_arts",
    title: "pre-9th (Arts)",
    description: "Pre-matriculation preparation for the humanities and arts group. Focuses on core subjects and general arts/computer fundamentals.",
    duration: "",
    fee: ""
  },
  {
    id: "class_9_sci",
    title: "9th (Sci)",
    description: "Focused matriculation study for 9th class Science group following board curriculum with intense practice in critical subjects.",
    duration: "",
    fee: ""
  },
  {
    id: "class_9_arts",
    title: "9th (Arts)",
    description: "Focused matriculation study for 9th class Arts group following board guidelines for humanities and vocational basics.",
    duration: "",
    fee: ""
  },
  {
    id: "class_10_sci",
    title: "10th (Sci)",
    description: "Board exam preparation for 10th class Science group. Intensive curriculum mapping and past paper evaluation.",
    duration: "",
    fee: ""
  },
  {
    id: "class_10_arts",
    title: "10th (Arts)",
    description: "Board exam preparation for 10th class Arts group. Dedicated study plans, general science, math, and humanities.",
    duration: "",
    fee: ""
  },
  {
    id: "class_11",
    title: "11th",
    description: "Intermediate Year 1 prep. Prepares students for various board groups including F.Sc Pre-Medical, F.Sc Pre-Engineering, I.CS groups, I.Com, and F.A.",
    duration: "",
    fee: ""
  },
  {
    id: "class_12",
    title: "12th",
    description: "Intermediate Year 2 prep. Advanced course study designed to secure maximum board positions and college admissions.",
    duration: "",
    fee: ""
  }
];

const INITIAL_NOTICES: Notice[] = [
  {
    id: "notice_1",
    title: "Admissions Open for New Session 2026-2027",
    date: "2026-07-01",
    description: "Registration is now open for Science, Pre-Engineering, Pre-Medical, and Information Technology groups. Visit the campus for counselor interviews."
  },
  {
    id: "notice_2",
    title: "Summer Vacation Schedule & Remedial Classes",
    date: "2026-06-25",
    description: "Zain Academy will remain closed for regular lectures during the summer break, but special board-prep remedial sessions will continue daily from 9:00 AM to 12:00 PM."
  }
];

const INITIAL_GALLERY: GalleryImage[] = [
  {
    id: "gallery_1",
    title: "Main Campus Library",
    url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80",
    category: "Campus"
  },
  {
    id: "gallery_2",
    title: "Modern Physics Lab Work",
    url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop&q=80",
    category: "Labs"
  },
  {
    id: "gallery_3",
    title: "Annual Student Award Ceremony",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
    category: "Events"
  }
];

const INITIAL_SETTINGS: SiteSettings = {
  id: "site",
  instituteName: "Zain Academy",
  tagline: "Empowering Minds, Shaping Futures",
  aboutText: "Zain Academy is a premier educational institute dedicated to academic excellence, career-oriented training, and personal development. We provide premium tuition and coaching services with highly experienced faculty, modern infrastructure, and interactive learning environments.",
  missionText: "Our mission is to foster intellectual growth and academic excellence, equipping students with the knowledge and character required to excel in their chosen fields and lead with integrity.",
  visionText: "To be recognized globally as a vanguard of transformative learning, nurturing creative leaders and critical thinkers who contribute positively to society.",
  historyText: "Founded in 2010 by visionary educators, Zain Academy began as a humble tutoring center and has evolved into a comprehensive academy known for delivering outstanding board examination results and IT skills training.",
  email: "zainmir9582@gmail.com",
  contactNo: "+92 304 3881774",
  whatsappLink: "https://whatsapp.com/channel/0029Vaq3TM38KMqhTVhWGO3o",
  address: "nizamabad chownk zafar wal road near Insaf mohibullah hotal, sialkot, pakistan",
  stats: {
    teachers: 4,
    courses: 8,
    experience: 16,
    students: 1200
  }
};

// LocalStorage helpers for Local Mode
function getLocal<T>(key: string, initial: T): T {
  const value = localStorage.getItem(`zain_academy_${key}`);
  if (!value) {
    localStorage.setItem(`zain_academy_${key}`, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(value);
  } catch {
    return initial;
  }
}

function setLocal<T>(key: string, value: T): void {
  localStorage.setItem(`zain_academy_${key}`, JSON.stringify(value));
}

// --- CORE SERVICE IMPLEMENTATIONS ---

export class DataService {
  
  // --- SETTINGS (SINGLETON) ---
  static async getSettings(): Promise<SiteSettings> {
    if (FIREBASE_ACTIVE) {
      const path = "settings/site";
      try {
        const docRef = doc(firestoreDb, "settings", "site");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as SiteSettings;
          let changed = false;
          if (data.address && (data.address.includes("Lahore") || data.address.includes("Sector 5"))) {
            data.address = "nizamabad chownk zafar wal road near Insaf mohibullah hotal, sialkot, pakistan";
            changed = true;
          }
          if (!data.stats) {
            data.stats = INITIAL_SETTINGS.stats;
            changed = true;
          } else if (data.stats.teachers === 12) {
            data.stats.teachers = 4;
            changed = true;
          }
          if (changed) {
            await setDoc(docRef, data, { merge: true });
          }
          return data;
        } else {
          // If Firestore is empty, seed it
          await setDoc(docRef, INITIAL_SETTINGS);
          return INITIAL_SETTINGS;
        }
      } catch (error) {
        return handleFirestoreError(error, OperationType.GET, path);
      }
    } else {
      const data = getLocal<SiteSettings>("settings", INITIAL_SETTINGS);
      let changed = false;
      if (data.address && (data.address.includes("Lahore") || data.address.includes("Sector 5"))) {
        data.address = "nizamabad chownk zafar wal road near Insaf mohibullah hotal, sialkot, pakistan";
        changed = true;
      }
      if (!data.stats) {
        data.stats = INITIAL_SETTINGS.stats;
        changed = true;
      } else if (data.stats.teachers === 12) {
        data.stats.teachers = 4;
        changed = true;
      }
      if (changed) {
        setLocal("settings", data);
      }
      return data;
    }
  }

  static async updateSettings(settings: SiteSettings): Promise<void> {
    if (FIREBASE_ACTIVE) {
      const path = "settings/site";
      try {
        const docRef = doc(firestoreDb, "settings", "site");
        await setDoc(docRef, settings, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      setLocal("settings", settings);
    }
  }

  // --- TEACHERS CRUD ---
  static async getTeachers(): Promise<Teacher[]> {
    if (FIREBASE_ACTIVE) {
      const path = "teachers";
      try {
        const colRef = collection(firestoreDb, "teachers");
        const snap = await getDocs(colRef);
        if (snap.empty) {
          // Seed initial teachers
          for (const teacher of INITIAL_TEACHERS) {
            await setDoc(doc(colRef, teacher.id), teacher);
          }
          return INITIAL_TEACHERS;
        }
        return snap.docs.map(d => ({ ...d.data(), id: d.id }) as Teacher);
      } catch (error) {
        return handleFirestoreError(error, OperationType.LIST, path);
      }
    } else {
      return getLocal<Teacher[]>("teachers", INITIAL_TEACHERS);
    }
  }

  static async saveTeacher(teacher: Teacher): Promise<void> {
    if (FIREBASE_ACTIVE) {
      const path = `teachers/${teacher.id}`;
      try {
        const docRef = doc(firestoreDb, "teachers", teacher.id);
        await setDoc(docRef, teacher);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      const list = await this.getTeachers();
      const existingIdx = list.findIndex(t => t.id === teacher.id);
      if (existingIdx > -1) {
        list[existingIdx] = teacher;
      } else {
        list.push(teacher);
      }
      setLocal("teachers", list);
    }
  }

  static async deleteTeacher(id: string): Promise<void> {
    if (FIREBASE_ACTIVE) {
      const path = `teachers/${id}`;
      try {
        await deleteDoc(doc(firestoreDb, "teachers", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      const list = await this.getTeachers();
      const filtered = list.filter(t => t.id !== id);
      setLocal("teachers", filtered);
    }
  }

  // --- COURSES CRUD ---
  static async getCourses(): Promise<Course[]> {
    if (FIREBASE_ACTIVE) {
      const path = "courses";
      try {
        const colRef = collection(firestoreDb, "courses");
        const snap = await getDocs(colRef);
        // If there's old default data, overwrite it with Zain Academy defaults
        const hasOldData = snap.docs.some(d => d.id === "course_1");
        if (snap.empty || hasOldData) {
          // Delete old if exists
          if (hasOldData) {
            for (const d of snap.docs) {
              await deleteDoc(doc(firestoreDb, "courses", d.id));
            }
          }
          for (const course of INITIAL_COURSES) {
            await setDoc(doc(colRef, course.id), course);
          }
          return INITIAL_COURSES;
        }
        return snap.docs.map(d => ({ ...d.data(), id: d.id }) as Course);
      } catch (error) {
        return handleFirestoreError(error, OperationType.LIST, path);
      }
    } else {
      const stored = getLocal<Course[]>("courses", INITIAL_COURSES);
      // Migrate if old course template is present in local storage
      if (stored.some(c => c.id === "course_1")) {
        setLocal("courses", INITIAL_COURSES);
        return INITIAL_COURSES;
      }
      return stored;
    }
  }

  static async saveCourse(course: Course): Promise<void> {
    if (FIREBASE_ACTIVE) {
      const path = `courses/${course.id}`;
      try {
        await setDoc(doc(firestoreDb, "courses", course.id), course);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      const list = await this.getCourses();
      const idx = list.findIndex(c => c.id === course.id);
      if (idx > -1) {
        list[idx] = course;
      } else {
        list.push(course);
      }
      setLocal("courses", list);
    }
  }

  static async deleteCourse(id: string): Promise<void> {
    if (FIREBASE_ACTIVE) {
      const path = `courses/${id}`;
      try {
        await deleteDoc(doc(firestoreDb, "courses", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      const list = await this.getCourses();
      const filtered = list.filter(c => c.id !== id);
      setLocal("courses", filtered);
    }
  }

  // --- NOTICES CRUD ---
  static async getNotices(): Promise<Notice[]> {
    if (FIREBASE_ACTIVE) {
      const path = "notices";
      try {
        const colRef = collection(firestoreDb, "notices");
        const snap = await getDocs(colRef);
        if (snap.empty) {
          for (const notice of INITIAL_NOTICES) {
            await setDoc(doc(colRef, notice.id), notice);
          }
          return [...INITIAL_NOTICES].sort((a, b) => b.date.localeCompare(a.date));
        }
        const notices = snap.docs.map(d => ({ ...d.data(), id: d.id }) as Notice);
        return notices.sort((a, b) => b.date.localeCompare(a.date));
      } catch (error) {
        return handleFirestoreError(error, OperationType.LIST, path);
      }
    } else {
      const notices = getLocal<Notice[]>("notices", INITIAL_NOTICES);
      return notices.sort((a, b) => b.date.localeCompare(a.date));
    }
  }

  static async saveNotice(notice: Notice): Promise<void> {
    if (FIREBASE_ACTIVE) {
      const path = `notices/${notice.id}`;
      try {
        await setDoc(doc(firestoreDb, "notices", notice.id), notice);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      const list = await this.getNotices();
      const idx = list.findIndex(n => n.id === notice.id);
      if (idx > -1) {
        list[idx] = notice;
      } else {
        list.push(notice);
      }
      setLocal("notices", list);
    }
  }

  static async deleteNotice(id: string): Promise<void> {
    if (FIREBASE_ACTIVE) {
      const path = `notices/${id}`;
      try {
        await deleteDoc(doc(firestoreDb, "notices", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      const list = await this.getNotices();
      const filtered = list.filter(n => n.id !== id);
      setLocal("notices", filtered);
    }
  }

  // --- GALLERY CRUD ---
  static async getGallery(): Promise<GalleryImage[]> {
    if (FIREBASE_ACTIVE) {
      const path = "gallery";
      try {
        const colRef = collection(firestoreDb, "gallery");
        const snap = await getDocs(colRef);
        if (snap.empty) {
          for (const img of INITIAL_GALLERY) {
            await setDoc(doc(colRef, img.id), img);
          }
          return INITIAL_GALLERY;
        }
        return snap.docs.map(d => ({ ...d.data(), id: d.id }) as GalleryImage);
      } catch (error) {
        return handleFirestoreError(error, OperationType.LIST, path);
      }
    } else {
      return getLocal<GalleryImage[]>("gallery", INITIAL_GALLERY);
    }
  }

  static async saveGalleryImage(img: GalleryImage): Promise<void> {
    if (FIREBASE_ACTIVE) {
      const path = `gallery/${img.id}`;
      try {
        await setDoc(doc(firestoreDb, "gallery", img.id), img);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      const list = await this.getGallery();
      list.push(img);
      setLocal("gallery", list);
    }
  }

  static async deleteGalleryImage(id: string): Promise<void> {
    if (FIREBASE_ACTIVE) {
      const path = `gallery/${id}`;
      try {
        await deleteDoc(doc(firestoreDb, "gallery", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      const list = await this.getGallery();
      const filtered = list.filter(g => g.id !== id);
      setLocal("gallery", filtered);
    }
  }

  // --- MESSAGES CRUD ---
  static async getMessages(): Promise<ContactMessage[]> {
    if (FIREBASE_ACTIVE) {
      const path = "messages";
      try {
        const colRef = collection(firestoreDb, "messages");
        const snap = await getDocs(colRef);
        return snap.docs.map(d => ({ ...d.data(), id: d.id }) as ContactMessage);
      } catch (error) {
        return handleFirestoreError(error, OperationType.LIST, path);
      }
    } else {
      return getLocal<ContactMessage[]>("messages", []);
    }
  }

  static async addMessage(message: ContactMessage): Promise<void> {
    if (FIREBASE_ACTIVE) {
      const path = `messages/${message.id}`;
      try {
        await setDoc(doc(firestoreDb, "messages", message.id), message);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    } else {
      const list = await this.getMessages();
      list.unshift(message); // Newest messages first
      setLocal("messages", list);
    }
  }

  static async deleteMessage(id: string): Promise<void> {
    if (FIREBASE_ACTIVE) {
      const path = `messages/${id}`;
      try {
        await deleteDoc(doc(firestoreDb, "messages", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    } else {
      const list = await this.getMessages();
      const filtered = list.filter(m => m.id !== id);
      setLocal("messages", filtered);
    }
  }
}

// --- AUTHENTICATION SERVICE ---

export class AuthService {
  private static mockUserKey = "zain_academy_logged_in_user";

  private static authListeners: ((user: any | null) => void)[] = [];

  static onAuthChanged(callback: (user: any | null) => void): () => void {
    if (FIREBASE_ACTIVE) {
      return onAuthStateChanged(firebaseAuth, (user) => {
        callback(user);
      });
    } else {
      // Mock auth state change
      const userStr = localStorage.getItem(this.mockUserKey);
      const user = userStr ? JSON.parse(userStr) : null;
      callback(user);
      
      this.authListeners.push(callback);
      
      // Return a mock unsubscribe function
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === this.mockUserKey) {
          const newUser = e.newValue ? JSON.parse(e.newValue) : null;
          callback(newUser);
        }
      };
      window.addEventListener("storage", handleStorageChange);
      return () => {
        this.authListeners = this.authListeners.filter(cb => cb !== callback);
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }

  static async login(email: string, password: string): Promise<any> {
    if (FIREBASE_ACTIVE) {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential.user;
    } else {
      // Hardcoded login requirements from prompt:
      // username: zainacademy2010@gmail.com
      // password: goluboss9582@Z
      if (email.trim().toLowerCase() === "zainacademy2010@gmail.com" && password === "goluboss9582@Z") {
        const user = {
          uid: "mock-admin-uid-123",
          email: "zainacademy2010@gmail.com",
          displayName: "Academy Admin (Mock)",
          emailVerified: true
        };
        localStorage.setItem(this.mockUserKey, JSON.stringify(user));
        
        // Notify local listeners safely using a copy of the array
        const listeners = [...this.authListeners];
        listeners.forEach(cb => {
          try {
            cb(user);
          } catch (e) {
            console.error("Error in auth listener callback:", e);
          }
        });
        
        // Trigger storage event safely to notify any window level listeners
        try {
          window.dispatchEvent(new Event("storage"));
        } catch (e) {
          console.error("Error dispatching storage event:", e);
        }
        return user;
      } else {
        throw new Error("Invalid username or password credentials. Please try again.");
      }
    }
  }

  static async logout(): Promise<void> {
    if (FIREBASE_ACTIVE) {
      await firebaseSignOut(firebaseAuth);
    } else {
      localStorage.removeItem(this.mockUserKey);
      
      // Notify local listeners safely using a copy of the array
      const listeners = [...this.authListeners];
      listeners.forEach(cb => {
        try {
          cb(null);
        } catch (e) {
          console.error("Error in auth listener callback:", e);
        }
      });
      
      // Trigger storage event safely to notify any window level listeners
      try {
        window.dispatchEvent(new Event("storage"));
      } catch (e) {
        console.error("Error dispatching storage event:", e);
      }
    }
  }
  
  static getCurrentUser(): any | null {
    if (FIREBASE_ACTIVE) {
      return firebaseAuth?.currentUser || null;
    } else {
      const userStr = localStorage.getItem(this.mockUserKey);
      return userStr ? JSON.parse(userStr) : null;
    }
  }
}
