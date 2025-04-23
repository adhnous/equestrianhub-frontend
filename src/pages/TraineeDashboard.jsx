import { useEffect, useState } from 'react'
import { useUserStore } from '../store/userStore'
import {
  ArrowRightIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function TraineeDashboard() {
  const { username, userId, logout } = useUserStore()

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
      if (Array.isArray(payload)) {
        list = payload
      } else if (Array.isArray(payload.classes)) {
        list = payload.classes
      } else if (Array.isArray(payload.enrolled)) {
        list = payload.enrolled
      } else if (payload.class) {
        list = [payload.class]
      }

      setEnrolledClasses(list)
    } catch (err) {
      console.error('❌ Error fetching enrolled classes:', err)
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

      const notEnrolled = allClasses.filter(
        cls => !cls.enrolledTrainees?.includes(userId)
      )

      setAvailableClasses(notEnrolled)
      setTrainers(allTrainers)
    } catch (err) {
      console.error('Error fetching available classes/trainers:', err)
      setAvailableClasses([])
      setTrainers([])
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (classId) => {
    try {
      const res = await fetch(
        'http://localhost:5000/api/training-classes/enroll',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ traineeId: userId, classId })
        }
      )
      const result = await res.json()
      alert(result.message)
      await fetchEnrolledClasses()
      await fetchAvailableClassesAndTrainers()
    } catch (err) {
      console.error('Enrollment failed', err)
      alert('Failed to enroll.')
    }
  }

  const handleUnenroll = async (classId) => {
    try {
      const res = await fetch(
        'http://localhost:5000/api/training-classes/unenroll',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ traineeId: userId, classId })
        }
      )
      const result = await res.json()
      alert(result.message)
      await fetchEnrolledClasses()
      await fetchAvailableClassesAndTrainers()
    } catch (err) {
      console.error('Unenrollment failed', err)
      alert('Failed to unenroll.')
    }
  }

  useEffect(() => {
    if (genderFilter === 'all') {
      setFilteredClasses(availableClasses)
    } else {
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

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A'

  const formatDateTime = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString() : 'N/A'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Welcome back, {username}! 🏇
            </h1>
            <p className="text-sm text-gray-500">
              Track your progress and discover new classes
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 text-red-600 transition-all duration-300 group"
          >
            <span className="font-medium">Logout</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Enrolled Classes */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <AcademicCapIcon className="w-8 h-8 text-teal-600" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Your Current Classes
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : enrolledClasses.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 text-center">
              <BookOpenIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">
                No enrolled classes yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledClasses.map(cls => (
                <div
                  key={cls.id}
                  className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {cls.title}
                      </h3>
                      <p className="text-sm text-gray-600">{cls.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>📅 {formatDate(cls.startDate)}</span>
                        <span className="text-gray-300">|</span>
                        <span>📅 {formatDate(cls.endDate)}</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Created: {formatDateTime(cls.createdAt)}<br />
                        Updated: {formatDateTime(cls.updatedAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUnenroll(cls.id)}
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                    >
                      Unenroll
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Available Classes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <UserGroupIcon className="w-8 h-8 text-teal-600" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Available Classes
              </h2>
            </div>
            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            >
              <option value="all">All Trainers</option>
              <option value="male">♂ Male Trainers</option>
              <option value="female">♀ Female Trainers</option>
            </select>
          </div>

          {filteredClasses.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 text-center">
              <AcademicCapIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">
                No classes match your filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.map(cls => {
                const trainer = trainers.find(t => t.id === cls.trainerId)
                return (
                  <div
                    key={cls.id}
                    className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {cls.title}
                        </h3>
                        {trainer && (
                          <span className="px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full">
                            {trainer.gender === 'male' ? '♂' : '♀'} {trainer.name}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{cls.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>📅 {formatDate(cls.startDate)}</span>
                        <span className="text-gray-300">|</span>
                        <span>📅 {formatDate(cls.endDate)}</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Created: {formatDateTime(cls.createdAt)}<br />
                        Updated: {formatDateTime(cls.updatedAt)}
                      </p>
                      <button
                        onClick={() => handleEnroll(cls.id)}
                        className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
