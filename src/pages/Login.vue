<template>
    <div class="container vh-100 d-flex justify-content-center align-items-center bg-light">
      <div class="card shadow p-4" style="max-width: 400px; width: 100%;">
        <h2 class="text-center mb-4 text-primary">Sistema de Ponto</h2>
  
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" id="email" placeholder="Digite seu email" />
        </div>
  
        <div class="mb-3">
          <label for="senha" class="form-label">Senha</label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="Digite sua senha" />
        </div>
  
        <button class="btn btn-primary w-100" @click="logar">Entrar</button>
  
        <div v-if="erro" class="alert alert-danger mt-3 text-center">
          {{ erro }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import auth from '../store/auth'

const email = ref('')
const password = ref('')
const erro = ref('')
const router = useRouter()

async function logar() {
  erro.value = ''
  try {
    const role = await auth.login(email.value, password.value)

    console.log(role);

    if (role === true || role === 'true') {
      router.push('/admin')
    } else if (role === false || role === 'false') {
      router.push('/registro')
    } else {
      erro.value = 'Perfil desconhecido.'
    }

  } catch {
    erro.value = 'Email ou senha inválidos.'
  }
}
</script>
  