// 📄 ManageHorses.jsx – Full CRUD Support for Horses (Extended Model)
import { useEffect, useState } from 'react';
import { FaHorse, FaTrash, FaEdit, FaPlusCircle, FaSpinner, FaTimes } from 'react-icons/fa';
import { useUserStore } from '../../store/userStore';
import { useTranslation } from 'react-i18next';


export default function ManageHorses() {
  const { t } = useTranslation();
  const { logout } = useUserStore();
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHorse, setEditingHorse] = useState(null);
  const [form, setForm] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    color: '',
    medicalHistory: '',
    imageUrl: ''
  });

  const fetchHorses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/horses');
      const data = await res.json();
      setHorses(data);
    } catch (err) {
      console.error('Error fetching horses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const endpoint = editingHorse ? `http://localhost:5000/api/horses/${editingHorse.id}` : 'http://localhost:5000/api/horses';
    const method = editingHorse ? 'PUT' : 'POST';
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to save horse');
      setForm({ name: '', breed: '', age: '', gender: 'male', height: '', weight: '', color: '', medicalHistory: '', imageUrl: '' });
      setEditingHorse(null);
      fetchHorses();
    } catch (err) {
      console.error('Save horse failed:', err);
    }
  };

  const handleEdit = (horse) => {
    setEditingHorse(horse);
    setForm({
      name: horse.name,
      breed: horse.breed,
      age: horse.age,
      gender: horse.gender,
      height: horse.height,
      weight: horse.weight,
      color: horse.color,
      medicalHistory: horse.medicalHistory,
      imageUrl: horse.imageUrl
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this horse?');
    if (!confirmed) return;
    try {
      await fetch(`http://localhost:5000/api/horses/${id}`, { method: 'DELETE' });
      fetchHorses();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  useEffect(() => { fetchHorses(); }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent">Manage Horses</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >Logout</button>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl space-y-4">
          <h2 className="text-xl font-semibold text-pink-300 mb-2">
            {editingHorse ? t('manageHorses.editHorse') : t('manageHorses.addHorse')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder={t('manageHorses.namePlaceholder')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-3 rounded bg-gray-700 text-white" />
            <input placeholder={t('manageHorses.breedPlaceholder')} value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="p-3 rounded bg-gray-700 text-white" />
            <input type="number" placeholder={t('manageHorses.agePlaceholder')} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="p-3 rounded bg-gray-700 text-white" />
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="p-3 rounded bg-gray-700 text-white">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input type="number" step="0.1" placeholder={t('manageHorses.heightPlaceholder')} value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} className="p-3 rounded bg-gray-700 text-white" />
            <input type="number" step="0.1" placeholder={t('manageHorses.weightPlaceholder')} value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="p-3 rounded bg-gray-700 text-white" />
            <input placeholder={t('manageHorses.colorPlaceholder')} value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="p-3 rounded bg-gray-700 text-white" />
            <input placeholder={t('manageHorses.imageUrlPlaceholder')} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="p-3 rounded bg-gray-700 text-white" />
            <textarea placeholder={t('manageHorses.medicalHistoryPlaceholder')} value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} className="p-3 rounded bg-gray-700 text-white col-span-2" rows="3"></textarea>
          </div>
          <div className="flex justify-end gap-4">
            {editingHorse && (
              <button onClick={() => { setEditingHorse(null); setForm({ name: '', breed: '', age: '', gender: 'male', height: '', weight: '', color: '', medicalHistory: '', imageUrl: '' }); }} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg flex items-center gap-2">
                <FaTimes /> Cancel
              </button>
            )}
            <button onClick={handleSubmit} className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg flex items-center gap-2">
              <FaPlusCircle /> {editingHorse ? t('manageHorses.updateHorse') : t('manageHorses.createHorse')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <FaSpinner className="animate-spin h-8 w-8 text-pink-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {horses.map(horse => (
              <div key={horse.id} className="bg-gray-800 p-5 rounded-lg border border-pink-500 shadow-sm flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-pink-400">{horse.name}</h3>
                  <p className="text-sm text-gray-300">{t('manageHorses.breed')}: {horse.breed}</p>
                  <p className="text-sm text-gray-300">{t('manageHorses.age')}: {horse.age}</p>
                  <p className="text-sm text-gray-300 capitalize">{t('manageHorses.gender')}: {horse.gender}</p>
                  <p className="text-sm text-gray-300">{t('manageHorses.height')}: {horse.height} m</p>
                  <p className="text-sm text-gray-300">{t('manageHorses.weight')}: {horse.weight} kg</p>
                  <p className="text-sm text-gray-300">{t('manageHorses.color')}: {horse.color}</p>
                  <p className="text-sm text-gray-300">{t('manageHorses.history')}: {horse.medicalHistory || 'N/A'}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEdit(horse)} className="text-indigo-400 hover:text-indigo-200">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(horse.id)} className="text-red-400 hover:text-red-300">
                    <FaTrash />
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
