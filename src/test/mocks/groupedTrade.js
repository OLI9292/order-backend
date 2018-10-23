const groupedTradeId = require("uuid/v4")()
const moment = require("moment")

const mocks = [
  {
    id: groupedTradeId,
    buy_sell: "B",
    quantity: 3,
    external_symbol: "xyz",
    allocation_type: "average price",
    created_at: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
  }
]

module.exports = {
  mocks,
  groupedTradeId
}
