import { App } from './app.js';

import { Database } from './database.js';

const app = new App({
  headers: {
    'Content-Type': 'application/json',
  }
});

const database = new Database()

app.get('/users', (_, res) => {
  res.end(JSON.stringify(Array.from(database.select('users'))));
});

app.post('/users', (req, res) => {
  const { name, email } =  req.body;

  const user = {
    name,
    email,
  }

  const newUser = database.insert('users', user);

  res.end(JSON.stringify(newUser));
});

app.init(3333);
