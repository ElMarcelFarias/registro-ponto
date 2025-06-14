import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export default function useRegistroPonto() {
  const router = useRouter()
  const registro = ref(null)
  const currentTime = ref('00:00:00')

  function atualizarRelogio() {
    const agora = new Date()
    const horas = String(agora.getHours()).padStart(2, '0')
    const minutos = String(agora.getMinutes()).padStart(2, '0')
    const segundos = String(agora.getSeconds()).padStart(2, '0')
    currentTime.value = `${horas}:${minutos}:${segundos}`
  }

  async function buscarRegistros() {
    try {
      const response = await api.get('/today-records')
      registro.value = response.data.data[0]
    } catch (error) {
      console.error('Erro ao carregar registros:', error)
    }
  }

  async function registrarPonto() {
    try {
      const response = await api.post('/clockin')
      const mensagem = response.data?.message || 'Ponto registrado com sucesso!'
      const cor = response.status === 200 ? '#28a745' : '#ffc107'

      Toastify({
        text: mensagem,
        duration: 4000,
        gravity: 'top',
        position: 'right',
        backgroundColor: cor,
        className: 'rounded'
      }).showToast()

      if (response.status === 200) await buscarRegistros()

    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao registrar ponto.'
      Toastify({
        text: msg,
        duration: 4000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#dc3545',
        className: 'rounded'
      }).showToast()
    }
  }

  function logout() {
    localStorage.removeItem('token')
    router.push('/login')
  }

  onMounted(() => {
    atualizarRelogio()
    buscarRegistros()
    setInterval(atualizarRelogio, 1000)
  })

  return {
    currentTime,
    registro,
    registrarPonto,
    logout
  }
}
