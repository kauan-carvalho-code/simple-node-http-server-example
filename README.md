# Node.js HTTP Server Example

Este projeto implementa um servidor HTTP utilizando Node.js sem frameworks adicionais. Ele gerencia requisições HTTP, mantém um banco de dados simples baseado em arquivos e fornece endpoints para manipular tarefas.

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
   node src/server.js
   ```

3. O servidor será iniciado na porta `3333` e estará pronto para receber requisições.

## 🌍 Endpoints Disponíveis

| Método | Rota                  | Descrição                                        |
|--------|-----------------------|--------------------------------------------------|
| GET    | `/tasks`              | Retorna a lista de tarefas                      |
| POST   | `/tasks`              | Cria uma nova tarefa                            |
| PUT    | `/tasks/:id`          | Atualiza título e descrição de uma tarefa       |
| PATCH  | `/tasks/:id/complete` | Marca uma tarefa como concluída ou reabre       |
| DELETE | `/tasks/:id`          | Exclui uma tarefa                               |

### 📥 Exemplo de Requisição `GET /tasks`

#### Usando `curl`
```sh
curl -X GET http://localhost:3333/tasks
```

#### Resposta:
```json
[
  {
    "id": "123",
    "title": "Comprar pão",
    "description": "Ir à padaria comprar pão fresco",
    "completed_at": null,
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": null
  }
]
```

## 🔧 Estrutura do Código

### `App` (Classe Principal)
- Gerencia os endpoints HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- Armazena as rotas de forma eficiente.
- Processa requisições e respostas de maneira padronizada.
- Suporta query params e extração de parâmetros dinâmicos de rotas.

### `Database` (Banco de Dados Simples)
- Gerencia os dados localmente via um arquivo JSON (`db.json`).
- Permite inserir, buscar, atualizar e excluir registros.
- Persistência garantida entre execuções do servidor.

### `Endpoint`
- Representa um endpoint específico do servidor.
- Gera um regex para permitir parâmetros dinâmicos na URL.

### `AppError`
- Classe de erro personalizada para padronizar respostas de erro HTTP.

## 📂 Estrutura de Arquivos

```
📂 src
 ├── 📄 app.js           # Lógica principal do servidor HTTP
 ├── 📄 database.js      # Banco de dados baseado em arquivos
 ├── 📄 server.js        # Configuração e inicialização do servidor
 ├── 📂 streams
 │    ├── 📄 import-csv.js # Script para importar tarefas a partir de um CSV
```

## 🛠 Importação de CSV

O projeto permite importar tarefas a partir de um arquivo CSV usando o script `import-csv.js`. O arquivo CSV deve conter os seguintes campos:

```
title,description
Comprar leite,Ir ao mercado comprar leite integral
Estudar JavaScript,Revisar conceitos de closures
```

Para importar as tarefas:
```sh
node src/streams/import-csv.js
```

## 📜 Licença

Este projeto está sob a licença MIT.

