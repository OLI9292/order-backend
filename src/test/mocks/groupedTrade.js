const uuid = require("uuid/v4")

const mocks = [
  {
    id: uuid(),
    buy_sell: "B",
    quantity: 2,
    external_symbol: "xyz",
    allocation_type: "average price"
  },
  {
    id: uuid(),
    buy_sell: "B",
    quantity: 3,
    external_symbol: "xyz",
    allocation_type: "average price"
  }
]

module.exports = {
  mocks
}
