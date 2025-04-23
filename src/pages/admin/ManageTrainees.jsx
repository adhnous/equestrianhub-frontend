/* === BEGIN FILE === */
import { useEffect, useState, useMemo } from 'react'
import { useUserStore } from '../../store/userStore'
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

  const [newTrainee, setNewTrainee] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'male',
    age: '',
    level: 'beginner'
  })

  /* ---------- Styling Helpers ---------- */
  const inputClasses = useMemo(
    () =>
      'bg-[#36245c] text-gray-100 placeholder-gray-400 border border-purple-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full',
    []
  )

  const Button = ({ children, className = '', ...rest }) => (
    <button
      {...rest}
      className={`rounded px-4 py-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )

  /* ---------- Validation Helpers ---------- */
  const validateTrainee = (trainee, isEdit = false) => {
    if (!trainee.name?.trim() || !trainee.email?.trim() || (!isEdit && !trainee.password)) {
      return 'يرجى ملء جميع الحقول المطلوبة'
    }
    if (isNaN(trainee.age) || trainee.age < 0) {
      return 'يرجى إدخال عمر صحيح'
    }
    return null
  }

  /* ---------- API Helpers ---------- */
  const fetchTrainees = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:5000/api/trainees')
      if (!res.ok) throw new Error('فشل في جلب المتدربين')
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
      const payload = {
        ...newTrainee,
        age: Number(newTrainee.age)
      }

      const res = await fetch('http://localhost:5000/api/trainees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.message || 'فشل في إضافة المتدرب')
      }

      setNewTrainee({
        name: '',
        email: '',
        password: '',
        gender: 'male',
        age: '',
        level: 'beginner'
      })
      fetchTrainees()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف المتدرب؟')) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`http://localhost:5000/api/trainees/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('فشل في حذف المتدرب')
      fetchTrainees()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditChange = (field, value) => {
    setEditingTrainee(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveEdit = async () => {
    const validationError = validateTrainee(editingTrainee, true)
    if (validationError) return setError(validationError)

    setSaving(true)
    setError(null)
    try {
      const { id, password, ...rest } = editingTrainee
      const payload = { 
        ...rest,
        age: Number(rest.age)
      }
      if (password) payload.password = password

      const res = await fetch(`http://localhost:5000/api/trainees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.message || 'فشل في تحديث البيانات')
      }

      setEditingTrainee(null)
      fetchTrainees()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  /* ---------- Effects ---------- */
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setEditingTrainee(null)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [editingTrainee]) // Fixed dependency

  useEffect(() => {
    fetchTrainees()
  }, [])

  /* ---------- Render ---------- */
  return (
    <div
      dir='rtl'
      className='min-h-screen bg-gradient-to-b from-[#1c0934] to-[#28104a] py-10 px-6 text-gray-100'
    >
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-green-400'>
            إدارة المتدربين
          </h1>
          <Button onClick={logout} className='bg-red-600 hover:bg-red-700'>
            خروج
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <p 
            className='text-red-400 mb-4 p-3 bg-red-900/30 rounded'
            role="alert"
            aria-live="assertive"
          >
            ⚠️ {error}
          </p>
        )}

        {/* Add Form */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-12'>
          <div className="space-y-1">
            <label className="block text-sm text-gray-300">الاسم</label>
            <input
              type='text'
              placeholder='الاسم'
              className={inputClasses}
              value={newTrainee.name}
              onChange={(e) =>
                setNewTrainee({ ...newTrainee, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-300">البريد</label>
            <input
              type='email'
              placeholder='البريد'
              className={inputClasses}
              value={newTrainee.email}
              onChange={(e) =>
                setNewTrainee({ ...newTrainee, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-300">كلمة المرور</label>
            <input
              type='password'
              placeholder='كلمة المرور'
              className={inputClasses}
              value={newTrainee.password}
              onChange={(e) =>
                setNewTrainee({ ...newTrainee, password: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-300">الجنس</label>
            <select
              value={newTrainee.gender}
              onChange={(e) =>
                setNewTrainee({ ...newTrainee, gender: e.target.value })
              }
              className={inputClasses}
            >
              <option value='male'>ذكر</option>
              <option value='female'>أنثى</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-300">العمر</label>
            <input
              type='number'
              placeholder='العمر'
              className={inputClasses}
              value={newTrainee.age}
              onChange={(e) =>
                setNewTrainee({ ...newTrainee, age: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-300">المستوى</label>
            <select
              value={newTrainee.level}
              onChange={(e) =>
                setNewTrainee({ ...newTrainee, level: e.target.value })
              }
              className={inputClasses}
            >
              <option value='beginner'>مبتدئ</option>
              <option value='intermediate'>متوسط</option>
              <option value='advanced'>متقدم</option>
            </select>
          </div>

          <Button
            onClick={handleAdd}
            disabled={loading}
            className='bg-green-600 hover:bg-green-700 col-span-full flex items-center justify-center gap-2'
          >
            {loading ? (
              <FaSpinner className='animate-spin' />
            ) : (
              <FaPlus className='ml-1' />
            )}
            إضافة متدرب
          </Button>
        </div>

        {/* Trainees List */}
        {loading ? (
          <div className="text-center py-10">
            <FaSpinner className="animate-spin text-3xl mx-auto text-purple-400" />
          </div>
        ) : trainees.length === 0 ? (
          <p className="text-center text-gray-400 py-5">لا يوجد متدربين مسجلين</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {trainees.map((t) => (
              <div
                key={t.id}
                className='bg-[#3a2666] rounded-2xl shadow-lg p-5 space-y-2 hover:transform hover:scale-105 transition-transform'
              >
                <h3 className='text-xl font-semibold text-purple-200 flex items-center gap-2'>
                  <FaEdit className='text-purple-400' /> {t.name}
                </h3>
                <p className='text-sm text-gray-300'>📧 {t.email}</p>
                <p className='text-sm text-gray-300'>
                  👤 {t.gender === 'male' ? 'ذكر' : 'أنثى'} | {t.level} | عمر:{' '}
                  {t.age}
                </p>
                <div className='flex gap-2 pt-3 border-t border-purple-700 mt-3'>
                  <Button
                    onClick={() => setEditingTrainee(t)}
                    className='bg-yellow-500 hover:bg-yellow-600 flex items-center gap-1 text-sm'
                  >
                    <FaEdit /> تعديل
                  </Button>
                  <Button
                    onClick={() => handleDelete(t.id)}
                    disabled={loading}
                    className='bg-red-500 hover:bg-red-600 flex items-center gap-1 text-sm'
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTrash />
                    )}
                    حذف
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingTrainee && (
          <div 
            className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'
            role="dialog"
            aria-labelledby="edit-modal-title"
          >
            <div className='bg-[#412b75] w-full max-w-xl rounded-2xl p-6 space-y-4 shadow-2xl'>
              <div className='flex justify-between items-center pb-2 border-b border-purple-700'>
                <h2 id="edit-modal-title" className='text-xl font-bold text-purple-200'>
                  تعديل المتدرب
                </h2>
                <Button
                  onClick={() => setEditingTrainee(null)}
                  className='bg-gray-700 hover:bg-gray-600 px-2 py-1'
                  aria-label="إغلاق"
                >
                  <FaTimes />
                </Button>
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-gray-300">الاسم</label>
                <input
                  value={editingTrainee.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className={inputClasses}
                  placeholder='الاسم'
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-gray-300">البريد</label>
                <input
                  value={editingTrainee.email}
                  onChange={(e) => handleEditChange('email', e.target.value)}
                  className={inputClasses}
                  placeholder='البريد'
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-gray-300">كلمة المرور</label>
                <input
                  type='password'
                  value={editingTrainee.password || ''}
                  onChange={(e) => handleEditChange('password', e.target.value)}
                  className={inputClasses}
                  placeholder='كلمة المرور (اختياري)'
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-gray-300">الجنس</label>
                <select
                  value={editingTrainee.gender}
                  onChange={(e) => handleEditChange('gender', e.target.value)}
                  className={inputClasses}
                >
                  <option value='male'>ذكر</option>
                  <option value='female'>أنثى</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-gray-300">العمر</label>
                <input
                  type='number'
                  value={editingTrainee.age}
                  onChange={(e) => handleEditChange('age', e.target.value)}
                  className={inputClasses}
                  placeholder='العمر'
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm text-gray-300">المستوى</label>
                <select
                  value={editingTrainee.level}
                  onChange={(e) => handleEditChange('level', e.target.value)}
                  className={inputClasses}
                >
                  <option value='beginner'>مبتدئ</option>
                  <option value='intermediate'>متوسط</option>
                  <option value='advanced'>متقدم</option>
                </select>
              </div>

              <div className='flex justify-end gap-2 pt-4'>
                <Button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className='bg-green-600 hover:bg-green-700 flex items-center gap-2'
                >
                  {saving ? (
                    <FaSpinner className='animate-spin' />
                  ) : (
                    <FaSave />
                  )}
                  حفظ
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
/* === END FILE === */