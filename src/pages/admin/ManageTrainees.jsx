import { useEffect, useState, useMemo } from 'react'
import { useUserStore } from '../../store/userStore'
import { useTranslation } from 'react-i18next'

import {
  FaTrash,
  FaPlus,
  FaEdit,
  FaSave,
  FaTimes,
  FaSpinner
} from 'react-icons/fa'

export default function ManageTrainees() {
  const { logout } = useUserStore()
  const [trainees, setTrainees] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [editingTrainee, setEditingTrainee] = useState(null)
  const { t: tr } = useTranslation()

  const [newTrainee, setNewTrainee] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'male',
    age: '',
    level: 'beginner'
  })

  const inputClasses = useMemo(() =>
    'bg-[#46327d] text-gray-100 placeholder-gray-300 border border-purple-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full',
    []
  )

  const Button = ({ children, className = '', ...rest }) => (
    <button {...rest} className={`rounded px-4 py-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}>
      {children}
    </button>
  )

  const validateTrainee = (trainee, isEdit = false) => {
    if (!trainee.name?.trim() || !trainee.email?.trim() || (!isEdit && !trainee.password)) {
      return tr('manageTrainees.fillAllFields')
    }
    if (isNaN(trainee.age) || trainee.age < 0) {
      return tr('manageTrainees.ageError')
    }
    return null
  }

  const fetchTrainees = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:5000/api/trainees')
      if (!res.ok) throw new Error(tr('manageTrainees.errorFetch'))
      setTrainees(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    const validationError = validateTrainee(newTrainee)
    if (validationError) return setError(validationError)
    setLoading(true)
    setError(null)
    try {
      const payload = { ...newTrainee, age: Number(newTrainee.age) }
      const res = await fetch('http://localhost:5000/api/trainees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.message || tr('manageTrainees.errorAdd'))
      }
      setNewTrainee({ name: '', email: '', password: '', gender: 'male', age: '', level: 'beginner' })
      fetchTrainees()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm(tr('manageTrainees.confirmDelete'))) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`http://localhost:5000/api/trainees/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(tr('manageTrainees.errorDelete'))
      fetchTrainees()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditChange = (field, value) =>
    setEditingTrainee(prev => ({ ...prev, [field]: value }))

  const handleSaveEdit = async () => {
    const validationError = validateTrainee(editingTrainee, true)
    if (validationError) return setError(validationError)
    setSaving(true)
    setError(null)
    try {
      const { id, password, ...rest } = editingTrainee
      const payload = { ...rest, age: Number(rest.age) }
      if (password) payload.password = password
      const res = await fetch(`http://localhost:5000/api/trainees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.message || tr('manageTrainees.errorUpdate'))
      }
      setEditingTrainee(null)
      fetchTrainees()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setEditingTrainee(null)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [editingTrainee])

  useEffect(() => {
    fetchTrainees()
  }, [])

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#261649] to-[#38266e] py-10 px-6 text-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-green-300">
            {tr('manageTrainees.pageTitle')}
          </h1>
       
        </div>

        {error && (
          <p className="text-red-300 mb-4 p-3 bg-red-800/40 rounded" role="alert">
            ⚠️ {error}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="space-y-1">
            <label className="block text-sm text-gray-200">{tr('manageTrainees.name')}</label>
            <input type="text" placeholder={tr('manageTrainees.namePlaceholder')} className={inputClasses} value={newTrainee.name} onChange={(e) => setNewTrainee({ ...newTrainee, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="block text-sm text-gray-200">{tr('manageTrainees.email')}</label>
            <input type="email" placeholder={tr('manageTrainees.emailPlaceholder')} className={inputClasses} value={newTrainee.email} onChange={(e) => setNewTrainee({ ...newTrainee, email: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="block text-sm text-gray-200">{tr('manageTrainees.password')}</label>
            <input type="password" placeholder={tr('manageTrainees.passwordPlaceholder')} className={inputClasses} value={newTrainee.password} onChange={(e) => setNewTrainee({ ...newTrainee, password: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="block text-sm text-gray-200">{tr('manageTrainees.gender')}</label>
            <select value={newTrainee.gender} onChange={(e) => setNewTrainee({ ...newTrainee, gender: e.target.value })} className={inputClasses}>
              <option value="male">{tr('manageTrainees.genderMale')}</option>
              <option value="female">{tr('manageTrainees.genderFemale')}</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm text-gray-200">{tr('manageTrainees.age')}</label>
            <input type="number" placeholder={tr('manageTrainees.agePlaceholder')} className={inputClasses} value={newTrainee.age} onChange={(e) => setNewTrainee({ ...newTrainee, age: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="block text-sm text-gray-200">{tr('manageTrainees.level')}</label>
            <select value={newTrainee.level} onChange={(e) => setNewTrainee({ ...newTrainee, level: e.target.value })} className={inputClasses}>
              <option value="beginner">{tr('manageTrainees.levelBeginner')}</option>
              <option value="intermediate">{tr('manageTrainees.levelIntermediate')}</option>
              <option value="advanced">{tr('manageTrainees.levelAdvanced')}</option>
            </select>
          </div>
          <Button onClick={handleAdd} disabled={loading} className="bg-green-600 hover:bg-green-700 col-span-full flex items-center justify-center gap-2">
            {loading ? <FaSpinner className="animate-spin" /> : <FaPlus className="ml-1" />}
            {tr('manageTrainees.addTrainee')}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <FaSpinner className="animate-spin text-3xl mx-auto text-purple-300" />
          </div>
        ) : trainees.length === 0 ? (
          <p className="text-center text-gray-300 py-5">{tr('manageTrainees.noTrainees')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainees.map((trainee) => (
              <div key={trainee.id} className="bg-[#4a328f] rounded-2xl shadow-lg p-5 space-y-2 hover:scale-[1.03] transition-transform">
                <h3 className="text-xl font-semibold text-purple-100 flex items-center gap-2">
                  <FaEdit className="text-purple-300" /> {trainee.name}
                </h3>
                <p className="text-sm text-gray-200">📧 {trainee.email}</p>
                <p className="text-sm text-gray-200">👤 {trainee.gender === 'male' ? tr('manageTrainees.genderMale') : tr('manageTrainees.genderFemale')} | {trainee.level} | {trainee.age}</p>
                <div className="flex gap-2 pt-3 border-t border-purple-600 mt-3">
                  <Button onClick={() => setEditingTrainee(trainee)} className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-1 text-sm">
                    <FaEdit /> {tr('manageTrainees.edit')}
                  </Button>
                  <Button onClick={() => handleDelete(trainee.id)} disabled={loading} className="bg-red-500 hover:bg-red-600 flex items-center gap-1 text-sm">
                    {loading ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                    {tr('manageTrainees.delete')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {editingTrainee && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog">
            <div className="bg-[#563ca9] w-full max-w-xl rounded-2xl p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center pb-2 border-b border-purple-600">
                <h2 className="text-xl font-bold text-purple-100">{tr('manageTrainees.editTrainee')}</h2>
                <Button onClick={() => setEditingTrainee(null)} className="bg-gray-700 hover:bg-gray-600 px-2 py-1" aria-label={tr('manageTrainees.close')}>
                  <FaTimes />
                </Button>
              </div>
              {['name', 'email', 'password', 'gender', 'age', 'level'].map((field) => (
                field === 'gender' || field === 'level' ? (
                  <div key={field} className="space-y-1">
                    <label className="block text-sm text-gray-200">{tr(`manageTrainees.${field}Label`)}</label>
                    <select value={editingTrainee[field]} onChange={(e) => handleEditChange(field, e.target.value)} className={inputClasses}>
                      {field === 'gender' ? (
                        <>
                          <option value="male">{tr('manageTrainees.genderMale')}</option>
                          <option value="female">{tr('manageTrainees.genderFemale')}</option>
                        </>
                      ) : (
                        <>
                          <option value="beginner">{tr('manageTrainees.levelBeginner')}</option>
                          <option value="intermediate">{tr('manageTrainees.levelIntermediate')}</option>
                          <option value="advanced">{tr('manageTrainees.levelAdvanced')}</option>
                        </>
                      )}
                    </select>
                  </div>
                ) : (
                  <div key={field} className="space-y-1">
                    <label className="block text-sm text-gray-200">{tr(`manageTrainees.${field}Label`)}</label>
                    <input type={field === 'age' ? 'number' : 'text'} value={editingTrainee[field] || ''} onChange={(e) => handleEditChange(field, e.target.value)} className={inputClasses} placeholder={tr(`manageTrainees.${field}Placeholder`)} />
                  </div>
                )
              ))}
              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={handleSaveEdit} disabled={saving} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {tr('manageTrainees.saveEdit')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}