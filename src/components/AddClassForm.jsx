import { useEffect, useState } from 'react'
import { useUserStore } from '../store/userStore'
import {
  ArrowRightIcon,
  AcademicCapIcon,
  TrashIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'

export default function TrainerDashboard() {
  const { username, userId, logout } = useUserStore()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editClass, setEditClass] = useState(null)
  const [trainees, setTrainees] = useState([])
  const [showTraineesFor, setShowTraineesFor] = useState(null)
  const [title, setTitle] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

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

  const fetchTrainees = async (classId, traineeIds) => {
    try {
      const res = await fetch('http://localhost:5000/api/trainees')
      const data = await res.json()
      const filtered = data.filter(t => traineeIds.includes(t.id))
      setTrainees(filtered)
      setShowTraineesFor(classId)
    } catch (err) {
      console.error('Failed to fetch trainees:', err)
    }
  }

  useEffect(() => {
    if (userId) fetchClasses()
  }, [userId])

  const handleAddClass = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!title || !scheduleDate || !userId) {
      setError('Missing required fields')
      return
    }

    try {
      const res = await fetch('http://localhost:5000/api/training-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, scheduleDate, trainerId: userId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setTitle('')
      setScheduleDate('')
      setMessage('Class created successfully')
      fetchClasses()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/training-classes/${editClass.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editClass.title,
          scheduleDate: editClass.scheduleDate
        })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message)
      setEditClass(null)
      fetchClasses()
    } catch (err) {
      alert('Update failed: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this class?')
    if (!confirmDelete) return
    try {
      await fetch(`http://localhost:5000/api/training-classes/${id}`, { method: 'DELETE' })
      fetchClasses()
    } catch (err) {
      console.error('Error deleting class:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
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
                <div key={cls.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800">{cls.title}</h3>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>🗓️ {new Date(cls.startDate).toLocaleDateString()}</span>
                        <span className="text-gray-300">|</span>
                        <span>🗓️ {new Date(cls.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm text-indigo-600 cursor-pointer hover:underline" onClick={() => fetchTrainees(cls.id, cls.enrolledTrainees)}>
                        {showTraineesFor === cls.id ? 'Hide' : 'View'} Trainees
                      </div>
                      {showTraineesFor === cls.id && trainees.map(t => (
                        <div key={t.id} className="p-3 rounded bg-gray-50 border text-sm mt-2">
                          👤 {t.username} | 📧 {t.email} | 🎓 {t.level} | 🎂 {t.age}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditClass(cls)} className="p-2 rounded hover:bg-indigo-50 text-indigo-600">
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(cls.id)} className="p-2 rounded hover:bg-red-50 text-red-500">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PlusCircleIcon className="w-6 h-6 text-indigo-600" />
            Add New Class
          </h3>
          <form onSubmit={handleAddClass} className="space-y-4">
            <input type="text" className="w-full p-2 border rounded" placeholder="Class Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="date" className="w-full p-2 border rounded" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded" disabled={loading}>{loading ? 'Adding...' : 'Add Class'}</button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}
          </form>
        </div>

        {editClass && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Edit Class</h3>
              <input
                type="text"
                value={editClass.title}
                onChange={(e) => setEditClass({ ...editClass, title: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="date"
                value={editClass.scheduleDate?.split('T')[0]}
                onChange={(e) => setEditClass({ ...editClass, scheduleDate: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditClass(null)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800">Cancel</button>
                <button onClick={handleUpdate} className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white">Update</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
