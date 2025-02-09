import { App } from './app.js';

import { Database } from './database.js';

const app = new App({
  headers: {
    'Content-Type': 'application/json',
  }
});

const database = new Database()

app.get('/tasks', (req, res) => {
  const { search } = req.query

  const tasks = database.select('tasks', search ? {
    title: search,
    description: search
  } : {})

  res.end(JSON.stringify(tasks));
});

app.post('/tasks', (req, res) => {
  const { title, description } =  req.body;

  if (!title || !description) {
    return res.writeHead(400).end(JSON.stringify({ error: 'Title and description are required' }));
  }

  const task = {
    title,
    description,
    completed_at: null
  }

  const newTask = database.insert('tasks', task);

  res.writeHead(201).end(JSON.stringify(newTask));
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params

  const { title, description } = req.body

  const task = database.select('tasks', { id })[0]

  if (!task) {
    return res.writeHead(404).end(JSON.stringify({ error: 'Task not found' }))
  }

  const updatedTask = database.update('tasks', id, {
    title,
    description
  })

  return res.writeHead(200).end(JSON.stringify(updatedTask))
})

app.patch('/tasks/:id/complete', (req, res) => {
  const { id } = req.params

  const task = database.select('tasks', { id })[0]

  if (!task) {
    return res.writeHead(404).end(JSON.stringify({ error: 'Task not found' }))
  }

  const updatedTask = database.update('tasks', id, {
    completed_at: task.completed_at ? null : new Date().toISOString()
  })

  return res.writeHead(200).end(JSON.stringify(updatedTask))
})

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  const task = database.select('tasks', { id })[0]

  if (!task) {
    return res.writeHead(404).end(JSON.stringify({ error: 'Task not found' }))
  }

  database.delete('tasks', id)

  return res.writeHead(204).end()
});

app.init(3333);
