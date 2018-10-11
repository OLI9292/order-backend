const sql = require("sql")
sql.setDialect("postgres")

const { snakeToCamel } = require("../lib/helpers")

const name = "grouped_trade"

const groupedTrade = sql.define({
  name,
  columns: [
    {
      name: "id",
      dataType: "text",
      primaryKey: true
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
      name: "allocation_type",
      dataType: "text"
    }
  ]
})

const createGroupedTradeTable = groupedTrade.create().toQuery()

const columns = groupedTrade.columns.map(c => c.name)

const insertIntoGroupedTrade = o =>
  groupedTrade
    .insert(o)
    .returning()
    .toQuery()

const dropGroupedTradeTable = `DROP TABLE IF EXISTS ${name};`

module.exports = {
  groupedTrade,
  createGroupedTradeTable,
  insertIntoGroupedTrade,
  dropGroupedTradeTable
}
