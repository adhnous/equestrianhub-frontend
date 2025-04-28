// 📄 TrainerClasses.jsx – Trainer's Class Management with Full CRUD Support and Clean i18n
import { useEffect, useState } from 'react'
import { useUserStore } from '../../store/userStore'
import { AcademicCapIcon, PencilSquareIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'

export default function TrainerClasses() {
  const { userId } = useUserStore()
  const { t, i18n } = useTranslation()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [editClass, setEditClass] = useState(null)
  const [title, setTitle] = useState('')
  const [scheduleDate, setScheduleDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [cost, setCost] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const fetchClasses = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/training-classes?trainerId=${userId}`)
      const data = await res.json()
      setClasses(data)
    } catch (err) {
      console.error('Error fetching classes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) fetchClasses()
  }, [userId])

  const handleAddClass = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!title || !scheduleDate || !endDate || !cost) {
      return setError(t('trainerClasses.missingFields'))
    }
    try {
      const res = await fetch('http://localhost:5000/api/training-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          startDate: scheduleDate,
          endDate,
          cost: parseFloat(cost),
          trainerId: userId
        })
      })
      if (!res.ok) throw new Error(t('trainerClasses.failedAdd'))
      setTitle('')
      setScheduleDate('')
      setEndDate('')
      setCost('')
      setMessage(t('trainerClasses.classAdded'))
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
        body: JSON.stringify(editClass)
      })
      if (!res.ok) throw new Error(t('trainerClasses.updateFailed'))
      setEditClass(null)
      fetchClasses()
    } catch (err) {
      console.error('Update failed:', err)
      alert(t('trainerClasses.updateFailed'))
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(t('trainerClasses.confirmDelete'))
    if (!confirmed) return
    try {
      await fetch(`http://localhost:5000/api/training-classes/${id}`, { method: 'DELETE' })
      fetchClasses()
    } catch (err) {
      console.error('Delete failed:', err)
      alert(t('trainerClasses.deleteFailed'))
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <AcademicCapIcon className="w-8 h-8 text-indigo-400" /> {t('trainerClasses.title')}
        </h1>

        {/* List */}
        {loading ? (
          <p>{t('trainerClasses.loading')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map(cls => (
              <div key={cls.id} className="bg-white/10 p-4 rounded-xl border border-indigo-400">
                <h2 className="text-xl font-semibold text-indigo-200">{cls.title}</h2>
                <p className="text-sm text-gray-300">🗓️ {t('trainerClasses.startDate')}: {new Date(cls.startDate).toLocaleDateString(i18n.language)}</p>
                <p className="text-sm text-gray-300">🗓️ {t('trainerClasses.endDate')}: {new Date(cls.endDate).toLocaleDateString(i18n.language)}</p>
                <p className="text-sm text-gray-300">💰 {t('trainerClasses.cost')}: ${cls.cost}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditClass(cls)} className="text-indigo-300 hover:underline">
                    <PencilSquareIcon className="w-5 h-5 inline" /> {t('trainerClasses.edit')}
                  </button>
                  <button onClick={() => handleDelete(cls.id)} className="text-red-400 hover:underline">
                    <TrashIcon className="w-5 h-5 inline" /> {t('trainerClasses.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAddClass} className="bg-white/5 p-6 rounded-xl space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <PlusCircleIcon className="w-5 h-5 text-green-400" /> {t('trainerClasses.addNewClass')}
          </h3>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            type="text"
            placeholder={t('trainerClasses.classTitlePlaceholder')}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            value={scheduleDate}
            onChange={e => setScheduleDate(e.target.value)}
            type="date"
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            type="date"
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <input
            value={cost}
            onChange={e => setCost(e.target.value)}
            type="number"
            placeholder={t('trainerClasses.costPlaceholder')}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <button type="submit" className="w-full bg-indigo-500 py-2 rounded">
            {t('trainerClasses.add')}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}
        </form>

        {/* Edit Modal */}
        {editClass && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white text-black p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
              <h3 className="text-xl font-semibold">{t('trainerClasses.editClass')}</h3>
              <input
                value={editClass.title}
                onChange={e => setEditClass({ ...editClass, title: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="date"
                value={editClass.startDate?.split('T')[0]}
                onChange={e => setEditClass({ ...editClass, startDate: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="date"
                value={editClass.endDate?.split('T')[0]}
                onChange={e => setEditClass({ ...editClass, endDate: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                value={editClass.cost}
                onChange={e => setEditClass({ ...editClass, cost: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditClass(null)}
                  className="px-4 py-2 rounded bg-gray-200"
                >
                  {t('trainerClasses.cancel')}
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded bg-indigo-600 text-white"
                >
                  {t('trainerClasses.update')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
