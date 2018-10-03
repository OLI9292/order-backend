const sql = require("sql")
sql.setDialect("postgres")

const { snakeToCamel } = require("../lib/helpers")

const name = "filled_order"

const filledOrder = sql.define({
  name,
  columns: [
    {
      name: "id",
      dataType: "serial",
      notNull: true,
      primaryKey: true
    },
    {
      name: "fidessa_id",
      dataType: "text",
      notNull: true,
      unique: true
    },
    {
      name: "journal_type",
      dataType: "text",
      notNull: true
    },
    {
      name: "external_order_id",
      dataType: "text"
    },
    {
      name: "bunched_order_id",
      dataType: "text"
    },
    {
      name: "account_trade_id",
      dataType: "text"
    },
    {
      name: "strategy_trade_id",
      dataType: "text"
    },
    {
      name: "external_trade_id",
      dataType: "text"
    },
    {
      name: "bunched_trade_id",
      dataType: "text"
    },
    {
      name: "trade_date",
      dataType: "timestamp"
    },
    {
      name: "executing_account_id",
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
      name: "external_symbol",
      dataType: "text"
    },
    {
      name: "price",
      dataType: "float"
    },
    {
      name: "commissions",
      dataType: "float"
    },
    {
      name: "exchange_id",
      dataType: "text"
    },
    {
      name: "trader_id",
      dataType: "text"
    },
    {
      name: "strategy_id",
      dataType: "text"
    },
    {
      name: "client_id",
      dataType: "text"
    },
    {
      name: "clearing_account_id",
      dataType: "text"
    },
    {
      name: "settlement_date",
      dataType: "timestamp"
    },
    {
      name: "assigned",
      dataType: "boolean"
    }
  ]
})

const createFilledOrderTable = filledOrder.create().toQuery()

const columns = filledOrder.columns.map(c => c.name)

const insertIntoFilledOrder = o =>
  filledOrder
    .insert(o)
    .returning()
    .toQuery()

const dropFilledOrderTable = `DROP TABLE IF EXISTS ${name};`

module.exports = {
  filledOrder,
  createFilledOrderTable,
  insertIntoFilledOrder,
  dropFilledOrderTable
}
