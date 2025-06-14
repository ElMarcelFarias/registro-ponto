# Registro Ponto - Frontend Vue.js

Sistema de Registro de Ponto dos Funcionários  
Este projeto é o frontend desenvolvido em Vue.js que consome a API de ponto feita em Laravel 10 com autenticação JWT.

## Tecnologias Utilizadas

- [Vue 3](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)
- [Toastify JS](https://apvarun.github.io/toastify-js/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Vite](https://vitejs.dev/)

## Instalação

Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/pontoapp-vue.git
cd pontoapp-vue
```

Instale as dependências:
```bash
npm install
```

Rode o projeto localmente:
```bash
npm run dev
```

## O sistema estará disponível em:
http://localhost:5173

## Autenticação
* A autenticação utiliza JWT.
* Após o login bem-sucedido, o token é armazenado no localStorage e enviado automaticamente nas requisições autenticadas.

## Funcionalidades
* Login com verificação de perfil (admin ou usuário)
* Registro de ponto com validação de horário
* Exibição dos pontos registrados
* Logout
  
Tela administrativa para:
* Cadastro, edição e exclusão de usuários
* Geração de relatórios em PDF

Estrutura de Pastas
```bash
src/
├── assets/
├── components/
├── pages/
├── router/
├── services/
└── store/
```

Requisitos
* Node.js 18+

Projeto da API Laravel configurado e rodando (porta 8989 por padrão)

📄 Licença
MIT © [Marcel Leite de Farias](https://github.com/ElMarcelFarias)

Backend:
O backend da aplicação está disponível em:
[Backend](https://github.com/SEU_USUARIO/pontoapi-laravel10)


