import { App } from './app.js';

import { Database } from './database.js';

const app = new App({
  headers: {
    'Content-Type': 'application/json',
  }
});

const database = new Database()

app.get('/users', (req, res) => {
  const { search } = req.query

  const users = database.select('users', search ? {
    name: search
  } : {})

  res.end(JSON.stringify(users));
});

app.post('/users', (req, res) => {
  const { name, email } =  req.body;

  const user = {
    name,
    email,
  }

  const newUser = database.insert('users', user);

  res.writeHead(201).end(JSON.stringify(newUser));
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params

  const updatedUser = database.update('users', id, req.body)

  return res.writeHead(200).end(JSON.stringify(updatedUser))
})

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  database.delete('users', id)

  return res.writeHead(204).end()
});

app.init(3333);
