import crypto from 'node:crypto';

export class Database {
  #database = new Map();

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

    const id = data.id ?? crypto.randomBytes(16).toString('hex')

    const newData = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
    }

    this.#database.get(key).push(newData);

    return newData
  }
}