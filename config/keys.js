const { env } = process;
const MONGODB_URI =
  env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/test' : env.MONGODB_URI;

module.exports = {
  PORT: env.PORT || env.npm_package_config_port,
  NODE_ENV: env.NODE_ENV,
  MONGODB_URI,
  REDIS_URL: env.REDIS_URL,
};
