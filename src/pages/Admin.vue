<template>
    <div class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="text-primary">Painel do Administrador</h2>
          <p class="text-muted">Gerencie os funcionários e gere relatórios diários</p>
        </div>
        <div class="text-end">
          <button class="btn btn-outline-danger me-2" @click="logout()">Logout</button>
          <button class="btn btn-outline-success me-2" @click="abrirModal()">➕ Cadastrar Funcionário</button>
          <button class="btn btn-outline-primary" @click="gerarPDF">📄 Relatório PDF</button>
        </div>
      </div>
  
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
    import { onMounted } from 'vue'
    import useAdmin from '../composables/useAdmin'

    const {
    usuarios,
    form,
    editando,
    abrirModal,
    editar,
    excluir,
    salvar,
    logout,
    gerarPDF,
    fetchUsuarios
    } = useAdmin()

    onMounted(fetchUsuarios)
</script>
  