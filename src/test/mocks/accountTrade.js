const uuid = require("uuid/v4")
const { groupedTradeId } = require("./groupedTrade")
const moment = require("moment")

const mocks = [
  {
    id: uuid(),
    client: "client 1",
    buy_sell: "B",
    grouped_trade_id: groupedTradeId,
    created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    quantity: 1,
    external_symbol: "xyz",
    price: 7
  },
  {
    id: uuid(),
    client: "client 2",
    buy_sell: "B",
    grouped_trade_id: groupedTradeId,
    created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    quantity: 2,
    external_symbol: "xyz",
    price: 5
  }
]

module.exports = {
  mocks
}
