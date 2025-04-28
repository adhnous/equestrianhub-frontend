import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set) => ({
      userId: null,
      username: '',
      role: '',
      _hasHydrated: false,

      login: ({ userId, username, role }) => set({ userId, username, role }),
      logout: () => set({ userId: null, username: '', role: '' }),
      setHasHydrated: () => set({ _hasHydrated: true })
    }),
    {
      name: 'user-store',
      getStorage: () => localStorage,
      onRehydrateStorage: () => () => {
        useUserStore.getState().setHasHydrated()
      }
    }
  )
)
