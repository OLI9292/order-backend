const sql = require("sql")
sql.setDialect("postgres")

const { snakeToCamel } = require("../lib/helpers")

const name = "account_trade"

const accountTrade = sql.define({
  name,
  columns: [
    {
      name: "id",
      dataType: "text",
      notNull: false,
      primaryKey: true
    },
    {
      name: "client",
      dataType: "text"
    },
    {
      name: "grouped_trade_id",
      dataType: "text",
      references: {
        table: "grouped_trade",
        column: "id",
        onInsert: "no action"
      }
    },
    {
      name: "external_symbol",
      dataType: "text"
    },
    {
      name: "buy_sell",
      dataType: "text"
    },
    {
      name: "quantity",
      dataType: "float"
    },
    {
      name: "price",
      dataType: "float"
    },
    {
      name: "created_at",
      dataType: "timestamp"
    }
  ]
})

const createAccountTradeTable = accountTrade
  .create()
  .ifNotExists()
  .toQuery()

const columns = accountTrade.columns.map(c => c.name)

const insertIntoAccountTrade = o =>
  accountTrade
    .insert(o)
    .returning()
    .toQuery()

const dropAccountTradeTable = `DROP TABLE IF EXISTS ${name};`

module.exports = {
  accountTrade,
  createAccountTradeTable,
  insertIntoAccountTrade,
  dropAccountTradeTable
}
