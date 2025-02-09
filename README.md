# Node.js HTTP Server Example

Este projeto é um exemplo simples de como implementar um servidor HTTP nativo do Node.js sem frameworks adicionais.

## 📌 Requisitos

- Node.js (versão 16 ou superior recomendada)

## 🚀 Como Executar o Servidor

1. Clone este repositório:
   ```sh
   git clone https://github.com/kauan-carvalho-code/simple-node-http-server-example.git
   cd simple-node-http-server-example
   ```

2. Execute o servidor:
   ```sh
   node server.js
   ```

3. O servidor será iniciado na porta `3333` e estará pronto para receber requisições.

## 🌍 Endpoints Disponíveis

| Método | Rota      | Descrição |
|--------|----------|------------|
| GET    | `/`      | Retorna uma mensagem de boas-vindas |
| POST   | `/users` | Retorna uma mensagem para requisições POST |

### 📥 Exemplo de Requisição `GET /`

#### Usando `curl`
```sh
curl -X GET http://localhost:3333/
```

#### Resposta:
```json
{
  "message": "Hello from GET /"
}
```

### 📤 Exemplo de Requisição `POST /users`

#### Usando `curl`
```sh
curl -X POST http://localhost:3333/users
```

#### Resposta:
```json
{
  "message": "Hello from POST /users"
}
```

## 🔧 Estrutura do Código

### `App` (Classe Principal)
- Gerencia os endpoints.
- Permite criar rotas `GET` e `POST`.
- Trata erros de forma padronizada.
- Usa `Map` para armazenar rotas de forma eficiente.

### `Endpoint`
- Representa uma rota específica.
- Gera um hash único para cada combinação `path + method`.

### `AppError`
- Classe de erro personalizada para manipulação de exceções.

## 📖 Como Funciona

1. Cada endpoint é registrado na instância do `App` com um hash baseado na URL e método HTTP.
2. O servidor escuta as requisições HTTP e verifica se a rota e método existem.
3. Caso a rota seja encontrada, a função de callback associada é executada.
4. Se a rota não existir, o servidor retorna um erro `404`.
5. Todos os erros são tratados de forma centralizada com JSON estruturado.

## 🛠 Personalização

Você pode facilmente adicionar mais métodos HTTP ou ajustar o comportamento do servidor:
```js
app.get('/about', (_, res) => {
  res.end(JSON.stringify({ message: 'This is the about page' }));
});
```

## 📜 Licença

Este projeto está sob a licença MIT.

