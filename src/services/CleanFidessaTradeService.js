const { find } = require("lodash")

const findExternalOrderId = (id, rows) => {
  if (id.substr(id.length - 2) == "11") {
    id = id.slice(0, -1)
  }
  const row = find(rows, r => r["Event Text"].includes(id))
  if (row) {
    return row["Primary ID"]
  }
}

module.exports = rows => {
  const trades = rows.filter(o => o["Event Type"] === "TradeEntry")

  return trades.map(o => ({
    fidessa_id: `${o["Internal ID"]}.${o["Internal sequence"]}`,
    journal_type: "bunched",
    external_order_id: findExternalOrderId(o["Primary ID"], rows) || null,
    bunched_order_id: null,
    grouped_trade_id: null,
    account_trade_id: null,
    strategy_trade_id: null,
    external_trade_id: o["Primary ID"],
    bunched_trade_id: null, // primary artificial key
    trade_date: o.TRADE_DATETIME,
    executing_account_id: null, // (foreign key) default wells fargo
    buy_sell: o.BUY_SELL,
    quantity: parseFloat(o.QUANTITY) || null,
    external_symbol: o.INSTRUMENT_FIM_CODE, // or instrument_description
    price: parseFloat(o.GROSS_PRICE),
    commissions: null,
    exchange_id: o.EXCHANGE_ID,
    trader_id: null,
    strategy_id: null,
    client_id: null,
    clearing_account_id: null, // dropdown clearing account table
    settlement_date: null, //
    assigned: false // if filled in client + strategy + clearing acct id - switch to True
  }))
}
