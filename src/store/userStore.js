import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set) => ({
      userId: null,
      username: '',
      role: '',

      login: ({ userId, username, role }) => set({ userId, username, role }),

      logout: () => set({ userId: null, username: '', role: '' })
    }),
    {
      name: 'user-store', // Key in localStorage
      getStorage: () => localStorage // Or sessionStorage if you prefer
    }
  )
)
