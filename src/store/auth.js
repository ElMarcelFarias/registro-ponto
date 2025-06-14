import { reactive } from 'vue'
import api from '../services/api'

const state = reactive({
  token: localStorage.getItem('token') || '',
  role: null,
})

export default {
  state,

  async login(email, password) {
    const response = await api.post('/login', { email, password })

   
    const { token, role } = response.data.data

    state.token = token
    state.role = role

    localStorage.setItem('token', token)
    localStorage.setItem('role', role)

    return role 
  },

  logout() {
    state.token = ''
    state.role = null
    localStorage.clear()
  },

  isAdmin() {
    return state.role === true || localStorage.getItem('role') === 'true'
  },

  isFuncionario() {
    return state.role === false || localStorage.getItem('role') === 'false'
  },
}
