// 📄 TrainerCompetitions.jsx – Clean i18n Version with Translations
import { useEffect, useState } from 'react'
import { useUserStore } from '../../store/userStore'
import { TrophyIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

export default function TrainerCompetitions() {
  const { userId } = useUserStore()
  const { t, i18n } = useTranslation()
  const [competitions, setCompetitions] = useState([])
  const [loading, setLoading] = useState(true)
  const [joined, setJoined] = useState(new Set())

  useEffect(() => {
    fetchCompetitions()
    const saved = localStorage.getItem('joinedCompetitions')
    if (saved) setJoined(new Set(JSON.parse(saved)))
  }, [])

  const fetchCompetitions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/competitions')
      const data = await res.json()
      setCompetitions(data)
    } catch (err) {
      console.error(t('trainerCompetitions.joinFailed'), err)
    } finally {
      setLoading(false)
    }
  }

  const persistJoined = (updatedSet) => {
    setJoined(updatedSet)
    localStorage.setItem('joinedCompetitions', JSON.stringify([...updatedSet]))
  }

  const handleJoin = async (competitionId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/competitions/${competitionId}/trainers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainerId: userId })
      })
      if (!res.ok) throw new Error(t('trainerCompetitions.joinFailed'))
      const updatedSet = new Set(joined)
      updatedSet.add(competitionId)
      persistJoined(updatedSet)
      alert(t('trainerCompetitions.joinSuccess'))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUnjoin = async (competitionId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/competitions/${competitionId}/trainers`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainerId: userId })
      })
      if (!res.ok) throw new Error(t('trainerCompetitions.unjoinFailed'))
      const updatedSet = new Set(joined)
      updatedSet.delete(competitionId)
      persistJoined(updatedSet)
      alert(t('trainerCompetitions.unjoinSuccess'))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <TrophyIcon className="w-8 h-8 text-yellow-400" /> {t('trainerCompetitions.title')}
        </h1>
        {loading ? (
          <p className="text-center">{t('trainerCompetitions.loading')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map(c => (
              <div key={c.id} className="bg-white/10 p-6 rounded-2xl border border-yellow-400 shadow hover:shadow-lg transition-all">
                <h2 className="text-xl font-bold text-yellow-200 mb-2">{c.name}</h2>
                <div className="text-sm space-y-1">
                  <p className="text-gray-300">📅 <span className="font-medium">{t('trainerCompetitions.date')}:</span> {new Date(c.date).toLocaleDateString(i18n.language)}</p>
                  <p className="text-gray-300">📍 <span className="font-medium">{t('trainerCompetitions.location')}:</span> {c.location}</p>
                  <p className="text-gray-300">🏇 <span className="font-medium">{t('trainerCompetitions.type')}:</span> {c.type}</p>
                </div>
                {joined.has(c.id) ? (
                  <button
                    onClick={() => handleUnjoin(c.id)}
                    className="mt-4 w-full px-4 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-500 text-white"
                  >
                    {t('trainerCompetitions.unjoin')}
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoin(c.id)}
                    className="mt-4 w-full px-4 py-2 rounded-lg font-semibold bg-yellow-500 hover:bg-yellow-400 text-black"
                  >
                    {t('trainerCompetitions.join')}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
