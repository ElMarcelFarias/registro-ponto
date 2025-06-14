<template>
    <div class="container py-5 text-center">
      <h2 class="text-primary mb-4">Registro de Ponto</h2>
  
      <div class="display-4 text-dark mb-3">
        <strong>{{ currentTime }}</strong>
      </div>
  
      <button @click="registrarPonto" class="btn btn-lg btn-success mb-4">
        🕒 Bater Ponto
      </button>
  
      <h4 class="text-secondary">Registros de Hoje</h4>
      <div class="table-responsive">
        <table class="table table-bordered table-striped mt-3">
          <thead class="thead-dark">
            <tr>
              <th>Entrada Manhã</th>
              <th>Saída Manhã</th>
              <th>Entrada Tarde</th>
              <th>Saída Tarde</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="registro">
              <td>{{ registro.morning_clock_in || 'PENDENTE' }}</td>
              <td>{{ registro.morning_clock_out || 'PENDENTE' }}</td>
              <td>{{ registro.afternoon_clock_in || 'PENDENTE' }}</td>
              <td>{{ registro.afternoon_clock_out || 'PENDENTE' }}</td>
            </tr>
            <tr v-else>
              <td colspan="4">Sem registros para hoje.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '../services/api'
  import Toastify from 'toastify-js'
  import "toastify-js/src/toastify.css"
  
  const registro = ref(null)
  const currentTime = ref('00:00:00')
  
  const atualizarRelogio = () => {
    const agora = new Date()
    const horas = agora.getHours().toString().padStart(2, '0')
    const minutos = agora.getMinutes().toString().padStart(2, '0')
    const segundos = agora.getSeconds().toString().padStart(2, '0')
    currentTime.value = `${horas}:${minutos}:${segundos}`
  }
  
  setInterval(atualizarRelogio, 1000)
  
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

        if (response.status === 200 && response.data?.data) {
        Toastify({
            text: response.data.message,
            duration: 4000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#28a745',
            className: 'rounded'
        }).showToast()

        await buscarRegistros() 
        } else {
        Toastify({
            text: 'Ponto não registrado. Tente novamente.',
            duration: 4000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#ffc107',
            className: 'rounded'
        }).showToast()
        }

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
  
  onMounted(() => {
    atualizarRelogio()
    buscarRegistros()
  })
  </script>
  
  <style scoped>
  .display-4 {
    font-size: 3rem;
  }
  </style>
  