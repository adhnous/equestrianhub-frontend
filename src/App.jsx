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
import ManageCompetitions from './pages/admin/ManageCompetitions'
// Trainee Pages

import TrainerClasses from './pages/Trainer/TrainerClasses'
import TrainerCompetitions from './pages/Trainer/TrainerCompetitions'

// Trainee Pages
import TraineeClasses from './pages/Trainee/TraineeClasses'
import TraineeCompetitions from './pages/Trainee/TraineeCompetitions' 
import AssignHorsesToCompetitions from './pages/admin/AssignHorsesToCompetitions'
import ManageCompetitionsLanding from './pages/admin/ManageCompetitionsLanding'
// (Adjust the import path based on where you save it)



export default function App() {
  const { role } = useUserStore()

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
      <div className="relative min-h-screen">
        <LanguageSwitcher />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={getDashboard()} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/trainers" element={<ManageTrainers />} />
          <Route path="/admin/trainees" element={<ManageTrainees />} />
          <Route path="/admin/classes" element={<ManageClasses />} />
          <Route path="/admin/horses" element={<ManageHorses />} />
          <Route path="/admin/progress" element={<ViewProgress />} />
          <Route path="/admin/competitions" element={<ManageCompetitions />} />
          <Route path="/admin/assign-horses" element={<AssignHorsesToCompetitions />} />
          <Route path="*" element={<Navigate to="/" />} />


           {/* Trainer Routes */}
  <Route path="/trainer/classes" element={<TrainerClasses />} />
  <Route path="/trainer/competitions" element={<TrainerCompetitions />} />

  {/* Trainee Routes */}
  <Route path="/trainee/classes" element={<TraineeClasses />} />
  <Route path="/trainee/competitions" element={<TraineeCompetitions />} />



  <Route path="/admin/manage-competitions" element={<ManageCompetitionsLanding />} />
<Route path="/admin/assign-horses" element={<AssignHorsesToCompetitions />} />
<Route path="/admin/manage-competitions/crud" element={<ManageCompetitions />} />


  
        </Routes>
      </div>
    </Router>
  )
}
