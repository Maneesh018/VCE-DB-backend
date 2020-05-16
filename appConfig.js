let appConfig = {
  port: 3001,
  allowedCorsOrigin: "*",
  env: "dev",
  apiVersion: "/api/v1",
  db: {
    uri: "mongodb://127.0.0.1:27017/DiscussionAppDB",
  },
};
module.exports = {
  port: appConfig.port,
  allowedCorsOrigin: appConfig.allowedCorsOrigin,
  env: appConfig.env,
  db: appConfig.db,
  apiVersion: appConfig.apiVersion,
};
