// 📄 AssignHorsesToCompetitions.jsx – Dark Themed Version
import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useTranslation } from 'react-i18next';

export default function AssignHorsesToCompetitions() {
  const { userId } = useUserStore();
  const { t, i18n } = useTranslation();
  const [competitions, setCompetitions] = useState([]);
  const [horses, setHorses] = useState([]);
  const [selectedUserRole, setSelectedUserRole] = useState('trainee');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedHorseId, setSelectedHorseId] = useState('');

  const fetchAllData = async () => {
    try {
      const [compRes, horseRes] = await Promise.all([
        fetch('http://localhost:5000/api/competitions'),
        fetch('http://localhost:5000/api/horses')
      ]);
      setCompetitions(await compRes.json());
      setHorses(await horseRes.json());
    } catch (err) {
      alert('Failed to load data');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const assignHorse = async (competitionId) => {
    if (!competitionId || !selectedUserId || !selectedUserRole || !selectedHorseId) {
      return alert('All fields required');
    }
    try {
      const res = await fetch(`http://localhost:5000/api/competitions/${competitionId}/horses/assign-to-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horseId: selectedHorseId, userId: selectedUserId, userRole: selectedUserRole })
      });
      const result = await res.json();
      alert(result.message);
      fetchAllData();
    } catch (err) {
      alert('Failed to assign');
    }
  };

  const unassignHorse = async (competitionId, horseId, userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/competitions/${competitionId}/horses/unassign-from-user`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horseId, userId })
      });
      const result = await res.json();
      alert(result.message);
      fetchAllData();
    } catch (err) {
      alert('Failed to unassign');
    }
  };

  const userCompetitions = competitions.filter(c =>
    [...(c.Trainees || []), ...(c.Trainers || [])].some(u => u.id === selectedUserId)
  );

  const availableCompetitions = competitions.filter(c =>
    ![...(c.Trainees || []), ...(c.Trainers || [])].some(u => u.id === selectedUserId)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Title */}
        <h1 className="text-3xl font-bold text-yellow-400">{t('assignHorses.title')}</h1>

        {/* Selection Panel */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <select
            onChange={e => { setSelectedUserRole(e.target.value); setSelectedUserId(''); }}
            className="p-3 rounded bg-gray-700 text-white border border-gray-600"
          >
            <option value="trainee">{t('assignHorses.trainee')}</option>
            <option value="trainer">{t('assignHorses.trainer')}</option>
          </select>

          <select
            onChange={e => setSelectedUserId(e.target.value)}
            className="p-3 rounded bg-gray-700 text-white border border-gray-600"
          >
            <option value=''>{t('assignHorses.selectUser')}</option>
            {competitions.flatMap(c => selectedUserRole === 'trainee' ? c.Trainees || [] : c.Trainers || [])
              .reduce((unique, u) => unique.find(i => i.id === u.id) ? unique : [...unique, u], [])
              .map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
          </select>

          <select
            onChange={e => setSelectedHorseId(e.target.value)}
            className="p-3 rounded bg-gray-700 text-white border border-gray-600"
          >
            <option value=''>{t('assignHorses.selectHorse')}</option>
            {horses.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>

        {/* User's Competitions */}
        <h2 className="text-2xl font-semibold text-yellow-400">{t('assignHorses.yourCompetitions')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userCompetitions.map(c => (
            <div key={c.id} className="bg-gray-800 border border-yellow-400 rounded-xl p-6 space-y-3 shadow-md">
              <h3 className="text-xl font-bold text-yellow-300">{c.name} 🏆</h3>
              <p className="text-sm text-gray-400">{c.location} 📍 | {new Date(c.date).toISOString().slice(0, 10)} 📅</p>
              <p className="text-sm text-gray-400">Type: {c.type}</p>

              {/* Assigned Horses */}
              {(c.CompetitionHorseAssignments || []).filter(a => a.userId === selectedUserId).map(a => {
                const horse = horses.find(h => h.id === a.horseId);
                return horse ? (
                  <div key={a.id} className="flex justify-between items-center text-sm text-gray-300">
                    🐎 {horse.name}
                    <button
                      onClick={() => unassignHorse(c.id, horse.id, selectedUserId)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Unassign ❌
                    </button>
                  </div>
                ) : null;
              })}

              {(c.CompetitionHorseAssignments || []).filter(a => a.userId === selectedUserId).length === 0 && (
                <p className="text-sm italic text-gray-500">No horses assigned yet.</p>
              )}

              {/* Assign Button */}
              <button
                onClick={() => assignHorse(c.id)}
                disabled={!selectedHorseId || !selectedUserId}
                className="mt-4 w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg"
              >
                {t('assignHorses.assignHorse')}
              </button>
            </div>
          ))}
        </div>

        {/* Available Competitions */}
        <h2 className="text-2xl font-semibold text-yellow-400">{t('assignHorses.availableCompetitions')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {availableCompetitions.map(c => (
            <div key={c.id} className="bg-gray-800 rounded-xl p-6 border border-gray-600 shadow-md">
              <h3 className="text-xl font-bold text-white">{c.name} 🐎</h3>
              <p className="text-sm text-gray-400">{c.location} 📍 | {new Date(c.date).toISOString().slice(0, 10)} 📅</p>
              <p className="text-sm text-gray-400">Type: {c.type}</p>
              <p className="text-sm italic text-gray-500 mt-4">{t('assignHorses.availableCompetitionsText')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
