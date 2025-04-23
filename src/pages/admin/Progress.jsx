import { useEffect, useState } from 'react'
import { useUserStore } from '../../store/userStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function ViewProgress() {
  const { logout } = useUserStore()
  const [progressData, setProgressData] = useState([])

  const fetchProgress = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/trainees')
      const data = await res.json()
      setProgressData(data)
    } catch (err) {
      console.error('Failed to fetch progress data:', err)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">📊 Trainee Progress Overview</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {progressData.length === 0 ? (
        <p className="text-gray-500">No progress data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="traineeName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="progress" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

