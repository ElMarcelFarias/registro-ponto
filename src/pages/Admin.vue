<template>
    <div class="container py-5">
      <div class="text-center mb-5">
        <h2 class="text-primary">Painel do Administrador</h2>
        <p class="text-muted">Gerencie os funcionários e gere relatórios diários</p>
        <button class="btn btn-outline-primary mt-3" @click="gerarPDF">
          📄 Gerar Relatório PDF
        </button>
      </div>
  
      <div class="card mx-auto" style="max-width: 700px;">
        <div class="card-body">
          <h4 class="card-title text-center mb-4 text-secondary">Cadastrar Funcionário</h4>
  
          <form @submit.prevent="cadastrar">
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
                <input v-model="form.password" type="password" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Confirmação da Senha</label>
                <input v-model="form.password_confirmation" type="password" class="form-control" required />
              </div>
  
              <div class="col-md-6 mb-3">
                <label class="form-label">Tipo de Jornada</label>
                <select v-model="form.schedule_type" class="form-select" required>
                  <option value="regular">Regular</option>
                  <option value="especial">Especial</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Função</label>
                <select v-model="form.role" class="form-select" required>
                  <option value="admin">Administrador</option>
                  <option value="user">Funcionário</option>
                </select>
              </div>
  
              <div class="col-md-6 mb-3">
                <label class="form-label">Entrada Manhã</label>
                <input v-model="form.morning_clock_in" type="time" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Saída Manhã</label>
                <input v-model="form.morning_clock_out" type="time" class="form-control" required />
              </div>
  
              <div class="col-md-6 mb-3">
                <label class="form-label">Entrada Tarde</label>
                <input v-model="form.afternoon_clock_in" type="time" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Saída Tarde</label>
                <input v-model="form.afternoon_clock_out" type="time" class="form-control" required />
              </div>
            </div>
  
            <button type="submit" class="btn btn-success w-100 mt-3">Cadastrar Funcionário</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { reactive } from 'vue'
import api from '../services/api'
import Toastify from 'toastify-js'

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'funcionario',
  schedule_type: 'regular',
  morning_clock_in: '08:00',
  morning_clock_out: '12:00',
  afternoon_clock_in: '14:00',
  afternoon_clock_out: '18:00',
})

function showToast(msg, type = 'success') {
  Toastify({
    text: msg,
    duration: 4000,
    close: true,
    gravity: 'top',
    position: 'right',
    backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
    stopOnFocus: true,
  }).showToast()
}

async function cadastrar() {
  try {
    await api.post('/register', form)
    showToast('Funcionário cadastrado com sucesso!', 'success')
    Object.keys(form).forEach(key => form[key] = '')
  } catch (error) {
    console.error(error)
    showToast('Erro ao cadastrar funcionário.', 'error')
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
    showToast('Relatório PDF gerado com sucesso!', 'success')
  } catch (error) {
    console.error(error)
    showToast('Erro ao gerar PDF.', 'error')
  }
}
</script>
  