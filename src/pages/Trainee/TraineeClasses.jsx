// 📄 TraineeClasses.jsx – With Trainer Info in Class Cards
import { useEffect, useState } from 'react'
import { useUserStore } from '../../store/userStore'
import { useTranslation } from 'react-i18next'
import {
  AcademicCapIcon,
  BookOpenIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function TraineeClasses() {
  const { t } = useTranslation()
  const { userId } = useUserStore()
  const [enrolledClasses, setEnrolledClasses] = useState([])
  const [availableClasses, setAvailableClasses] = useState([])
  const [filteredClasses, setFilteredClasses] = useState([])
  const [trainers, setTrainers] = useState([])
  const [genderFilter, setGenderFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  const fetchEnrolledClasses = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/training-classes/enrolled/${userId}`)
      const payload = await res.json()
      let list = []
      if (Array.isArray(payload)) list = payload
      else if (Array.isArray(payload.classes)) list = payload.classes
      else if (Array.isArray(payload.enrolled)) list = payload.enrolled
      else if (payload.class) list = [payload.class]
      setEnrolledClasses(list)
    } catch (err) {
      console.error(t('manageClasses.errorFetch'), err)
      setEnrolledClasses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableClassesAndTrainers = async () => {
    setLoading(true)
    try {
      const [classRes, trainerRes] = await Promise.all([
        fetch('http://localhost:5000/api/training-classes'),
        fetch('http://localhost:5000/api/trainers')
      ])
      const allClasses = await classRes.json()
      const allTrainers = await trainerRes.json()
      const notEnrolled = allClasses.filter(cls => !cls.enrolledTrainees?.includes(userId))
      setAvailableClasses(notEnrolled)
      setTrainers(allTrainers)
    } catch (err) {
      console.error(t('manageClasses.errorFetch'), err)
      setAvailableClasses([])
      setTrainers([])
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (classId) => {
    try {
      const res = await fetch('http://localhost:5000/api/training-classes/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traineeId: userId, classId })
      })
      const result = await res.json()
      alert(result.message)
      await fetchEnrolledClasses()
      await fetchAvailableClassesAndTrainers()
    } catch (err) {
      console.error(t('manageClasses.errorEnroll'), err)
      alert(t('manageClasses.errorEnroll'))
    }
  }

  const handleUnenroll = async (classId) => {
    try {
      const res = await fetch('http://localhost:5000/api/training-classes/unenroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traineeId: userId, classId })
      })
      const result = await res.json()
      alert(result.message)
      await fetchEnrolledClasses()
      await fetchAvailableClassesAndTrainers()
    } catch (err) {
      console.error(t('manageClasses.errorUnenroll'), err)
      alert(t('manageClasses.errorUnenroll'))
    }
  }

  useEffect(() => {
    if (genderFilter === 'all') setFilteredClasses(availableClasses)
    else {
      setFilteredClasses(
        availableClasses.filter(cls => {
          const trainer = trainers.find(t => t.id === cls.trainerId)
          return trainer?.gender?.toLowerCase() === genderFilter
        })
      )
    }
  }, [genderFilter, availableClasses, trainers])

  useEffect(() => {
    if (!userId) return
    fetchEnrolledClasses()
    fetchAvailableClassesAndTrainers()
  }, [userId])

  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A'

  const getTrainerDetails = (trainerId) => {
    const trainer = trainers.find(t => t.id === trainerId)
    if (!trainer) return null
    return (
      <div className="text-xs text-gray-600 mt-2 space-y-1">
        <p><strong>{t('manageClasses.trainerName')}:</strong> {trainer.name}</p>
        <p><strong>{t('manageClasses.trainerGender')}:</strong> {trainer.gender}</p>
        <p><strong>{t('manageClasses.trainerSpecialty')}:</strong> {trainer.specialty}</p>
        <p><strong>{t('manageClasses.trainerEmail')}:</strong> {trainer.email}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Enrolled Classes */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <AcademicCapIcon className="w-8 h-8 text-teal-600" />
            <h2 className="text-2xl font-semibold text-gray-800">{t('manageClasses.title')}</h2>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : enrolledClasses.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 text-center">
              <BookOpenIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">{t('manageClasses.noEnrolled')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrolledClasses.map(cls => (
                <div key={cls.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">{cls.title}</h3>
                    <p className="text-sm text-gray-600">{cls.description}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>📅 {formatDate(cls.startDate)}</span>
                      <span className="text-gray-300">|</span>
                      <span>📅 {formatDate(cls.endDate)}</span>
                    </div>
                    {getTrainerDetails(cls.trainerId)}
                    <button onClick={() => handleUnenroll(cls.id)} className="mt-3 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Unenroll</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Available Classes */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <UserGroupIcon className="w-8 h-8 text-teal-600" />
            <h2 className="text-2xl font-semibold text-gray-800">{t('manageClasses.enrollTitle')}</h2>
          </div>
          <div className="flex justify-end items-center gap-2 mb-6 text-left">
  <label className="text-sm text-gray-600 mr-2">{t('manageClasses.filterLabel')}</label>
  <select
    value={genderFilter}
    onChange={(e) => setGenderFilter(e.target.value)}
    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
  >
    <option value="all">{t('manageClasses.filterAll')}</option>
    <option value="male">{t('manageClasses.filterMale')}</option>
    <option value="female">{t('manageClasses.filterFemale')}</option>
  </select>
</div>


          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 text-center">
              <BookOpenIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">{t('manageClasses.noAvailable')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.map(cls => (
                <div key={cls.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">{cls.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{cls.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span>{t('manageClasses.startDate')} {formatDate(cls.startDate)}</span>
                    <span>{t('manageClasses.endDate')} {formatDate(cls.endDate)}</span>
                  </div>
                  {getTrainerDetails(cls.trainerId)}
                  <button
                    onClick={() => handleEnroll(cls.id)}
                    className="mt-3 w-full px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                  >
                    {t('manageClasses.enrollButton')}
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
