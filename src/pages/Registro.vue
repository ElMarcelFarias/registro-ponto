<template>
    <div class="container py-5">
  
      <div class="d-flex justify-content-end align-items-center mb-4">
        <button @click="logout" class="btn btn-danger btn-lg">
          Logout
        </button>
      </div>
  
      <div class="d-flex justify-content-center align-items-center mb-4">
        <h2 class="text-primary m-0">Registro de Ponto</h2>
      </div>

      <div class="text-center mb-4">
        <div class="display-4 fw-bold text-dark">
          {{ currentTime }}
        </div>
      </div>
  
      <div class="text-center mb-4">
        <button @click="registrarPonto" class="btn btn-success btn-lg px-5 py-3 rounded-2">
          🕒 Bater Ponto
        </button>
      </div>
  
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h4 class="text-secondary m-0">Registros de Hoje</h4>
      </div>
  
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
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
              <td colspan="4" class="text-center">Sem registros para hoje.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
</template>

<script setup>
    import useRegistroPonto from '../composables/useRegistroPonto'

    const {
    currentTime,
    registro,
    registrarPonto,
    logout
    } = useRegistroPonto()
</script>


<style scoped>
.display-4 {
    font-size: 3rem;
}
</style>
  