import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  Bell, 
  Image as ImageIcon, 
  Mail, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  Database,
  Cloud,
  ArrowRight,
  User,
  Info,
  Trash
} from "lucide-react";
import { AuthService, DataService, FIREBASE_ACTIVE } from "../../firebase/db";
import { 
  Teacher, 
  Course, 
  Notice, 
  GalleryImage, 
  ContactMessage, 
  SiteSettings 
} from "../../types";

function getConnectedSubjects(title: string): string[] {
  const norm = title.toLowerCase();
  if (norm.includes("1 to 8") || norm.includes("1-8")) {
    return ["General Science", "Mathematics", "English", "Urdu", "Social Studies"];
  }
  if (norm.includes("11") || norm.includes("12")) {
    return ["I.cs (Phy)", "I.cs (Eco)", "I.cs (stat)", "F.sc (Med)", "F.sc (Eng)", "I.com", "F.A"];
  }
  if (norm.includes("pre-9") || norm.includes("9th") || norm.includes("10th")) {
    if (norm.includes("arts")) {
      return ["Arts"];
    }
    return ["Biology", "Computer"];
  }
  return [];
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"teachers" | "courses" | "notices" | "gallery" | "settings" | "messages" | "firebase">("teachers");
  
  // Loading indicators
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // DB States
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Deletion confirm states
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Dialog States (Create / Edit modal triggers)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"teacher" | "course" | "notice" | "gallery">("teacher");
  const [editId, setEditId] = useState<string | null>(null); // Null means Add New

  // Form Fields State
  // Teachers
  const [teacherName, setTeacherName] = useState("");
  const [teacherQual, setTeacherQual] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("");
  const [teacherBio, setTeacherBio] = useState("");
  const [teacherPhotoUrl, setTeacherPhotoUrl] = useState("");

  // Courses
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseFee, setCourseFee] = useState("");

  // Notices
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeDate, setNoticeDate] = useState("");
  const [noticeDesc, setNoticeDesc] = useState("");
  const [noticeLink, setNoticeLink] = useState("");

  // Gallery
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryUrl, setGalleryUrl] = useState("");
  const [galleryCat, setGalleryCat] = useState("Campus");

  // Site Settings Form State
  const [instName, setInstName] = useState("");
  const [tagline, setTagline] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [missionText, setMissionText] = useState("");
  const [visionText, setVisionText] = useState("");
  const [historyText, setHistoryText] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [address, setAddress] = useState("");
  const [statTeachers, setStatTeachers] = useState(12);
  const [statCourses, setStatCourses] = useState(8);
  const [statExperience, setStatExperience] = useState(15);
  const [statStudents, setStatStudents] = useState(1200);

  // Auth Guard checking
  useEffect(() => {
    const unsubscribe = AuthService.onAuthChanged((user) => {
      if (!user) {
        navigate("/admin/login");
      } else {
        setCurrentUser(user);
        loadAllData();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [tData, cData, nData, gData, mData, sData] = await Promise.all([
        DataService.getTeachers(),
        DataService.getCourses(),
        DataService.getNotices(),
        DataService.getGallery(),
        DataService.getMessages(),
        DataService.getSettings()
      ]);
      
      setTeachers(tData);
      setCourses(cData);
      setNotices(nData);
      setGallery(gData);
      setMessages(mData);
      setSettings(sData);

      // Populate Settings fields
      if (sData) {
        setInstName(sData.instituteName);
        setTagline(sData.tagline);
        setAboutText(sData.aboutText);
        setMissionText(sData.missionText);
        setVisionText(sData.visionText);
        setHistoryText(sData.historyText);
        setEmail(sData.email);
        setContactNo(sData.contactNo);
        setWhatsappLink(sData.whatsappLink);
        setAddress(sData.address);
        setStatTeachers(sData.stats.teachers);
        setStatCourses(sData.stats.courses);
        setStatExperience(sData.stats.experience);
        setStatStudents(sData.stats.students);
      }
    } catch (err) {
      console.error("Error loading administrative dataset:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    navigate("/admin/login");
  };

  // Open modals with clean fields
  const openModal = (type: "teacher" | "course" | "notice" | "gallery", itemToEdit?: any) => {
    setModalType(type);
    setEditId(itemToEdit ? itemToEdit.id : null);

    if (type === "teacher") {
      setTeacherName(itemToEdit ? itemToEdit.name : "");
      setTeacherQual(itemToEdit ? itemToEdit.qualification : "");
      setTeacherSubject(itemToEdit ? itemToEdit.subject : "");
      setTeacherBio(itemToEdit ? itemToEdit.bio : "");
      setTeacherPhotoUrl(itemToEdit ? itemToEdit.photoUrl || "" : "");
    } else if (type === "course") {
      setCourseTitle(itemToEdit ? itemToEdit.title : "");
      setCourseDesc(itemToEdit ? itemToEdit.description : "");
      setCourseDuration(itemToEdit ? itemToEdit.duration : "");
      setCourseFee(itemToEdit ? itemToEdit.fee : "");
    } else if (type === "notice") {
      setNoticeTitle(itemToEdit ? itemToEdit.title : "");
      setNoticeDate(itemToEdit ? itemToEdit.date : new Date().toISOString().split("T")[0]);
      setNoticeDesc(itemToEdit ? itemToEdit.description : "");
      setNoticeLink(itemToEdit ? itemToEdit.link || "" : "");
    } else if (type === "gallery") {
      setGalleryTitle(itemToEdit ? itemToEdit.title : "");
      setGalleryUrl(itemToEdit ? itemToEdit.url : "");
      setGalleryCat(itemToEdit ? itemToEdit.category : "Campus");
    }

    setIsModalOpen(true);
  };

  // Drag and drop helper converting upload to Base64 in local mode
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldSetter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      fieldSetter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Save changes (Create or Update CRUD)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (modalType === "teacher") {
        const id = editId || "tchr_" + Date.now();
        const teacher: Teacher = {
          id,
          name: teacherName.trim(),
          qualification: teacherQual.trim(),
          subject: teacherSubject.trim(),
          bio: teacherBio.trim(),
          photoUrl: teacherPhotoUrl.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
        };
        await DataService.saveTeacher(teacher);
      } else if (modalType === "course") {
        const id = editId || "crs_" + Date.now();
        const course: Course = {
          id,
          title: courseTitle.trim(),
          description: courseDesc.trim(),
          duration: courseDuration.trim(),
          fee: courseFee.trim()
        };
        await DataService.saveCourse(course);
      } else if (modalType === "notice") {
        const id = editId || "ntc_" + Date.now();
        const notice: Notice = {
          id,
          title: noticeTitle.trim(),
          date: noticeDate,
          description: noticeDesc.trim(),
          link: noticeLink.trim() || undefined
        };
        await DataService.saveNotice(notice);
      } else if (modalType === "gallery") {
        const id = editId || "gal_" + Date.now();
        const img: GalleryImage = {
          id,
          title: galleryTitle.trim(),
          url: galleryUrl.trim() || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
          category: galleryCat
        };
        await DataService.saveGalleryImage(img);
      }

      setIsModalOpen(false);
      loadAllData();
    } catch (err) {
      console.error("Save transaction failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Deletion CRUD helper
  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      if (activeTab === "teachers") {
        await DataService.deleteTeacher(id);
      } else if (activeTab === "courses") {
        await DataService.deleteCourse(id);
      } else if (activeTab === "notices") {
        await DataService.deleteNotice(id);
      } else if (activeTab === "gallery") {
        await DataService.deleteGalleryImage(id);
      } else if (activeTab === "messages") {
        await DataService.deleteMessage(id);
      }
      setDeleteConfirmId(null);
      loadAllData();
    } catch (err) {
      console.error("Delete transaction failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const updatedSettings: SiteSettings = {
        id: "site",
        instituteName: instName.trim(),
        tagline: tagline.trim(),
        aboutText: aboutText.trim(),
        missionText: missionText.trim(),
        visionText: visionText.trim(),
        historyText: historyText.trim(),
        email: email.trim(),
        contactNo: contactNo.trim(),
        whatsappLink: whatsappLink.trim(),
        address: address.trim(),
        stats: {
          teachers: Number(statTeachers),
          courses: Number(statCourses),
          experience: Number(statExperience),
          students: Number(statStudents)
        }
      };

      await DataService.updateSettings(updatedSettings);
      alert("Settings updated successfully! Changes are live on the public pages.");
      loadAllData();
    } catch (err) {
      console.error("Error updating settings database:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Synchronizing Administrator Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* 1. SIDEBAR */}
      <aside className="w-full md:w-64 shrink-0 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
        <div className="p-6 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-teal text-white rounded-lg">
              <Database className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="font-display font-bold text-slate-100 text-base leading-tight">Admin Console</h2>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Zain Academy</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: "teachers", label: "Manage Faculty", icon: Users },
              { id: "courses", label: "Manage Courses", icon: BookOpen },
              { id: "notices", label: "Manage Notices", icon: Bell },
              { id: "gallery", label: "Manage Gallery", icon: ImageIcon },
              { id: "settings", label: "Site & Contact Settings", icon: Settings },
              { id: "messages", label: "Form Messages", icon: Mail, count: messages.length },
              { id: "firebase", label: "Firebase Guide", icon: Cloud }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-teal text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2.5 text-xs text-slate-400 font-light">
            <User className="w-4.5 h-4.5 text-brand-teal" />
            <div>
              <p className="font-medium text-slate-200 truncate max-w-[140px]">{currentUser?.email}</p>
              <p className="text-[10px] opacity-70">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 hover:bg-rose-900/40 hover:text-rose-400 border border-slate-800 rounded-lg text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl overflow-y-auto">
        
        {/* Workspace Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800/60">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white capitalize">
              {activeTab === "teachers" ? "Manage Faculty Members" : activeTab === "settings" ? "Site & Contact Settings" : activeTab === "messages" ? "Submissions Inbox" : `${activeTab} panel`}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-light mt-1">
              Add, update, or remove dynamic site assets that render immediately to the public environment.
            </p>
          </div>

          {/* Action triggers */}
          {["teachers", "courses", "notices", "gallery"].includes(activeTab) && (
            <button
              onClick={() => openModal(activeTab.slice(0, -1) as any)}
              className="px-4.5 py-2.5 bg-brand-teal hover:bg-teal-500 text-white font-bold text-xs sm:text-sm rounded-lg flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Record</span>
            </button>
          )}
        </header>

        {/* WORKSPACE SECTIONS */}

        {/* SECTION A: TEACHERS */}
        {activeTab === "teachers" && (
          <div className="bg-slate-900 rounded-xl border border-slate-800/60 overflow-hidden shadow-xl">
            {teachers.length === 0 ? (
              <p className="p-8 text-center text-slate-500 text-sm">No teacher records found. Click "Add New" to get started.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800/80">
                    <tr>
                      <th className="px-6 py-4">Professor</th>
                      <th className="px-6 py-4">Qualification</th>
                      <th className="px-6 py-4">Subject Specialty</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/55">
                    {teachers.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-850/30">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-950 flex items-center justify-center"><Users className="w-5 h-5 text-slate-600" /></div>
                          <div>
                            <p className="font-semibold text-white">{t.name}</p>
                            <p className="text-[10px] text-slate-500 font-light truncate max-w-xs">{t.bio}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{t.qualification}</td>
                        <td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded text-xs bg-slate-950 text-brand-teal border border-slate-800">{t.subject}</span></td>
                        <td className="px-6 py-4 text-right">
                          {deleteConfirmId === t.id ? (
                            <div className="flex justify-end gap-2 items-center">
                              <span className="text-xs text-rose-400 font-semibold">Delete?</span>
                              <button onClick={() => handleDelete(t.id)} className="px-2 py-1 bg-rose-600 text-white rounded text-xs">Confirm</button>
                              <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">Cancel</button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => openModal("teacher", t)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => setDeleteConfirmId(t.id)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SECTION B: COURSES */}
        {activeTab === "courses" && (
          <div className="bg-slate-900 rounded-xl border border-slate-800/60 overflow-hidden shadow-xl">
            {courses.length === 0 ? (
              <p className="p-8 text-center text-slate-500 text-sm">No course records found. Click "Add New" to get started.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800/80">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Connected Subjects / Streams</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/55">
                    {courses.map((c) => {
                      const subjects = getConnectedSubjects(c.title);
                      return (
                        <tr key={c.id} className="hover:bg-slate-850/30">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-white text-sm">{c.title}</p>
                            <p className="text-[10px] text-slate-500 font-light max-w-sm whitespace-normal leading-relaxed mt-1">{c.description}</p>
                          </td>
                          <td className="px-6 py-4">
                            {subjects.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {subjects.map((s, index) => (
                                  <span key={index} className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-900/30 text-brand-gold border border-purple-700/30">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-550 text-xs italic">General Curriculum</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {deleteConfirmId === c.id ? (
                              <div className="flex justify-end gap-2 items-center">
                                <span className="text-xs text-rose-400 font-semibold">Delete?</span>
                                <button onClick={() => handleDelete(c.id)} className="px-2 py-1 bg-rose-600 text-white rounded text-xs">Confirm</button>
                                <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">Cancel</button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <button onClick={() => openModal("course", c)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => setDeleteConfirmId(c.id)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SECTION C: NOTICES */}
        {activeTab === "notices" && (
          <div className="bg-slate-900 rounded-xl border border-slate-800/60 overflow-hidden shadow-xl">
            {notices.length === 0 ? (
              <p className="p-8 text-center text-slate-500 text-sm">No notices recorded. Click "Add New" to publish a bulletin.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800/80">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Publish Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/55">
                    {notices.map((n) => (
                      <tr key={n.id} className="hover:bg-slate-850/30">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-white flex items-center gap-2">
                            {n.title}
                            {n.link && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] bg-purple-900/40 text-brand-gold border border-purple-700/30 font-mono uppercase tracking-wider">Link Added</span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-500 font-light truncate max-w-sm">{n.description}</p>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">{n.date}</td>
                        <td className="px-6 py-4 text-right">
                          {deleteConfirmId === n.id ? (
                            <div className="flex justify-end gap-2 items-center">
                              <span className="text-xs text-rose-400 font-semibold">Delete?</span>
                              <button onClick={() => handleDelete(n.id)} className="px-2 py-1 bg-rose-600 text-white rounded text-xs">Confirm</button>
                              <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">Cancel</button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => openModal("notice", n)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => setDeleteConfirmId(n.id)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SECTION D: GALLERY */}
        {activeTab === "gallery" && (
          <div className="bg-slate-900 rounded-xl border border-slate-800/60 p-6 shadow-xl">
            {gallery.length === 0 ? (
              <p className="text-center text-slate-500 text-sm">No pictures inside the gallery. Click "Add New" to upload photos.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {gallery.map((img) => (
                  <div key={img.id} className="bg-slate-950 rounded-xl border border-slate-800 p-2 relative group">
                    <div className="aspect-video overflow-hidden rounded-lg bg-slate-900">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-xs truncate max-w-[140px] text-white">{img.title}</p>
                        <span className="text-[9px] font-bold text-slate-500 uppercase">{img.category}</span>
                      </div>
                      
                      {deleteConfirmId === img.id ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => handleDelete(img.id)} className="px-2 py-0.5 bg-rose-600 text-white text-[10px] rounded font-semibold">Yes</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded font-semibold">No</button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <button onClick={() => openModal("gallery", img)} className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setDeleteConfirmId(img.id)} className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-850 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION E: SITE SETTINGS */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-8 bg-slate-900 rounded-xl border border-slate-800/60 p-6 sm:p-8 shadow-xl">
            <h3 className="font-display font-bold text-slate-100 text-lg border-b border-slate-800 pb-3">Zain Academy General Settings</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Institute Name</label>
                <input type="text" value={instName} onChange={(e) => setInstName(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tagline</label>
                <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">About summary text (Home Page)</label>
              <textarea rows={3} value={aboutText} onChange={(e) => setAboutText(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none resize-none"></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Mission Statement</label>
                <textarea rows={4} value={missionText} onChange={(e) => setMissionText(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none resize-none"></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Vision Statement</label>
                <textarea rows={4} value={visionText} onChange={(e) => setVisionText(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none resize-none"></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Institute History Block</label>
                <textarea rows={4} value={historyText} onChange={(e) => setHistoryText(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none resize-none"></textarea>
              </div>
            </div>

            <h3 className="font-display font-bold text-slate-100 text-lg border-b border-slate-800 pt-4 pb-3">Academy Contact Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Direct Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Contact Phone Number</label>
                <input type="text" value={contactNo} onChange={(e) => setContactNo(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">WhatsApp Channel Link</label>
                <input type="url" value={whatsappLink} onChange={(e) => setWhatsappLink(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Campus Physical Address (for Map rendering)</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
            </div>

            <h3 className="font-display font-bold text-slate-100 text-lg border-b border-slate-800 pt-4 pb-3">Home Page Stats & Achievements counters</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Faculty Count</label>
                <input type="number" value={statTeachers} onChange={(e) => setStatTeachers(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Courses Count</label>
                <input type="number" value={statCourses} onChange={(e) => setStatCourses(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Years Experience</label>
                <input type="number" value={statExperience} onChange={(e) => setStatExperience(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Students Taught</label>
                <input type="number" value={statStudents} onChange={(e) => setStatStudents(Number(e.target.value))} required className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
              </div>
            </div>

            <button type="submit" disabled={actionLoading} className="px-6 py-3 bg-brand-teal hover:bg-teal-500 text-white font-bold rounded-lg text-sm tracking-wide shadow-md disabled:opacity-50 transition-all">
              {actionLoading ? "Updating settings..." : "Save & Publish Settings"}
            </button>
          </form>
        )}

        {/* SECTION F: MESSAGES */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
                No inquiries submitted yet. Form submissions from the contact page will appear here.
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="bg-slate-900 border border-slate-800/80 rounded-xl p-6 relative shadow hover:border-slate-700 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/60 text-xs text-slate-400">
                    <div>
                      <p className="font-semibold text-slate-200 text-sm">{m.name}</p>
                      <a href={`mailto:${m.email}`} className="text-brand-teal hover:underline">{m.email}</a>
                    </div>
                    <span className="font-mono text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-500">{m.date}</span>
                  </div>
                  
                  <p className="text-slate-300 font-light text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {m.message}
                  </p>

                  <div className="pt-2 flex justify-end">
                    {deleteConfirmId === m.id ? (
                      <div className="flex gap-2 items-center text-xs">
                        <span className="text-rose-400 font-semibold">Delete inquiry?</span>
                        <button onClick={() => handleDelete(m.id)} className="px-2.5 py-1 bg-rose-600 text-white rounded font-bold">Delete</button>
                        <button onClick={() => setDeleteConfirmId(null)} className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(m.id)} className="px-3 py-1.5 bg-slate-950 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <Trash className="w-3.5 h-3.5" />
                        <span>Delete Record</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SECTION G: FIREBASE INSTRUCTION GUIDE */}
        {activeTab === "firebase" && (
          <div className="bg-slate-900 rounded-xl border border-slate-800/60 p-6 sm:p-8 shadow-xl space-y-6 text-sm leading-relaxed text-slate-300 font-light">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <Cloud className="w-7 h-7 text-emerald-400" />
              <h3 className="font-display font-extrabold text-white text-xl">Firebase Project Setup Guide</h3>
            </div>

            <p>
              By default, Zain Academy is running in an elegant **Sandbox Mode** using local browser storage. To secure and scale your website with real cloud database connections, follow these exact 4 steps to deploy your own Firebase cloud infrastructure:
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <p className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-teal text-slate-950 text-xs font-black flex items-center justify-center">1</span>
                  <span>Create a free Firebase Project</span>
                </p>
                <p className="text-xs pl-7 text-slate-400">
                  Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-teal underline">firebase.google.com</a> and sign in. Click **"Add project"** and name it `Zain Academy`. Hit continue (you can disable Google Analytics for speed) and provision the project.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <p className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-teal text-slate-950 text-xs font-black flex items-center justify-center">2</span>
                  <span>Enable Firestore, Authentication, & Storage</span>
                </p>
                <p className="text-xs pl-7 text-slate-400 space-y-1.5">
                  • **Firestore Database:** Click "Firestore Database" in the left sidebar. Click **"Create database"**. Select your region, pick **"Test mode"** (or production mode) and click Enable.<br />
                  • **Authentication:** Click "Authentication" in the sidebar. Click **"Get started"**. Under Sign-in method, select **"Email/Password"**, toggle **"Enabled"** and save.<br />
                  • **Storage:** Click "Storage" in the sidebar. Click **"Get started"**, pick your rules preferences (Test mode), and click Done.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <p className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-teal text-slate-950 text-xs font-black flex items-center justify-center">3</span>
                  <span>Register an Admin User in Auth</span>
                </p>
                <p className="text-xs pl-7 text-slate-400">
                  Inside **Authentication &gt; Users**, click **"Add user"**. Enter the credentials requested:<br />
                  • Email: <span className="font-mono text-white bg-slate-900 px-1.5 py-0.5 rounded">zainacademy2010@gmail.com</span><br />
                  • Password: <span className="font-mono text-white bg-slate-900 px-1.5 py-0.5 rounded">goluboss9582@Z</span><br />
                  Click Add User. You can now use this email/password to log into your live Firebase portal.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <p className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-teal text-slate-950 text-xs font-black flex items-center justify-center">4</span>
                  <span>Copy Configuration into App</span>
                </p>
                <p className="text-xs pl-7 text-slate-400">
                  On the Firebase Project Overview page, click the **Web icon `&lt;/&gt;`** to register a web app. Name it `Zain Academy Web`, click Register. Copy the `firebaseConfig` object keys from the script provided, open the file <strong className="text-white font-mono bg-slate-900 px-1.5 py-0.5 rounded">/src/firebase/config.ts</strong>, paste those credentials, and save. The app will immediately and automatically detect the keys, initialize the client, and seamlessly sync all CRUD operations with your cloud storage!
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 3. MODAL FOR CREATE / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-display font-extrabold text-white text-lg sm:text-xl capitalize">
                {editId ? "Edit" : "Add New"} {modalType}
              </h2>
              <p className="text-slate-400 text-xs font-light mt-1">Provide correct information below. Fields marked with * are required.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Conditional Fields: TEACHERS */}
              {modalType === "teacher" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Professor Name *</label>
                    <input type="text" required value={teacherName} onChange={(e) => setTeacherName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Qualification *</label>
                    <input type="text" required value={teacherQual} onChange={(e) => setTeacherQual(e.target.value)} placeholder="e.g. M.Phil Mathematics" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Subject specialty *</label>
                    <input type="text" required value={teacherSubject} onChange={(e) => setTeacherSubject(e.target.value)} placeholder="e.g. Mathematics" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Short Biography *</label>
                    <textarea rows={3} required value={teacherBio} onChange={(e) => setTeacherBio(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none resize-none"></textarea>
                  </div>
                  {/* Profile pictures disabled as requested */}
                </>
              )}

              {/* Conditional Fields: COURSES */}
              {modalType === "course" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Course / Class Title *</label>
                    <input type="text" required value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="e.g. 9th (Sci) or 11th" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Description *</label>
                    <textarea rows={4} required value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} placeholder="Describe the curriculum, topics covered, and targeted board exam prep guidelines..." className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none resize-none"></textarea>
                  </div>
                </>
              )}

              {/* Conditional Fields: NOTICES */}
              {modalType === "notice" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Announcement Title *</label>
                    <input type="text" required value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Publish Date *</label>
                    <input type="date" required value={noticeDate} onChange={(e) => setNoticeDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Notice Description *</label>
                    <textarea rows={4} required value={noticeDesc} onChange={(e) => setNoticeDesc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none resize-none"></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">External Reference Link / URL (Optional)</label>
                    <input type="url" value={noticeLink} onChange={(e) => setNoticeLink(e.target.value)} placeholder="e.g. https://example.com/admission-form.pdf" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
                  </div>
                </>
              )}

              {/* Conditional Fields: GALLERY */}
              {modalType === "gallery" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Image Title *</label>
                    <input type="text" required value={galleryTitle} onChange={(e) => setGalleryTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Category *</label>
                    <select value={galleryCat} onChange={(e) => setGalleryCat(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none text-slate-300">
                      <option value="Campus">Campus</option>
                      <option value="Labs">Labs</option>
                      <option value="Events">Events</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Image URL *</label>
                    <input type="url" required value={galleryUrl} onChange={(e) => setGalleryUrl(e.target.value)} placeholder="Paste photo link or upload below" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-brand-teal focus:outline-none" />
                    
                    <div className="border border-slate-800/80 rounded-xl p-3 bg-slate-950/45 space-y-1.5">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Or Upload File (Converts to DataURL)</p>
                      <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, setGalleryUrl)} className="text-xs text-slate-400" />
                    </div>
                  </div>
                </>
              )}

              {/* Dialog controls */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4.5 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4.5 py-2.5 bg-brand-teal hover:bg-teal-500 text-white font-bold rounded-lg text-xs sm:text-sm shadow-md transition-colors disabled:opacity-50"
                >
                  {actionLoading ? "Saving..." : "Save Record"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
