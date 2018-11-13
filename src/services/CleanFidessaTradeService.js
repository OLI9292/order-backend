const moment = require("moment")
const { find } = require("lodash")

module.exports = rows =>
  rows.map(o => ({
    fidessa_id: `${o.Primary_ID}.${o.ORDER_ID}`,
    journal_type: "bunched",
    external_order_id: o.ORDER_ID,
    bunched_order_id: null,
    grouped_trade_id: null,
    account_trade_id: null,
    strategy_trade_id: null,
    external_trade_id: o.Primary_ID,
    bunched_trade_id: null,
    trade_date: o.TRADE_DATETIME,
    executing_account_id: null,
    buy_sell: o.BUY_SELL,
    quantity: parseFloat(o.QUANTITY) || null,
    external_symbol: o.INSTRUMENT_FIM_CODE,
    price: parseFloat(o.GROSS_PRICE),
    commissions: null,
    exchange_id: o.EXCHANGE_ID,
    trader_id: null,
    strategy_id: null,
    client_id: null,
    clearing_account_id: null,
    settlement_date: null,
    assigned: false
  }))
