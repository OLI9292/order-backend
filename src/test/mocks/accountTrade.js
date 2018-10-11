const uuid = require("uuid/v4")

const mocks = [
  {
    id: uuid(),
    client: "client 1",
    buy_sell: "B",
    quantity: 2,
    external_symbol: "xyz",
    price: 7
  },
  {
    id: uuid(),
    client: "client 2",
    buy_sell: "B",
    quantity: 3,
    external_symbol: "xyz",
    price: 5
  }
]

module.exports = {
  mocks
}
