import { ref } from 'vue'
import { useRouter } from 'vue-router'
import auth from '../store/auth'

export default function useLogin() {
  const email = ref('')
  const password = ref('')
  const erro = ref('')
  const router = useRouter()

  async function logar() {
    erro.value = ''
    try {
      const role = await auth.login(email.value, password.value)

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

  return {
    email,
    password,
    erro,
    logar
  }
}
