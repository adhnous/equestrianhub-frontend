import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSpinner, FaUserPlus, FaUsersCog } from 'react-icons/fa';

export default function ManageUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all'); // ✅ NEW - Role Filter
  const [newUser, setNewUser] = useState({
    name: '', email: '', password: '', role: 'trainee', gender: 'female', age: '', level: 'beginner', specialization: ''
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getEndpoint = (role) => ({ admin: 'admins', trainer: 'trainers', trainee: 'trainees' }[role] || 'users');

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert(t('manageUsers.fillAllFields'));
      return;
    }
    setIsSaving(true);

    const payload = {
      trainee: {
        ...newUser,
        age: Number(newUser.age),
        role: 'trainee'
      },
      trainer: {
        username: newUser.name,
        password: newUser.password,
        email: newUser.email,
        gender: newUser.gender,
        specialization: newUser.specialization,
        role: 'trainer'
      },
      admin: {
        username: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: 'admin'
      }
    }[newUser.role];

    try {
      const res = await fetch(`http://localhost:5000/api/${getEndpoint(newUser.role)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(t('manageUsers.errorCreate'));

      alert('✅ ' + t('manageUsers.userCreated'));
      setNewUser({ name: '', email: '', password: '', role: 'trainee', gender: 'female', age: '', level: 'beginner', specialization: '' });
      fetchUsers();
    } catch (err) {
      alert('❌ ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(t('manageUsers.confirmDelete', { name: user.name || user.username }))) return;
    try {
      const res = await fetch(`http://localhost:5000/api/${getEndpoint(user.role)}/${user.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(t('manageUsers.errorDelete'));
      fetchUsers();
    } catch (err) {
      alert(t('manageUsers.errorDelete') + ': ' + err.message);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser.name || !editingUser.email) {
      alert(t('manageUsers.fillAllFields'));
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/${getEndpoint(editingUser.role)}/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });

      if (!res.ok) throw new Error(t('manageUsers.errorUpdate'));
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(t('manageUsers.errorUpdate') + ': ' + err.message);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ✅ Filtered Users
  const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-3">
            <FaUsersCog className="text-purple-400" />
            {t('manageUsers.title')}
          </h1>

          {/* ✅ Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded bg-gray-700 text-gray-100 border border-gray-600"
          >
            <option value="all">{t('manageUsers.allRoles')}</option>
            <option value="admin">{t('manageUsers.roleAdmin')}</option>
            <option value="trainer">{t('manageUsers.roleTrainer')}</option>
            <option value="trainee">{t('manageUsers.roleTrainee')}</option>
          </select>
        </div>

        {/* Create User Form */}
        <div className="mb-12 bg-gray-700 p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6">{t('manageUsers.addNewUser')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input placeholder={t('manageUsers.namePlaceholder')} className="input-style" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
            <input placeholder={t('manageUsers.emailPlaceholder')} className="input-style" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
            <input placeholder={t('manageUsers.passwordPlaceholder')} type="password" className="input-style" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
            <select className="input-style" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="trainee">{t('manageUsers.roleTrainee')}</option>
              <option value="trainer">{t('manageUsers.roleTrainer')}</option>
              <option value="admin">{t('manageUsers.roleAdmin')}</option>
            </select>

            {newUser.role !== 'admin' && (
              <select className="input-style" value={newUser.gender} onChange={e => setNewUser({ ...newUser, gender: e.target.value })}>
                <option value="male">{t('manageUsers.genderMale')}</option>
                <option value="female">{t('manageUsers.genderFemale')}</option>
              </select>
            )}

            {newUser.role === 'trainee' && (
              <>
                <input placeholder={t('manageUsers.agePlaceholder')} type="number" className="input-style" value={newUser.age} onChange={e => setNewUser({ ...newUser, age: e.target.value })} />
                <select className="input-style" value={newUser.level} onChange={e => setNewUser({ ...newUser, level: e.target.value })}>
                  <option value="beginner">{t('manageUsers.levelBeginner')}</option>
                  <option value="intermediate">{t('manageUsers.levelIntermediate')}</option>
                  <option value="advanced">{t('manageUsers.levelAdvanced')}</option>
                </select>
              </>
            )}

            {newUser.role === 'trainer' && (
              <input placeholder={t('manageUsers.specializationPlaceholder')} className="input-style" value={newUser.specialization} onChange={e => setNewUser({ ...newUser, specialization: e.target.value })} />
            )}
          </div>

          <button
            onClick={handleAddUser}
            disabled={isSaving}
            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-2xl"
          >
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaUserPlus />}
            {t('manageUsers.createUserBtn')}
          </button>
        </div>

        {/* Users List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <FaSpinner className="animate-spin mx-auto text-5xl text-purple-400" />
          ) : (
            filteredUsers.map(user => (
              <div key={user.id} className="bg-gray-700 rounded-2xl p-6 shadow-md border border-gray-600 hover:shadow-xl transition">
                <h3 className="text-xl font-bold">{user.name || user.username}</h3>
                <p className="text-sm text-gray-300 mt-1">📧 {user.email}</p>
                <p className="text-sm text-gray-400 capitalize">👤 {t('manageUsers.roleLabel')}: {user.role}</p>
                {user.gender && <p className="text-sm text-gray-400">🚻 {t('manageUsers.genderLabel')}: {user.gender}</p>}
                {user.level && <p className="text-sm text-gray-400">🎓 {t('manageUsers.levelLabel')}: {user.level}</p>}
                {user.specialization && <p className="text-sm text-gray-400">📚 {t('manageUsers.specializationLabel')}: {user.specialization}</p>}
                {user.age && <p className="text-sm text-gray-400">🎂 {t('manageUsers.ageLabel')}: {user.age}</p>}

                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => setEditingUser(user)} className="text-indigo-400 hover:text-indigo-300 text-sm">{t('manageUsers.edit')}</button>
                  <button onClick={() => handleDelete(user)} className="text-red-400 hover:text-red-300 text-sm">{t('manageUsers.delete')}</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* Tailwind input dark theme shortcut */
const inputStyle = `
p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none
`;

