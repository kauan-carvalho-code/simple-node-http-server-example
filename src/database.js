import fs from 'node:fs';

import crypto from 'node:crypto';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = new Map();

  constructor() {
    if (fs.existsSync(databasePath)) {
      const data = fs.readFileSync(databasePath, 'utf8');
      this.#database = new Map(Object.entries(JSON.parse(data)));
    } else {
      this.#persist();
    }
  }

  #persist() {
    fs.writeFileSync(databasePath, JSON.stringify(Object.fromEntries(this.#database)));
  }

  select(key) {
    if (!this.#database.has(key)) {
      return [];
    }

    return this.#database.get(key);
  }

  insert(key, data) {
    if (!this.#database.has(key)) {
      this.#database.set(key, []);
    }

    const newData = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    }

    this.#database.get(key).push(newData);

    this.#persist()

    return newData
  }

  delete(key, id) {
    if (!this.#database.has(key)) {
      return false;
    }

    const index = this.#database.get(key).findIndex(d => d.id === id);

    if (index === -1) {
      return false;
    }

    this.#database.get(key).splice(index, 1);

    this.#persist()

    return true;
  }
}