const fs = require('fs');
const path = require('path');
const knex = require('knex');
const knexfile = require('./knexfile');

const env = process.env.NODE_ENV || 'development';
const knexDb = knex(knexfile[env]);

const dataDir = path.join(__dirname, 'data');

const readData = (file) => {
  try {
    const data = fs.readFileSync(path.join(dataDir, file), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (file, data) => {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2), 'utf8');
};

const db = {
  knex: knexDb,
  getProducts: () => readData('products.json'),
  saveProducts: (data) => writeData('products.json', data),
  
  getUsers: () => readData('users.json'),
  saveUsers: (data) => writeData('users.json', data),
  
  getOrders: () => readData('orders.json'),
  saveOrders: (data) => writeData('orders.json', data)
};

module.exports = db;
