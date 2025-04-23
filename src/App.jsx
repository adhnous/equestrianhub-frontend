import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useUserStore } from './store/userStore'
import i18n from './i18n'
import LanguageSwitcher from './components/LanguageSwitcher'

// Pages
import Login from './pages/Login'
import Landing from './pages/Landing'
import TraineeDashboard from './pages/TraineeDashboard'
import TrainerDashboard from './pages/TrainerDashboard'
import AdminDashboard from './pages/AdminDashboard'

// Admin Management Pages
import ManageUsers from './pages/admin/ManageUsers'
import ManageTrainers from './pages/admin/ManageTrainers'
import ManageTrainees from './pages/admin/ManageTrainees'
import ManageClasses from './pages/admin/ManageClasses'
import ManageHorses from './pages/admin/ManageHorses'
import ViewProgress from './pages/admin/ViewProgress'

export default function App() {
  const { role } = useUserStore()

  // Dynamically update language and direction
  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
  }, [i18n.language])

  const getDashboard = () => {
    if (role === 'trainee') return <TraineeDashboard />
    if (role === 'trainer') return <TrainerDashboard />
    if (role === 'admin') return <AdminDashboard />
    return <Navigate to="/login" />
  }

  return (
    <Router>
      {/* 👇 Add relative wrapper so absolute switcher positions correctly */}
      <div className="relative min-h-screen">
        {/* 🌍 Language Toggle Button */}
        <LanguageSwitcher />

        {/* App Routes */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Shared Dashboard Entry */}
          <Route path="/dashboard" element={getDashboard()} />

          {/* Admin-Specific Routes */}
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/trainers" element={<ManageTrainers />} />
          <Route path="/admin/trainees" element={<ManageTrainees />} />
          <Route path="/admin/classes" element={<ManageClasses />} />
          <Route path="/admin/horses" element={<ManageHorses />} />
          <Route path="/admin/progress" element={<ViewProgress />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}
