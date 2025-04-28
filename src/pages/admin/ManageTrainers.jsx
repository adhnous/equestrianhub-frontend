// 📄 ManageTrainers.jsx – Full Enhanced Version (with Dropdown Specialization)
import { useEffect, useState } from 'react';
import { FaSpinner, FaUserTie, FaTrash, FaEdit, FaPlusCircle, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function ManageTrainers() {
  const { t, i18n } = useTranslation();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [form, setForm] = useState({
    username: '', email: '', gender: 'male', specialization: '', password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch all trainers
  const fetchTrainers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/trainers');
      const data = await res.json();
      setTrainers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(t('manageTrainers.errorFetch'), err);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle add or update trainer
  const handleSubmit = async () => {
    if (!form.username.trim() || !form.email.trim() || (!editingTrainer && !form.password.trim())) {
      setErrorMsg(t('manageTrainers.fillAllFields'));
      return;
    }
    setErrorMsg('');
  
    const endpoint = editingTrainer
      ? `http://localhost:5000/api/trainers/${editingTrainer.id}`
      : 'http://localhost:5000/api/trainers';
    const method = editingTrainer ? 'PUT' : 'POST';
  
    const payload = {
      username: form.username,
      email: form.email,
      gender: form.gender,
      specialization: form.specialization
    };
    if (!editingTrainer) {
      payload.password = form.password;
    }
  
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(t('manageTrainers.errorSave'));
  
      setForm({ username: '', email: '', gender: 'male', specialization: '', password: '' });
      setEditingTrainer(null);
      fetchTrainers();
      setErrorMsg('✅ ' + t('manageTrainers.successCreate')); // <-- Show success!
    } catch (err) {
      console.error(err);
      setErrorMsg('⚠️ ' + t('manageTrainers.errorSave'));
    }
  };
  
  // Set form for editing
  const handleEdit = (trainer) => {
    setEditingTrainer(trainer);
    setForm({
      username: trainer.username || '',
      email: trainer.email || '',
      gender: trainer.gender || 'male',
      specialization: trainer.specialization || '',
      password: ''
    });
  };

  // Delete a trainer
  const handleDelete = async (id) => {
    const confirmed = window.confirm(t('manageTrainers.confirmDelete'));
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/trainers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(t('manageTrainers.errorDelete'));
      fetchTrainers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTrainers(); }, []);

  return (
    <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
            {t('manageTrainers.title')}
          </h1>
        </div>

        {/* Form Section */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-md space-y-6">
          {errorMsg && (
            <p className="text-red-400 font-semibold" role="alert" aria-live="assertive">
              ⚠️ {errorMsg}
            </p>
          )}
          <h2 className="text-xl font-semibold text-purple-300 mb-2">
            {editingTrainer ? t('manageTrainers.editTrainer') : t('manageTrainers.addNewTrainer')}
          </h2>

          {/* Trainer Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Username */}
            <input
              type="text"
              placeholder={t('manageTrainers.usernamePlaceholder')}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
            />

            {/* Email */}
            <input
              type="email"
              placeholder={t('manageTrainers.emailPlaceholder')}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
            />

            {/* Gender */}
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
            >
              <option value="male">{t('manageTrainers.genderMale')}</option>
              <option value="female">{t('manageTrainers.genderFemale')}</option>
            </select>

            {/* Specialization Dropdown */}
            <select
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
            >
              <option value="">{t('manageTrainers.selectSpecialization')}</option>
              <option value="Show Jumping">{t('manageTrainers.showJumping')}</option>
              <option value="Dressage">{t('manageTrainers.dressage')}</option>
              <option value="Endurance">{t('manageTrainers.endurance')}</option>
              <option value="Horse Racing">{t('manageTrainers.horseRacing')}</option>
              <option value="Other">{t('manageTrainers.other')}</option>
            </select>

            {/* Password */}
            {!editingTrainer && (
              <input
                type="password"
                placeholder={t('manageTrainers.passwordPlaceholder')}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
              />
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            {editingTrainer && (
              <button
                onClick={() => { setEditingTrainer(null); setForm({ username: '', email: '', gender: 'male', specialization: '', password: '' }); }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg flex items-center gap-2"
              >
                <FaTimes /> {t('manageTrainers.cancel')}
              </button>
            )}
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg flex items-center gap-2"
            >
              <FaPlusCircle /> {editingTrainer ? t('manageTrainers.updateTrainer') : t('manageTrainers.createTrainer')}
            </button>
          </div>
        </div>

        {/* Trainers List Section */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <FaSpinner className="animate-spin h-8 w-8 text-purple-400" />
          </div>
        ) : trainers.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">{t('manageTrainers.noTrainers')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="bg-gray-800 border border-purple-600 rounded-xl p-5 shadow-sm hover:shadow-purple-500/20 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <FaUserTie className="text-purple-400 w-5 h-5" />
                      <h2 className="text-lg font-semibold text-white">{trainer.username}</h2>
                    </div>
                    <p className="text-sm text-gray-300">📧 {trainer.email}</p>
                    <p className="text-sm text-gray-300 capitalize">👤 {trainer.gender === 'male' ? t('manageTrainers.genderMale') : t('manageTrainers.genderFemale')}</p>
                    <p className="text-sm text-gray-300">📚 {t('manageTrainers.specialization')}: {trainer.specialization || t('general.notAvailable')}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => handleEdit(trainer)} className="text-indigo-400 hover:text-indigo-200">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(trainer.id)} className="text-red-400 hover:text-red-300">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
