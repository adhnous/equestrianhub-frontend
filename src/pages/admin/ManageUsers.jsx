// 📄 ManageUsers.jsx – Fixed: smart field-based user creation per role
import { useEffect, useState } from 'react'
import { FaSpinner, FaUserPlus, FaTrash, FaEdit } from 'react-icons/fa'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'trainee',
    gender: 'female',
    age: '',
    level: 'beginner',
    specialty: ''
  })

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getEndpoint = (role) => {
    const endpoints = {
      admin: 'admins',
      trainer: 'trainers',
      trainee: 'trainees'
    }
    return endpoints[role] || 'users'
  }

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill in all required fields')
      return
    }

    let payload = { ...newUser }
    if (newUser.role === 'trainee') {
      payload = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        gender: newUser.gender,
        age: Number(newUser.age),
        level: newUser.level,
        role: 'trainee'
      }
    } else if (newUser.role === 'trainer') {
      payload = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        gender: newUser.gender,
        specialty: newUser.specialty,
        role: 'trainer'
      }
    } else if (newUser.role === 'admin') {
      payload = {
        username: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: 'admin'
      }
    }

    try {
      const endpoint = getEndpoint(newUser.role)
      const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Failed to create user')

      alert('✅ User created!')
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'trainee',
        gender: 'female',
        age: '',
        level: 'beginner',
        specialty: ''
      })
      fetchUsers()
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

        {/* Create User Form */}
        <div className="bg-white p-4 rounded shadow mb-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input
              placeholder="Name"
              className="p-2 border rounded"
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              placeholder="Email"
              className="p-2 border rounded"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              placeholder="Password"
              type="password"
              className="p-2 border rounded"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            />
            <select
              className="p-2 border rounded"
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="trainee">Trainee</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
            {newUser.role !== 'admin' && (
              <select
                className="p-2 border rounded"
                value={newUser.gender}
                onChange={e => setNewUser({ ...newUser, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            )}
            {newUser.role === 'trainee' && (
              <>
                <input
                  placeholder="Age"
                  className="p-2 border rounded"
                  type="number"
                  value={newUser.age}
                  onChange={e => setNewUser({ ...newUser, age: e.target.value })}
                />
                <select
                  className="p-2 border rounded"
                  value={newUser.level}
                  onChange={e => setNewUser({ ...newUser, level: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </>
            )}
            {newUser.role === 'trainer' && (
              <input
                placeholder="Specialty"
                className="p-2 border rounded"
                value={newUser.specialty}
                onChange={e => setNewUser({ ...newUser, specialty: e.target.value })}
              />
            )}
          </div>

          <button
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaUserPlus /> Create
          </button>
        </div>

        {/* User Table */}
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Actions</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Name</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="text-center">
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-red-600 hover:underline"
                  >Delete</button>
                  <button
                    onClick={() => setEditingUser(user)}
                    className="text-blue-600 hover:underline ml-2"
                  >Edit</button>
                </td>
                <td className="p-2 border capitalize">{user.role}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.name || user.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}