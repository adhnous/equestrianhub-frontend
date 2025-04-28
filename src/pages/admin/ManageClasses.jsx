// 📄 ManageClasses.jsx 
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../store/userStore';
import {
  TrashIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function ManageClasses() {
  const { t, i18n } = useTranslation();
  const { userId } = useUserStore();

  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [newClass, setNewClass] = useState({
    title: '', description: '', startDate: '', endDate: '', cost: '', trainerId: ''
  });
  const [editingClass, setEditingClass] = useState(null);

  const fetchAllData = async () => {
    try {
      const [clsRes, trainerRes, traineeRes] = await Promise.all([
        fetch('http://localhost:5000/api/training-classes'),
        fetch('http://localhost:5000/api/trainers'),
        fetch('http://localhost:5000/api/trainees')
      ]);
      const [clsData, trainerData, traineeData] = await Promise.all([
        clsRes.json(), trainerRes.json(), traineeRes.json()
      ]);
      setClasses(clsData);
      setTrainees(traineeData);
      setTrainers(trainerData);
    } catch (err) {
      alert('Failed to load data');
    }
  };

  const handleAdd = async () => {
    if (!newClass.title || !newClass.trainerId || !newClass.startDate) {
      alert(t('AdminManageClasses.fillAllFields'));
      return;
    }
    try {
      const payload = {
        title: newClass.title,
        description: newClass.description,
        trainerId: newClass.trainerId,
        scheduleDate: newClass.startDate,    // ✅ rename startDate to scheduleDate
        endDate: newClass.endDate,
        cost: newClass.cost
      };
  
      const res = await fetch('http://localhost:5000/api/training-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) throw new Error(t('AdminManageClasses.createFailed'));
  
      setNewClass({
        title: '', description: '', startDate: '', endDate: '', cost: '', trainerId: ''
      });
      fetchAllData();
      alert(t('AdminManageClasses.createSuccess'));
    } catch (err) {
      alert('Create error: ' + err.message);
    }
  };
  
  const handleDelete = async (id) => {
    const confirmed = window.confirm(t('AdminManageClasses.confirmDelete'));
    if (!confirmed) return;
    try {
      const res = await fetch(`http://localhost:5000/api/training-classes/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(t('AdminManageClasses.deleteFailed'));
      setClasses(prev => prev.filter(cls => cls.id !== id));
      alert(t('AdminManageClasses.deleteSuccess'));
    } catch (err) {
      alert('Error deleting class: ' + err.message);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  const getTrainerName = (id) => trainers.find(t => t.id === id)?.name || t('AdminManageClasses.unassigned');
  const getTrainerSpec = (id) => trainers.find(t => t.id === id)?.specialty || t('AdminManageClasses.notAvailable');
  const getTraineeNames = (ids) => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) return [];
    return trainees.filter(t => ids.includes(t.id)).map(t => `${t.username} (${t.level})`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            {t('AdminManageClasses.title')}
          </h1>
        </div>

        {/* Class Form */}
        <div className="mb-8 bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-amber-400">
            {editingClass ? t('AdminManageClasses.editClass') : t('AdminManageClasses.addNewClass')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <input 
                type="text" 
                placeholder={t('AdminManageClasses.titlePlaceholder')} 
                className="p-3 rounded bg-gray-700 text-white w-full" 
                value={(editingClass || newClass).title} 
                onChange={e => (editingClass ? setEditingClass({ ...editingClass, title: e.target.value }) : setNewClass({ ...newClass, title: e.target.value }))}
              />
            </div>
            <div>
              <input 
                type="text" 
                placeholder={t('AdminManageClasses.descriptionPlaceholder')} 
                className="p-3 rounded bg-gray-700 text-white w-full" 
                value={(editingClass || newClass).description} 
                onChange={e => (editingClass ? setEditingClass({ ...editingClass, description: e.target.value }) : setNewClass({ ...newClass, description: e.target.value }))}
              />
            </div>
            <div>
              <input 
                type="number" 
                placeholder={t('AdminManageClasses.costPlaceholder')} 
                className="p-3 rounded bg-gray-700 text-white w-full" 
                value={(editingClass || newClass).cost} 
                onChange={e => (editingClass ? setEditingClass({ ...editingClass, cost: e.target.value }) : setNewClass({ ...newClass, cost: e.target.value }))}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-400 mb-1">{t('AdminManageClasses.startDate')}</label>
              <input 
                type="date" 
                className="p-3 rounded bg-gray-700 text-white w-full" 
                value={(editingClass || newClass).startDate} 
                onChange={e => (editingClass ? setEditingClass({ ...editingClass, startDate: e.target.value }) : setNewClass({ ...newClass, startDate: e.target.value }))}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-400 mb-1">{t('AdminManageClasses.endDate')}</label>
              <input 
                type="date" 
                className="p-3 rounded bg-gray-700 text-white w-full" 
                value={(editingClass || newClass).endDate} 
                onChange={e => (editingClass ? setEditingClass({ ...editingClass, endDate: e.target.value }) : setNewClass({ ...newClass, endDate: e.target.value }))}
              />
            </div>
            <div>
              <select 
                className="p-3 rounded bg-gray-700 text-white w-full" 
                value={(editingClass || newClass).trainerId} 
                onChange={e => (editingClass ? setEditingClass({ ...editingClass, trainerId: e.target.value }) : setNewClass({ ...newClass, trainerId: e.target.value }))}
              >
                <option value="">{t('AdminManageClasses.selectTrainer')}</option>
                {trainers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            {editingClass ? (
              <>
                <button
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white flex gap-2 items-center"
                >
                  <XMarkIcon className="w-4 h-4" /> {t('AdminManageClasses.cancel')}
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded font-semibold flex items-center gap-2"
                >
                  <PencilSquareIcon className="w-5 h-5" /> {t('AdminManageClasses.updateClass')}
                </button>
              </>
            ) : (
              <button
                onClick={handleAdd}
                className="w-full py-3 rounded bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-2"
              >
                <PlusCircleIcon className="w-5 h-5" /> {t('AdminManageClasses.createClass')}
              </button>
            )}
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map(cls => (
            <div key={cls.id} className="bg-gray-800 rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-amber-400">{cls.title}</h3>
                  <p className="text-gray-300 mb-2">{cls.description}</p>
                  <p className="text-sm text-gray-400 mb-1">💰 {t('AdminManageClasses.cost')}: ${cls.cost}</p>
                  <p className="text-sm text-gray-400 mb-1">👤 {t('AdminManageClasses.trainer')}: {getTrainerName(cls.trainerId)} ({getTrainerSpec(cls.trainerId)})</p>
                  <p className="text-sm text-gray-400 mb-2">📅 {new Date(cls.startDate).toLocaleDateString(i18n.language)} → {new Date(cls.endDate).toLocaleDateString(i18n.language)}</p>
                  {cls.enrolledTrainees && cls.enrolledTrainees.length > 0 && (
                    <div className="text-sm text-gray-300">
                      👥 {t('AdminManageClasses.enrolled')}:
                      <ul className="list-disc ml-6">
                        {getTraineeNames(cls.enrolledTrainees).map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => setEditingClass(cls)} className="p-2 text-amber-400 hover:bg-amber-500/20 rounded">
                    <PencilSquareIcon className="w-6 h-6" />
                  </button>
                  <button onClick={() => handleDelete(cls.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded">
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
