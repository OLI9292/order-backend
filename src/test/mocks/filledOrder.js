const mocks = [
  {
    fidessa_id: "00000017794ARLO1.1",
    external_trade_id: "00000005480TRLO11",
    journal_type: "bunched",
    buy_sell: "B",
    quantity: 2,
    external_symbol: "xyz",
    assigned: false,
    price: 7
  },
  {
    fidessa_id: "00000017794ARLO1.2",
    external_trade_id: "00000005480TRLO11",
    journal_type: "bunched",
    buy_sell: "B",
    quantity: 5,
    external_symbol: "xyz",
    assigned: false,
    price: 5
  },
  {
    fidessa_id: "00000017794ARLO1.3",
    external_trade_id: "00000005485TRLO12",
    journal_type: "bunched",
    buy_sell: "S",
    quantity: 3,
    external_symbol: "xyz",
    assigned: false,
    price: 5
  },
  {
    fidessa_id: "00000017794ARLO1.4",
    external_trade_id: "00000005485TRLO12",
    journal_type: "bunched",
    buy_sell: "S",
    quantity: 3,
    external_symbol: "mnp",
    assigned: false,
    price: 1
  }
]

module.exports = {
  mocks
}
