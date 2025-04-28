
import { Link } from 'react-router-dom'
import { FaHorseHead, FaTools } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

export default function ManageCompetitionsLanding() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-700 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center mb-10">🏆 {t('manageCompetitions.title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Assign Horses Card */}
          <Link
            to="/admin/assign-horses"
            className="bg-purple-600 hover:bg-purple-500 rounded-2xl p-8 shadow-xl transition-all flex flex-col items-center justify-center space-y-4 text-center"
          >
            <FaHorseHead className="text-5xl text-yellow-300" />
            <h2 className="text-2xl font-semibold">{t('manageClasses.assignHorses')}</h2>
            <p className="text-purple-200">{t('manageClasses.assignHorsesDesc')}</p>
          </Link>

          {/* Manage Competitions Card */}
          <Link
            to="/admin/manage-competitions/crud"
            className="bg-purple-600 hover:bg-purple-500 rounded-2xl p-8 shadow-xl transition-all flex flex-col items-center justify-center space-y-4 text-center"
          >
            <FaTools className="text-5xl text-yellow-300" />
            <h2 className="text-2xl font-semibold">{t('manageClasses.editCompetitions')}</h2>
            <p className="text-purple-200">{t('manageClasses.editCompetitionsDesc')}</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
