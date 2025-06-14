<template>
    <div>
      <h2>Bem-vindo, {{ nome }}</h2>
      <p>Horário atual: {{ agora }}</p>
      <button @click="registrar('entrada_manha')">Entrada Manhã</button>
      <button @click="registrar('saida_manha')">Saída Manhã</button>
      <button @click="registrar('entrada_tarde')">Entrada Tarde</button>
      <button @click="registrar('saida_tarde')">Saída Tarde</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '../services/api'
  import auth from '../store/auth'
  
  const nome = ref(auth.state.user.nome)
  const agora = ref(new Date().toLocaleTimeString())
  
  setInterval(() => {
    agora.value = new Date().toLocaleTimeString()
  }, 1000)
  
  async function registrar(tipo) {
    try {
      await api.post('/registro-ponto', { tipo })
      alert('Registrado com sucesso!')
    } catch (e) {
      alert('Erro: ' + e.response?.data?.message || 'Registro bloqueado.')
    }
  }
  </script>
  