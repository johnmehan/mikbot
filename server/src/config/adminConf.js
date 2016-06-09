module.exports = {
  development: {
    dbUrl: 'mongodb://localhost:27017/telemetry',
    port: 8888,
    sslEnabled: false,
    sslPort: 8443,
    sslKeyPath: 'config/admin-key.pem',
    sslCertificatePath: 'config/admin-cert.pem',
    accesslogPath: 'log/admin-access.log',
    logPath: 'log/admin.log',
    logLevel: 'info',
    logMaxSize: 2097152,
    logMaxFiles: 5
  }
  , test: {
  }
  , production: {
  }
};
