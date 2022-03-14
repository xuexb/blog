export default {
  type: 'mysql',
  adapter: {
    mysql: {
      encoding: 'utf8mb4',
      host: process.env.DB_HOST || 'rm-2zentm3d7v9zsuy4nuo.mysql.rds.aliyuncs.com',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_DATABASE || 'xiaowudev_blog_dev',
      user: process.env.DB_USER || 'xiaowu',
      password: process.env.DB_PASSWORD || 'xiaowu@123',
      prefix: process.env.DB_PREFIX || 'xiaowudev_',
      type: 'mysql'
    }
  }
};
