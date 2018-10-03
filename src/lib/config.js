require("dotenv").config()

module.exports = {
  DB_USER: process.env.DB_USERNAME || "postgres",
  DB_PASS: process.env.DB_PASSWORD || "",
  DB_HOST: process.env.DB_SERVER || "localhost",
  DB_PORT: process.env.DB_HOST || "5432",
  DB_NAME: process.env.DB_NAME || "order_db",
  DATABASE_URL: process.env.DATABASE_URL
}
