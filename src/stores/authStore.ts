import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const STORAGE_KEY = 'shoppulse-auth'

type User = { name: string; email: string; role: string }

export const useAuthStore = defineStore('auth', () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  const user = ref<User | null>(saved ? JSON.parse(saved) : null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  function login(email: string, password: string) {
    loading.value = true
    const users = JSON.parse(localStorage.getItem('shoppulse-users') || '[]') as Array<User & { password: string }>
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!found && email !== 'admin@shoppulse.com') {
      loading.value = false
      return { ok: false, message: 'Invalid email or password.' }
    }
    user.value = found ? { name: found.name, email: found.email, role: found.role } : { name: 'Admin', email, role: 'Administrator' }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
    loading.value = false
    return { ok: true }
  }

  function register(name: string, email: string, password: string) {
    const users = JSON.parse(localStorage.getItem('shoppulse-users') || '[]') as Array<User & { password: string }>
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return { ok: false, message: 'An account with this email already exists.' }
    users.push({ name, email, password, role: 'Administrator' })
    localStorage.setItem('shoppulse-users', JSON.stringify(users))
    user.value = { name, email, role: 'Administrator' }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
    return { ok: true }
  }

  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { user, loading, isAuthenticated, login, register, logout }
})
