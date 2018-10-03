/*

EVENT_TYPE

TradeEntry

ClientOrderFillEntry
ClientOrderLegFillEntry
MarketOrderFillEntry
MarketOrderLegFillEntry
- map to trade entry Primary ID in Event Text

*/

module.exports = row => {
  const o = {}

  if (row["Event Type"] !== "TradeEntry") {
    return
  }

  o.fidessa_id = `${row["Internal ID"]}.${row["Internal sequence"]}`
  o.journal_type = "bunched"
  o.external_order_id = null
  o.bunched_order_id = null
  o.account_trade_id = null
  o.strategy_trade_id = null
  o.external_trade_id = row["Primary ID"]
  o.bunched_trade_id = null // primary artificial key
  o.trade_date = row.TRADE_DATETIME
  o.executing_account_id = null // (foreign key) default wells fargo
  o.buy_sell = row.BUY_SELL
  o.quantity = parseFloat(row.TRADING_QUANTITY) || null
  o.external_symbol = row.INSTRUMENT_FIM_CODE // or instrument_description
  o.price = parseFloat(row.GROSS_PRICE)
  o.commissions = null
  o.exchange_id = row.EXCHANGE_ID
  o.trader_id = null
  o.strategy_id = null
  o.client_id = null
  o.clearing_account_id = null // dropdown clearing account table
  o.settlement_date = null //
  o.assigned = false // if filled in client + strategy + clearing acct id - switch to True

  return o
}
