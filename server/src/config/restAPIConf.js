module.exports = {
  development: {
    dbUrl: 'mongodb://localhost:27017/telemetry',
    port: 7777,
    accesslogPath: 'log/server-access.log',
    logPath: 'log/server.log',
    logLevel: 'info',
    logMaxSize: 209715200,
    logMaxFiles: 5
  }
  , test: {
  }
};
