import { useEffect, useState } from 'react'
import { FaSpinner, FaUserTie } from 'react-icons/fa'

export default function ManageTrainers() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/trainers')
        const data = await res.json()
        setTrainers(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch trainers:', err)
        setTrainers([])
      } finally {
        setLoading(false)
      }
    }

    fetchTrainers()
  }, [])

  return (
    <div className="min-h-screen bg-[#1C0730] py-10 px-6 md:px-12 text-gray-200">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">إدارة المدربين</h1>
          <p className="text-purple-300">عرض معلومات جميع المدربين في النظام</p>
        </div>

        {/* Trainers Section */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <FaSpinner className="animate-spin h-8 w-8 text-purple-500" />
          </div>
        ) : trainers.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">لا يوجد مدربين حالياً.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="bg-[#2D1555] border border-purple-800 rounded-xl p-5 shadow-md hover:shadow-purple-500/10 transition duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <FaUserTie className="text-purple-400 w-5 h-5" />
                  <h2 className="text-lg font-semibold text-white">{trainer.username}</h2>
                </div>
                <p className="text-sm text-gray-300">📧 {trainer.email}</p>
                <p className="text-sm text-gray-300 capitalize">👤 {trainer.gender}</p>
                <p className="text-sm text-gray-300">📚 التخصص: {trainer.specialty || 'غير محدد'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
