// // 📄 TrainerDashboard.jsx – Dashboard Landing with Navigation to Class & Competition Sections
import { useUserStore } from '../store/userStore'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRightIcon,
  AcademicCapIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

export default function TrainerDashboard() {
  const { username, logout } = useUserStore()
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 p-6 text-white">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex justify-between items-center bg-white/5 p-6 rounded-xl shadow border border-white/10">
          <div>
            <h1 className="text-3xl font-bold text-white">{t('trainerDashboard.title')}</h1>
            <p className="text-sm text-gray-400">Welcome, {username}</p>
          </div>
          <button onClick={logout} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl text-white">Logout <ArrowRightIcon className="w-4 h-4 inline" /></button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div onClick={() => navigate('/trainer/classes')} className="bg-white/10 hover:bg-white/20 p-6 rounded-xl cursor-pointer border border-indigo-300 transition-all">
            <AcademicCapIcon className="w-10 h-10 text-indigo-300 mb-3" />
            <h2 className="text-xl font-semibold">{t('trainerDashboard.manageClasses')}</h2>
            <p className="text-sm text-gray-300 mt-1">{t('trainerDashboard.manageClassesDesc')}</p>
          </div>
          <div onClick={() => navigate('/trainer/competitions')} className="bg-white/10 hover:bg-white/20 p-6 rounded-xl cursor-pointer border border-yellow-300 transition-all">
            <TrophyIcon className="w-10 h-10 text-yellow-300 mb-3" />
            <h2 className="text-xl font-semibold">{t('trainerDashboard.joinCompetitions')}</h2>
            <p className="text-sm text-gray-300 mt-1">{t('trainerDashboard.joinCompetitionsDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
