module.exports = {
  development: {
    dbUrl: 'mongodb://localhost:27017/telemetry',
    port: 8889,
    logPath: 'log/server.log',
    logLevel: 'info',
    logMaxSize: 209715200,
    logMaxFiles: 5
  }
  , test: {
  }
  , production: {
  }
};
