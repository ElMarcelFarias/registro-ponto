import { ref, reactive } from 'vue'
import { Modal } from 'bootstrap'
import Toastify from 'toastify-js'
import api from '../services/api'
import { useRouter } from 'vue-router'

export default function useAdmin() {
  const router = useRouter()

  const usuarios = ref([])
  const editando = ref(false)
  let modal = null

  const form = reactive({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user',
    schedule_type: 'regular',
    interval: '',
    morning_clock_in: '08:00',
    morning_clock_out: '12:00',
    afternoon_clock_in: '14:00',
    afternoon_clock_out: '18:00',
  })

  function showToast(msg, type = 'success') {
    Toastify({
      text: msg,
      duration: 4000,
      gravity: 'top',
      position: 'right',
      close: true,
      stopOnFocus: true,
      style: {
        background: type === 'success' ? '#1e7e34' : '#c82333',
        borderRadius: '8px',
        color: '#fff',
      },
    }).showToast()
  }

  async function fetchUsuarios() {
    try {
      const response = await api.get('/user')
      usuarios.value = response.data.data.data
    } catch (e) {
      showToast('Erro ao carregar usuários', 'error')
    }
  }

  function abrirModal(usuario = null) {
    editando.value = !!usuario
    if (usuario) {
      Object.assign(form, {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
        schedule_type: usuario.schedule_type,
        interval: usuario.interval,
        morning_clock_in: usuario.morning_clock_in,
        morning_clock_out: usuario.morning_clock_out,
        afternoon_clock_in: usuario.afternoon_clock_in,
        afternoon_clock_out: usuario.afternoon_clock_out,
        password: '',
        password_confirmation: '',
      })
    } else {
      Object.keys(form).forEach(k => form[k] = k.includes('clock') ? '08:00' : '')
      form.role = 'user'
      form.schedule_type = 'regular'
    }
    modal = new Modal(document.getElementById('modalFuncionario'))
    modal.show()
  }

  async function editar(id) {
    try {
      const response = await api.get(`/user/${id}`)
      abrirModal(response.data.data)
    } catch (e) {
      showToast('Erro ao buscar dados do usuário', 'error')
    }
  }

  async function salvar() {
    try {
      if (editando.value) {
        await api.put(`/user/${form.id}`, form)
        showToast('Funcionário atualizado com sucesso!')
      } else {
        await api.post('/register', form)
        showToast('Funcionário cadastrado com sucesso!')
      }
      fetchUsuarios()
      modal.hide()
    } catch (e) {
      showToast('Erro ao salvar funcionário.', 'error')
      console.error(e)
    }
  }

  async function excluir(user) {
    if (!confirm(`Tem certeza que deseja excluir o funcionário "${user.name}"?`)) return

    try {
      await api.delete(`/user/${user.id}`)
      usuarios.value = usuarios.value.filter(u => u.id !== user.id)
      showToast('Funcionário excluído com sucesso!')
    } catch (e) {
      showToast('Erro ao excluir funcionário.', 'error')
    }
  }

  async function gerarPDF() {
    try {
      const response = await api.post('/attendance-report')

      const downloadUrl = response.data?.download_url
      if (!downloadUrl) return showToast('URL de download não encontrada.', 'error')

      const token = localStorage.getItem('token')

      const fileResponse = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!fileResponse.ok) throw new Error('Erro ao baixar o PDF')

      const blob = await fileResponse.blob()
      const fileURL = window.URL.createObjectURL(blob)
      const newTab = window.open()
      newTab.location.href = fileURL

      showToast('Relatório gerado com sucesso!')
    } catch (e) {
      showToast('Erro ao gerar PDF.', 'error')
    }
  }

  function logout() {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return {
    usuarios,
    form,
    editando,
    abrirModal,
    editar,
    excluir,
    salvar,
    logout,
    gerarPDF,
    fetchUsuarios,
  }
}
