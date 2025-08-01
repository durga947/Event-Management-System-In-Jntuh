// db.js
import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password", // replace with your actual password
  database: "event_db",
});
