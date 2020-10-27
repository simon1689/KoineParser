const config = require("./config").config;
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: config.DB_URL_MYSQL.host,
  user: config.DB_URL_MYSQL.user,
  password: config.DB_URL_MYSQL.password,
  database: config.DB_URL_MYSQL.database,
});

connection.connect(() => {
  // require('../Models/Article').initialize();
});

let databaseConnection = () => {
  return connection;
};

module.exports = {
  databaseConnection: databaseConnection
};
