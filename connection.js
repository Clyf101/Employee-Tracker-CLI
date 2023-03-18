const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RootRoot',
  database: 'employee_db'
},
);

module.exports = connection;
