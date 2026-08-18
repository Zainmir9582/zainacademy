import React from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

// Component imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";

// Page imports
import Home from "./pages/Home";
import About from "./pages/About";
import Teachers from "./pages/Teachers";
import Courses from "./pages/Courses";
import Notices from "./pages/Notices";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Layout wrapper to inject persistent Navbar, Footer and Floating triggers ONLY on public routes
function ClientLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  if (isAdminPath) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <FloatingActions />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ClientLayout>
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />

          {/* Secure Admin Views */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </ClientLayout>
      <Analytics />
    </Router>
  );
}
