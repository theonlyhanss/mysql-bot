const mysql = require("mysql2/promise");
require("dotenv").config();

module.exports = async function executeSQLQuery(query) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [rows] = await connection.execute(query);
    return JSON.stringify(rows, null, 2);
  } finally {
    await connection.end();
  }
};
