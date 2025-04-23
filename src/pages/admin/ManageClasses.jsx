import { useEffect, useState } from 'react'
import { useUserStore } from '../../store/userStore'
import { TrashIcon, PlusCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

export default function ManageClasses() {
  const { logout } = useUserStore()
  const [classes, setClasses] = useState([])
  const [newClass, setNewClass] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  })

  // Fetch existing classes
  const fetchClasses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/training-classes')
      const data = await res.json()
      setClasses(data)
    } catch (err) {
      console.error('Failed to load classes:', err)
    }
  }

  // Add a new class
  const handleAdd = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/training-classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newClass)
      })

      if (!res.ok) throw new Error('Failed to add class')

      const addedClass = await res.json()
      setClasses(prev => [...prev, addedClass])
      setNewClass({ title: '', description: '', startDate: '', endDate: '' })
    } catch (err) {
      console.error('Error adding class:', err)
    }
  }

  // Delete a class
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/training-classes/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete class')

      setClasses(prev => prev.filter(cls => cls.id !== id))
    } catch (err) {
      console.error('Error deleting class:', err)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Training Class Manager
          </h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200 group"
          >
            <span className="group-hover:text-amber-400 transition-colors">Logout</span>
            <ArrowRightIcon className="w-4 h-4 group-hover:text-amber-400 transition-colors" />
          </button>
        </div>

        {/* Add Class Form */}
        <div className="mb-8 bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-amber-400">Add New Class</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Title</label>
              <input
                type="text"
                value={newClass.title}
                onChange={e => setNewClass({ ...newClass, title: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Description</label>
              <input
                type="text"
                value={newClass.description}
                onChange={e => setNewClass({ ...newClass, description: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Start Date</label>
              <input
                type="date"
                value={newClass.startDate}
                onChange={e => setNewClass({ ...newClass, startDate: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">End Date</label>
              <input
                type="date"
                value={newClass.endDate}
                onChange={e => setNewClass({ ...newClass, endDate: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg font-semibold transition-all transform hover:scale-[1.02]"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Create Class
          </button>
        </div>

        {/* Classes List */}
        <div className="space-y-4">
          {classes.map(cls => (
            <div key={cls.id} className="group flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all shadow-md">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-amber-400">{cls.title}</h3>
                <p className="text-gray-300">{cls.description}</p>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>📅 {new Date(cls.startDate).toLocaleDateString()}</span>
                  <span>→</span>
                  <span>📅 {new Date(cls.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(cls.id)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
