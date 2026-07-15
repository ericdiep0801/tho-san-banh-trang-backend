require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ricepaperhunter'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },
  production: {
    client: 'mysql2',
    connection: (() => {
      console.log('--- DEBUG INFO ---');
      console.log('DATABASE_URL is:', process.env.DATABASE_URL ? (process.env.DATABASE_URL.substring(0, 20) + '... (MASKED)') : 'UNDEFINED OR EMPTY!!!');
      console.log('------------------');
      
      if (!process.env.DATABASE_URL) return {};
      const url = new URL(process.env.DATABASE_URL);
      return {
        host: url.hostname,
        port: url.port || 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.replace(/^\//, ''),
        ssl: { rejectUnauthorized: false } // Phù hợp với Aiven MySQL
      };
    })(),
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
