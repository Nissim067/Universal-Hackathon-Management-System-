import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastContainer from './components/ui/Toast';
import { useAuthInit } from './hooks/useAuthInit';
import { useAuthStore } from './store/authStore';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import HackathonDetail from './pages/HackathonDetail';
import CreateHackathon from './pages/CreateHackathon';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Team from './pages/Team';
import Submission from './pages/Submission';
import Checkout from './pages/Checkout';
import OrganizerDashboard from './pages/Dashboard/OrganizerDashboard';
import ParticipantDashboard from './pages/Dashboard/ParticipantDashboard';

function DashboardRouter() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'organizer' || user.role === 'admin'
    ? <OrganizerDashboard />
    : <ParticipantDashboard />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  useAuthInit();

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/hackathon/:id" element={<HackathonDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateHackathon /></ProtectedRoute>} />
          <Route path="/team/:id" element={<ProtectedRoute><Team /></ProtectedRoute>} />
          <Route path="/submit" element={<ProtectedRoute><Submission /></ProtectedRoute>} />
          <Route path="/checkout/:hackathonId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
