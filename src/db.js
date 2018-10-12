const pgp = require("pg-promise")()

const CONFIG = require("./lib/config")

const filledOrderMocks = require("./test/mocks/filledOrder").mocks
const accountTradeMocks = require("./test/mocks/accountTrade").mocks
const groupedTradeMocks = require("./test/mocks/groupedTrade").mocks

const {
  createFilledOrderTable,
  insertIntoFilledOrder,
  dropFilledOrderTable
} = require("./sql/filledOrder")

const {
  createAccountTradeTable,
  insertIntoAccountTrade,
  dropAccountTradeTable
} = require("./sql/accountTrade")

const {
  createGroupedTradeTable,
  insertIntoGroupedTrade,
  dropGroupedTradeTable
} = require("./sql/groupedTrade")

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
  // console.log("Seeding db.")
  await db.conn.query(insertIntoFilledOrder(filledOrderMocks))
  await db.conn.query(insertIntoAccountTrade(accountTradeMocks))
  await db.conn.query(insertIntoGroupedTrade(groupedTradeMocks))
  return
}

const clean = async () => {
  // console.log("Tearing down db.")
  await teardown()
  // console.log("Creating tables.")
  await db.conn.query(createGroupedTradeTable)
  await db.conn.query(createAccountTradeTable)
  await db.conn.query(createFilledOrderTable)
  return
}

const teardown = async () => {
  await db.conn.query(dropFilledOrderTable)
  await db.conn.query(dropAccountTradeTable)
  await db.conn.query(dropGroupedTradeTable)
  return
}

module.exports = {
  seed,
  clean,
  teardown,
  db
}
