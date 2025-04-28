import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useUserStore } from '../store/userStore'
import {
  UserIcon,
  LockClosedIcon,
  ChevronDownIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

export default function Login() {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const login = useUserStore((state) => state.login)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || t('login.error'))
        return
      }

      login({ userId: data.id, username: data.username, role: data.role || role })
      navigate('/dashboard')
    } catch (err) {
      setError(t('login.generalError'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-screen blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-indigo-400 rounded-full mix-blend-screen blur-3xl animate-float-delayed"></div>
      </div>

      <form onSubmit={handleLogin} className="relative bg-white/5 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/10 space-y-6">
        <div className="absolute inset-0 rounded-2xl border-2 border-white/5 pointer-events-none"></div>

        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent mb-2">
            {t('login.welcome')}
          </h1>
          <p className="text-purple-100/80">{t('login.description')}</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/20 p-3 rounded-lg border border-red-500/30">
            <ExclamationCircleIcon className="w-5 h-5 text-red-400" />
            <span className="text-sm text-red-300">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" />
            <input
              type="text"
              placeholder={t('placeholders.username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 text-white placeholder:text-purple-200/60 transition-all"
              required
            />
          </div>

          <div className="relative">
            <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" />
            <input
              type="password"
              placeholder={t('placeholders.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 text-white placeholder:text-purple-200/60 transition-all"
              required
            />
          </div>

          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 text-white appearance-none transition-all"
              required
            >
              <option value="trainee">{t('placeholders.trainee')}</option>
              <option value="trainer">{t('placeholders.trainer')}</option>
              <option value="admin">{t('placeholders.admin')}</option>
            </select>
            <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 pointer-events-none" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-lg transform transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <LockClosedIcon className="w-5 h-5" />
          {t('buttons.signIn')}
        </button>

        <div className="text-center text-sm text-purple-200/80 space-y-2">
          <p className="hover:text-white transition-colursor-pointer">
            {t('login.forgotPassword')}
          </p>
          <p>
            {t('login.noAccount')}
          </p>
        </div>
      </form>
    </div>
  )
}
