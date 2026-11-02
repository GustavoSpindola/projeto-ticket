# Helpdesk · Sistema de Tickets

Front end em React para uma API de tickets de suporte: login, criação de tickets, listagem dos tickets do usuário, interações (comentários) e encerramento de tickets.

## Funcionalidades

- Login com e-mail e senha (token Bearer) e sessão persistida
- **Meus tickets**: lista apenas os tickets do usuário logado
- Criar ticket (título e descrição)
- Detalhe do ticket com interações: criar, editar e excluir
- Encerrar ticket (status `closed`, exibido como "Finalizado")

## Como rodar

Requer Node.js 20.19+ (ou 22.12+).

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente http://localhost:5173).

Outros comandos: `npm run build`, `npm run lint`.

### Sobre a API e o proxy

A API roda em `http` e em outro domínio, o que o navegador bloqueia (CORS). Em desenvolvimento, o Vite repassa as chamadas de `/api` para o servidor da API (veja `vite.config.js`). Por isso o projeto deve ser executado com `npm run dev`. Para usar outro servidor, copie `.env.example` para `.env` e altere `API_TARGET`.

## Estrutura

```
src/
├── components/   Layout, ProtectedRoute, InteractionItem
├── contexts/     AuthContext (sessão e usuário logado)
├── pages/        Login, Tickets, NewTicket, TicketDetail
├── services/     http (fetch + token + erros), authService, ticketService, interactionService, utils
├── App.jsx       rotas
└── styles.css    tema escuro e botões liquid glass
```

Regra de arquitetura: apenas `services/` fala com a API; páginas e componentes usam os serviços.

## Decisões e limitações

- A especificação (OpenAPI) só documenta as respostas 200, 201 e 422. Tratamos erros de forma defensiva e assumimos que 401 significa sessão expirada.
- Não existe `GET /tickets/{id}`; o detalhe localiza o ticket na lista de tickets do usuário (limite de 100).
- Os botões de editar, excluir e encerrar aparecem para o autor e para administradores; quem decide de fato é a API.
- O token fica em `localStorage` por simplicidade; em produção seria preferível cookie `HttpOnly`.