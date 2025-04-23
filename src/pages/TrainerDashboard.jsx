import { useEffect, useState } from 'react'
import { useUserStore } from '../store/userStore'
import AddClassForm from '../components/AddClassForm'
import {
  ArrowRightIcon,
  AcademicCapIcon,
  TrashIcon,
  ChevronDownIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline'

export default function TrainerDashboard() {
  const { username, userId, logout } = useUserStore()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchClasses = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/training-classes?trainerId=${userId}`)
      const data = await res.json()
      setClasses(data)
    } catch (err) {
      console.error('Failed to fetch classes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) fetchClasses()
  }, [userId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Trainer Dashboard 👨🏫
            </h1>
            <p className="text-sm text-gray-500">Welcome back, {username}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 text-red-600 transition-all duration-300 group"
          >
            <span className="font-medium">Logout</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Classes Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Your Training Classes</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : classes.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 text-center">
              <AcademicCapIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 font-medium">No classes created yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((cls) => (
                <ClassCard key={cls.id} cls={cls} onDeleted={fetchClasses} />
              ))}
            </div>
          )}
        </section>

        {/* Add New Class Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PlusCircleIcon className="w-6 h-6 text-indigo-600" />
            Create New Class
          </h3>
          <AddClassForm onClassAdded={fetchClasses} />
        </div>
      </div>
    </div>
  )
}

function ClassCard({ cls, onDeleted }) {
  const [trainees, setTrainees] = useState([])
  const [showTrainees, setShowTrainees] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    const confirm = window.confirm(`Are you sure you want to delete the class "${cls.title}"?`)
    if (!confirm) return

    try {
      setDeleting(true)
      const res = await fetch(`http://localhost:5000/api/training-classes/${cls.id}`, {
        method: 'DELETE'
      })
      const result = await res.json()
      alert(result.message || 'Class deleted')
      onDeleted()
    } catch (err) {
      console.error('Failed to delete class:', err)
      alert('Failed to delete class')
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (showTrainees && cls.enrolledTrainees?.length > 0) {
      fetch('http://localhost:5000/api/trainees')
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter(t => cls.enrolledTrainees.includes(t.id))
          setTrainees(filtered)
        })
        .catch(err => console.error('Failed to fetch trainees', err))
    }
  }, [showTrainees, cls.enrolledTrainees])

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group relative">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">{cls.title}</h3>
          <p className="text-sm text-gray-600">{cls.description}</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>🗓️ {new Date(cls.startDate).toLocaleDateString()}</span>
            <span className="text-gray-300">|</span>
            <span>🗓️ {new Date(cls.endDate).toLocaleDateString()}</span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
          disabled={deleting}
        >
          {deleting ? (
            <span className="flex items-center gap-1 text-sm">
              <Spinner />
              Deleting...
            </span>
          ) : (
            <TrashIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-indigo-600">
            👥 {cls.enrolledTrainees?.length || 0} enrolled
          </span>
          {cls.enrolledTrainees?.length > 0 && (
            <button
              onClick={() => setShowTrainees(!showTrainees)}
              className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1"
            >
              {showTrainees ? 'Hide' : 'View'} Trainees
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${showTrainees ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {showTrainees && (
          <div className="mt-3 space-y-2">
            {trainees.map(t => (
              <div key={t.id} className="p-3 rounded-lg bg-gray-50 shadow-sm border border-gray-100">
                <p className="font-medium text-gray-800">
                  👤 {t.username} ({t.gender === 'male' ? '♂' : '♀'})
                </p>
                <p className="text-sm text-gray-600">
                  📧 {t.email} | 🎂 Age: {t.age} | 🎓 Level: {t.level}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
  )
}
