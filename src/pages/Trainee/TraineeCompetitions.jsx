// 📄 TraineeCompetitions.jsx – Full Competition Enrollment Management with Clean i18n
import { useEffect, useState } from 'react'
import { useUserStore } from '../../store/userStore'
import { useTranslation } from 'react-i18next'
import {
  TrophyIcon,
  UserIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

export default function TraineeCompetitions() {
  const { t, i18n } = useTranslation()
  const { userId } = useUserStore()
  const [joinedCompetitions, setJoinedCompetitions] = useState([])
  const [availableCompetitions, setAvailableCompetitions] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCompetitions = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/competitions')
      const data = await res.json()
      const joined = data.filter(c => c.Trainees?.some(t => t.id === userId))
      const available = data.filter(c => !c.Trainees?.some(t => t.id === userId))
      setJoinedCompetitions(joined)
      setAvailableCompetitions(available)
    } catch (err) {
      console.error(t('traineeCompetitions.errorFetch'), err)
      setJoinedCompetitions([])
      setAvailableCompetitions([])
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async (competitionId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/competitions/${competitionId}/trainees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traineeId: userId })
      })
      const result = await res.json()
      alert(result.message)
      fetchCompetitions()
    } catch (err) {
      console.error(t('traineeCompetitions.errorJoin'), err)
      alert(t('traineeCompetitions.errorJoin'))
    }
  }

  const handleUnjoin = async (competitionId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/competitions/${competitionId}/trainees`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traineeId: userId })
      })
      const result = await res.json()
      alert(result.message)
      fetchCompetitions()
    } catch (err) {
      console.error(t('traineeCompetitions.errorUnjoin'), err)
      alert(t('traineeCompetitions.errorUnjoin'))
    }
  }

  useEffect(() => {
    if (userId) fetchCompetitions()
  }, [userId])

  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString(i18n.language) : 'N/A'

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Joined Competitions */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <TrophyIcon className="w-8 h-8 text-yellow-600" />
            <h2 className="text-2xl font-semibold text-gray-800">{t('traineeCompetitions.title')}</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : joinedCompetitions.length === 0 ? (
            <p className="text-gray-500">{t('traineeCompetitions.noJoined')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedCompetitions.map(comp => (
                <div key={comp.id} className="bg-white p-5 rounded-xl shadow-sm border border-yellow-300">
                  <h3 className="text-lg font-bold text-yellow-700">🏆 {comp.name}</h3>
                  <p className="text-sm text-gray-600">📍 {comp.location}</p>
                  <p className="text-sm text-gray-600">📅 {formatDate(comp.date)}</p>
                  <p className="text-sm text-gray-500">{t('traineeCompetitions.type')}: {comp.type}</p>
                  <button
                    onClick={() => handleUnjoin(comp.id)}
                    className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm flex items-center gap-1"
                  >
                    <XCircleIcon className="w-4 h-4" /> {t('traineeCompetitions.unjoin')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Available Competitions */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <UserIcon className="w-8 h-8 text-yellow-600" />
            <h2 className="text-2xl font-semibold text-gray-800">{t('traineeCompetitions.availableCompetitions')}</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : availableCompetitions.length === 0 ? (
            <p className="text-gray-500">{t('traineeCompetitions.noAvailable')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCompetitions.map(comp => (
                <div key={comp.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">🏇 {comp.name}</h3>
                  <p className="text-sm text-gray-500">
                    📍 {comp.location} | 📅 {formatDate(comp.date)} | 🏷 {comp.type}
                  </p>
                  <button
                    onClick={() => handleJoin(comp.id)}
                    className="mt-3 w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    {t('traineeCompetitions.join')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
