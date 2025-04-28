import { useEffect, useState } from 'react'
import { useUserStore } from '../../store/userStore'
import { ArrowRightIcon, ChartBarIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline'

export default function ViewProgress() {
  const { logout } = useUserStore()
  const [progressData, setProgressData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProgress = async () => {
    try {
      // ✅ Temporary Dummy Data
      const dummyData = [
        {
          id: '1',
          traineeName: 'Ahmed Saleh',
          classTitle: 'Jumping Basics',
          progressPercentage: 72,
          progressDescription: 'Mastered basic jumps and balance',
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          traineeName: 'Lina Farhat',
          classTitle: 'Dressage 101',
          progressPercentage: 45,
          progressDescription: 'Completed half the program modules',
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          traineeName: 'Omar Al-Mutairi',
          classTitle: 'Advanced Racing',
          progressPercentage: 25,
          progressDescription: 'Needs to improve lap time consistency',
          updatedAt: new Date().toISOString()
        }
      ]

      // ✅ Sort trainees by progress highest first
      const sortedData = dummyData.sort((a, b) => b.progressPercentage - a.progressPercentage)

      setProgressData(sortedData)
    } catch (err) {
      console.error('Error loading dummy progress data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [])

  const getProgressColor = (percentage) => {
    if (percentage >= 70) return 'bg-green-400'
    if (percentage >= 40) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <ChartBarIcon className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Trainee Progress
              </h1>
              <p className="text-sm text-gray-500">Track and monitor student advancements</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-purple-200 hover:bg-purple-50 text-purple-600 transition-all duration-300 group"
          >
            <span className="font-medium">Logout</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : progressData.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200 text-center">
            <UserGroupIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 font-medium text-lg">No progress data available</p>
            <p className="text-gray-400 text-sm mt-2">Start tracking trainee progress to see updates here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progressData.map(entry => (
              <div key={entry.id} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{entry.traineeName}</h2>
                    <p className="text-sm text-purple-600">{entry.classTitle}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    {entry.progressPercentage || 'N/A'}%
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{entry.progressDescription}</p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Updated: {new Date(entry.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(entry.progressPercentage)} transition-all duration-500`}
                    style={{ width: `${entry.progressPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
