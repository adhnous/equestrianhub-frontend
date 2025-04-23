import { useEffect, useState } from 'react'
import { useUserStore } from '../../store/userStore'

export default function ManageHorses() {
  const { logout } = useUserStore()
  const [horses, setHorses] = useState([])
  const [newHorse, setNewHorse] = useState({ name: '', breed: '', condition: 'healthy' })

  const fetchHorses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/horses')
      const data = await res.json()
      setHorses(data)
    } catch (err) {
      console.error('Error fetching horses:', err)
    }
  }

  const handleAdd = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/horses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHorse)
      })
      const result = await res.json()
      alert(result.message || 'Horse added')
      setNewHorse({ name: '', breed: '', condition: 'healthy' })
      fetchHorses()
    } catch (err) {
      console.error('Add horse failed:', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/horses/${id}`, {
        method: 'DELETE'
      })
      fetchHorses()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  useEffect(() => {
    fetchHorses()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-pink-800">Manage Horses</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newHorse.name}
          onChange={e => setNewHorse({ ...newHorse, name: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Breed"
          value={newHorse.breed}
          onChange={e => setNewHorse({ ...newHorse, breed: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <select
          value={newHorse.condition}
          onChange={e => setNewHorse({ ...newHorse, condition: e.target.value })}
          className="p-2 border rounded mr-2"
        >
          <option value="healthy">Healthy</option>
          <option value="injured">Injured</option>
        </select>
        <button
          onClick={handleAdd}
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          Add Horse
        </button>
      </div>

      <ul className="divide-y divide-gray-200">
        {horses.map(horse => (
          <li key={horse.id} className="py-2 flex justify-between items-center">
            <span>{horse.name} ({horse.breed}) - {horse.condition}</span>
            <button
              onClick={() => handleDelete(horse.id)}
              className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

