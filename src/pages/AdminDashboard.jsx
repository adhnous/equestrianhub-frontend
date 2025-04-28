import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useUserStore } from '../store/userStore'
import { useNavigate } from 'react-router-dom'
import LanguageSwitcher from '../components/LanguageSwitcher'

import clsx from 'clsx'
import {
  ArrowRightIcon,
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  TrophyIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'

function StatCard({ label, value, color, icon: Icon }) {
  const colors = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-fuchsia-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-amber-500 to-yellow-500',
    pink: 'from-pink-500 to-rose-500'
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <span className="text-sm text-gray-400">{label}</span>
          <h2 className={`text-4xl font-bold bg-gradient-to-r ${colors[color]} bg-clip-text text-transparent`}>
            {value}
          </h2>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colors[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { username, logout } = useUserStore()
  const [stats, setStats] = useState({})
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, classesRes, horsesRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/users'),
          fetch('http://localhost:5000/api/training-classes'),
          fetch('http://localhost:5000/api/horses')
        ])

        const users = await usersRes.json()
        const classes = await classesRes.json()
        const horses = await horsesRes.json()

        const totalUsers = users.length
        const totalTrainers = users.filter(u => u.role?.toLowerCase() === 'trainer').length
        const totalTrainees = users.filter(u => u.role?.toLowerCase() === 'trainee').length
        const totalClasses = classes.length
        const totalHorses = horses.length

        setStats({ totalUsers, totalTrainers, totalTrainees, totalClasses, totalHorses })
      } catch (err) {
        console.error('❌ Failed to load admin stats:', err)
      }
    }

    fetchStats()
  }, [])

  const goToManagementPage = (section) => {
    navigate(`/admin/${section}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative">
        {/* Header */}
        <div className="flex justify-between items-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              {t('adminDashboard.title')} 👑
            </h1>
            <p className="text-sm text-gray-400">{t('adminDashboard.welcome')}, {username}</p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-red-200 hover:bg-red-500/10 text-red-400 transition-all group"
            >
              <span>{t('buttons.logout')}</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label={t('stats.totalUsers')} value={stats.totalUsers || 0} color="blue" icon={UsersIcon} />
          <StatCard label={t('stats.trainers')} value={stats.totalTrainers || 0} color="purple" icon={AcademicCapIcon} />
          <StatCard label={t('stats.trainees')} value={stats.totalTrainees || 0} color="green" icon={UserGroupIcon} />
          <StatCard label={t('stats.classes')} value={stats.totalClasses || 0} color="yellow" icon={BookOpenIcon} />
          <StatCard label={t('stats.horses')} value={stats.totalHorses || 0} color="pink" icon={SparklesIcon} />
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ManagementButton icon={UsersIcon} label={t('manage.users')} desc={t('manage.usersDesc')} path="users" color="blue" />
          <ManagementButton icon={AcademicCapIcon} label={t('manage.trainers')} desc={t('manage.trainersDesc')} path="trainers" color="purple" />
          <ManagementButton icon={UserGroupIcon} label={t('manage.trainees')} desc={t('manage.traineesDesc')} path="trainees" color="green" />
          <ManagementButton icon={BookOpenIcon} label={t('manage.classes')} desc={t('manage.classesDesc')} path="classes" color="yellow" />
          <ManagementButton icon={SparklesIcon} label={t('manage.horses')} desc={t('manage.horsesDesc')} path="horses" color="pink" />
          <ManagementButton icon={ChartBarIcon} label={t('manage.progress')} desc={t('manage.progressDesc')} path="progress" color="teal" />
          <ManagementButton
            icon={TrophyIcon}
            label={t('manage.competitions')}
            desc={t('manage.competitionsDesc')}
            path="manage-competitions"
            color="amber"
          />
        </div>
      </div>
    </div>
  )

  function ManagementButton({ icon: Icon, label, desc, path, color }) {
    return (
      <button
        onClick={() => goToManagementPage(path)}
        className={clsx(
          'group flex items-center gap-4 p-6 bg-white/5 rounded-xl border border-white/10 transition-all',
          {
            'hover:border-blue-500/50 hover:bg-blue-500/10': color === 'blue',
            'hover:border-purple-500/50 hover:bg-purple-500/10': color === 'purple',
            'hover:border-green-500/50 hover:bg-green-500/10': color === 'green',
            'hover:border-yellow-500/50 hover:bg-yellow-500/10': color === 'yellow',
            'hover:border-pink-500/50 hover:bg-pink-500/10': color === 'pink',
            'hover:border-teal-500/50 hover:bg-teal-500/10': color === 'teal',
            'hover:border-amber-500/50 hover:bg-amber-500/10': color === 'amber'
          }
        )}
      >
        <Icon
          className={clsx('w-8 h-8', {
            'text-blue-400': color === 'blue',
            'text-purple-400': color === 'purple',
            'text-green-400': color === 'green',
            'text-yellow-400': color === 'yellow',
            'text-pink-400': color === 'pink',
            'text-teal-400': color === 'teal',
            'text-amber-400': color === 'amber'
          })}
        />
        <span className="text-left">
          <h3 className="text-lg font-semibold text-white">{label}</h3>
          <p className="text-sm text-gray-400">{desc}</p>
        </span>
      </button>
    )
  }
}
