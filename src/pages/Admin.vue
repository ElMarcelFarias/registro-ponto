<template>
    <div class="container py-5">
      <!-- Cabeçalho -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="text-primary">Painel do Administrador</h2>
          <p class="text-muted">Gerencie os funcionários e gere relatórios diários</p>
        </div>
        <div class="text-end">
          <button class="btn btn-outline-success me-2" @click="abrirModal()">➕ Cadastrar Funcionário</button>
          <button class="btn btn-outline-primary" @click="gerarPDF">📄 Relatório PDF</button>
        </div>
      </div>
  
      <!-- Tabela de funcionários -->
      <div class="card mb-4">
        <div class="card-body table-responsive">
          <h5 class="card-title text-center text-secondary mb-3">Funcionários Cadastrados</h5>
          <table class="table table-hover table-bordered">
            <thead class="table-light">
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Função</th>
                <th>Jornada</th>
                <th style="width: 150px;">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in usuarios" :key="user.id">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role === 'admin' ? 'Administrador' : 'Funcionário' }}</td>
                <td>{{ user.schedule_type }}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-1" @click="editar(user.id)">✏️</button>
                  <button class="btn btn-sm btn-danger" @click="excluir(user)">🗑️</button>
                </td>
              </tr>
              <tr v-if="usuarios.length === 0">
                <td colspan="6" class="text-center text-muted">Nenhum funcionário cadastrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Modal -->
      <div class="modal fade" id="modalFuncionario" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <form @submit.prevent="salvar">
              <div class="modal-header">
                <h5 class="modal-title">{{ editando ? 'Editar Funcionário' : 'Cadastrar Funcionário' }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Nome</label>
                    <input v-model="form.name" class="form-control" required />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Email</label>
                    <input v-model="form.email" type="email" class="form-control" required />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Senha</label>
                    <input v-model="form.password" type="password" class="form-control" :required="!editando" />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Confirmar Senha</label>
                    <input v-model="form.password_confirmation" type="password" class="form-control" :required="!editando" />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Tipo de Jornada</label>
                    <select v-model="form.schedule_type" class="form-select">
                      <option value="regular">Regular</option>
                      <option value="especial">Especial</option>
                    </select>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Função</label>
                    <select v-model="form.role" class="form-select">
                      <option value="admin">Administrador</option>
                      <option value="user">Funcionário</option>
                    </select>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Intervalo</label>
                    <select v-model="form.interval" class="form-select">
                      <option disabled value="">Selecione</option>
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="60">1 hora</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Entrada Manhã</label>
                    <input v-model="form.morning_clock_in" type="time" class="form-control" />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Saída Manhã</label>
                    <input v-model="form.morning_clock_out" type="time" class="form-control" />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Entrada Tarde</label>
                    <input v-model="form.afternoon_clock_in" type="time" class="form-control" />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Saída Tarde</label>
                    <input v-model="form.afternoon_clock_out" type="time" class="form-control" />
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-success">{{ editando ? 'Salvar Alterações' : 'Cadastrar' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { Modal } from 'bootstrap'
  import Toastify from 'toastify-js'
  import api from '../services/api'
  
  const usuarios = ref([])
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
  
  const editando = ref(false)
  let modal = null
  
  onMounted(fetchUsuarios)
  
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
  
    async function salvar() {
        try {
            if (editando.value) {
            await api.put(`/user/${form.id}`, form)
            showToast('Funcionário atualizado com sucesso!', 'success')
        } else {
            await api.post('/register', form)
            showToast('Funcionário cadastrado com sucesso!', 'success')
        }

        fetchUsuarios();
        modal.hide();

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
            showToast('Funcionário excluído com sucesso!', 'success')
        } catch (e) {
            showToast('Erro ao excluir funcionário.', 'error')
            console.error(e)
        }
    }
  
    async function gerarPDF() {
        try {
            const res = await api.get('/relatorio', { responseType: 'blob' })
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'relatorio.pdf')
            document.body.appendChild(link)
            link.click()
            showToast('Relatório gerado com sucesso!', 'success')
        } catch (e) {
            showToast('Erro ao gerar PDF.', 'error')
        }
    }
  </script>
  