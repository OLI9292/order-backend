const pgp = require("pg-promise")()

const CONFIG = require("./lib/config")

const filledOrderMocks = require("./test/mocks/filledOrder").mocks

const {
  createFilledOrderTable,
  insertIntoFilledOrder,
  dropFilledOrderTable
} = require("./sql/filledOrder")

const db = {}
db.conn = pgp(
  CONFIG.DATABASE_URL || {
    host: CONFIG.DB_HOST,
    port: CONFIG.DB_PORT,
    database: CONFIG.DB_NAME,
    user: CONFIG.DB_USER
  }
)

const seed = async () => {
  await clean()
  for (let mock of filledOrderMocks) {
    await db.conn.query(insertIntoFilledOrder(mock))
  }
  return
}

const clean = async () => {
  await teardown()
  console.log("Tearing down db.")
  console.log("Creating filled_order table.")
  await db.conn.query(createFilledOrderTable)
  return
}

const teardown = async () => {
  await db.conn.query(dropFilledOrderTable)
  return
}

module.exports = {
  seed,
  clean,
  teardown,
  db
}
