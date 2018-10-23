const sql = require("sql")
sql.setDialect("postgres")
const moment = require("moment")
const { extend } = require("lodash")

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
    },
    {
      name: "created_at",
      dataType: "timestamp"
    }
  ]
})

const createGroupedTradeTable = groupedTrade
  .create()
  .ifNotExists()
  .toQuery()

const columns = groupedTrade.columns.map(c => c.name)

const insertIntoGroupedTrade = o =>
  groupedTrade
    .insert(
      extend(o, {
        created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
      })
    )
    .returning()
    .toQuery()

const dropGroupedTradeTable = `DROP TABLE IF EXISTS ${name};`

module.exports = {
  groupedTrade,
  createGroupedTradeTable,
  insertIntoGroupedTrade,
  dropGroupedTradeTable
}
