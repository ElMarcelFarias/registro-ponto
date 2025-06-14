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
    import useLogin from '../composables/useLogin'

    const { email, password, erro, logar } = useLogin()
</script>

  