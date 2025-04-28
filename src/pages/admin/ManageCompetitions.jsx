// 📄 ManageCompetitions.jsx – Full CRUD Management for Competitions
import { useEffect, useState } from 'react';
import { FaTrophy, FaEdit, FaTrash, FaPlus, FaSpinner, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function ManageCompetitions() {
  console.log("✅ ManageCompetitions page loaded");
  const { t } = useTranslation();
  const [competitions, setCompetitions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    date: '',
    location: '',
    type: 'jumping'
  });

  const fetchCompetitions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/competitions');
      const data = await res.json();
      setCompetitions(data);
    } catch (err) {
      console.error(t('manageCompetitions.errorFetch'), err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const method = editing ? 'PUT' : 'POST';
    const endpoint = editing
      ? `http://localhost:5000/api/competitions/${editing.id}`
      : 'http://localhost:5000/api/competitions';
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(t('manageCompetitions.errorSave'));
      await fetchCompetitions();
      setForm({ name: '', date: '', location: '', type: 'jumping' });
      setEditing(null);
    } catch (err) {
      console.error(t('manageCompetitions.errorSave'), err);
    }
  };

  const handleEdit = (comp) => {
    setEditing(comp);
    setForm({
      name: comp.name,
      date: comp.date?.substring(0, 10),
      location: comp.location,
      type: comp.type
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('manageCompetitions.confirmDelete'))) return;
    try {
      await fetch(`http://localhost:5000/api/competitions/${id}`, { method: 'DELETE' });
      fetchCompetitions();
    } catch (err) {
      console.error(t('manageCompetitions.errorDelete'), err);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-400 flex items-center gap-3">
            <FaTrophy /> {t('manageCompetitions.title')}
          </h1>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">{editing ? t('manageCompetitions.editCompetition') : t('manageCompetitions.newCompetition')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder={t('manageCompetitions.name')}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-3 rounded bg-gray-700 text-white"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="p-3 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              placeholder={t('manageCompetitions.location')}
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="p-3 rounded bg-gray-700 text-white"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="p-3 rounded bg-gray-700 text-white"
            >
              <option value="jumping">{t('manageCompetitions.type.jump')}</option>
              <option value="racing">{t('manageCompetitions.type.race')}</option>
              <option value="dressage">{t('manageCompetitions.type.dressage')}</option>
              <option value="other">{t('manageCompetitions.type.other')}</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            {editing && (
              <button
                onClick={() => {
                  setEditing(null);
                  setForm({ name: '', date: '', location: '', type: 'jumping' });
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg flex items-center gap-2"
            >
              <FaPlus /> {editing ? t('manageCompetitions.updateCompetition') : t('manageCompetitions.createCompetition')}
            </button>
          </div>
        </div>

        {/* Competition List */}
        {loading ? (
          <div className="text-center py-10">
            <FaSpinner className="animate-spin text-yellow-400 text-3xl mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((comp) => (
              <div
                key={comp.id}
                className="bg-gray-800 border border-yellow-500 rounded-xl p-5 shadow hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-yellow-400">{t('manageCompetitions.name')}: {comp.name}</h3>
                <p className="text-sm text-gray-300">📍 {comp.location}</p>
                <p className="text-sm text-gray-300">📅 {new Date(comp.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-300">📇 {t('manageCompetitions.type')}: {comp.type}</p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleEdit(comp)}
                    className="text-indigo-400 hover:text-indigo-200 text-sm flex items-center gap-1"
                  >
                    <FaEdit /> {t('manageCompetitions.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(comp.id)}
                    className="text-red-400 hover:text-red-200 text-sm flex items-center gap-1"
                  >
                    <FaTrash /> {t('manageCompetitions.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}