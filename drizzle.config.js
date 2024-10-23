require('dotenv').config();
const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
    dialect: 'postgresql',
    schema: './src/db/schema',
    out: './src/db/migrations',
    dbCredentials: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL_ENABLE === 'true',
    },
    migrations: {
        prefix: 'timestamp',
        schema: 'public',
    },
    strict: true,
    verbose: true,
});
