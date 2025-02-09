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

  select(key, search) {
    if (!this.#database.has(key)) {
      return [];
    }

    if (Object.keys(search).length > 0) {
      return Array.from(this.#database.get(key)).filter(data => {
        return Object.entries(search).some(([key, value]) => {
          return data[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return Array.from(this.#database.get(key));
  }

  insert(key, data) {
    if (!this.#database.has(key)) {
      this.#database.set(key, []);
    }

    const sanitizedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    const newData = {
      id: crypto.randomUUID(),
      ...sanitizedData,
      updated_at: null,
      created_at: new Date().toISOString(),
    }

    this.#database.get(key).push(newData);

    this.#persist()

    return newData
  }

  update(key, id, data) {
    if (!this.#database.has(key)) {
      return false;
    }
  
    const index = this.#database.get(key).findIndex(d => d.id === id);
  
    if (index === -1) {
      return false;
    }

    const sanitizedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );
  
    const updatedData = {
      ...this.#database.get(key)[index],
      ...sanitizedData,
      updated_at: new Date().toISOString(),
    };
  
    this.#database.get(key)[index] = updatedData;
  
    this.#persist();
  
    return updatedData;
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