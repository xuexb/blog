export default {
  type: 'mysql',
  adapter: {
    mysql: {
      encoding: 'utf8mb4',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      prefix: process.env.DB_PREFIX,
      type: 'mysql'
    }
  }
};
