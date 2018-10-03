const { graphql, buildSchema } = require("graphql")

const { filledOrder } = require("./sql/filledOrder")
const { db } = require("./db")

const schema = buildSchema(`
  type FilledOrder {
    id: ID
    fidessa_id: String
    journal_type: String
    external_order_id: String
    bunched_order_id: String
    account_trade_id: String
    strategy_trade_id: String
    external_trade_id: String
    bunched_trade_id: String
    trade_date: String
    executing_account_id: String
    buy_sell: String
    quantity: String
    external_symbol: String
    price: String
    commissions: String
    exchange_id: String
    trader_id: String
    strategy_id: String
    client_id: String
    clearing_account_id: String
    settlement_date: String
    assigned: Boolean
  }

  type Query {
    random: Float!
    filledOrder: [FilledOrder]
    filledOrderCount: Int
    login(username: String, password: String): Boolean
  }

  type Mutation {
    updateFilledOrder(id: String, attr: String, value: String): FilledOrder
    updateFilledOrders(ids: String, attr: String, value: String): [FilledOrder]
  }
`)

const rootValue = {
  filledOrder: () =>
    db.conn
      .any(`SELECT * FROM filled_order`)
      .then(data => data)
      .catch(err => `The error is: ${err}`),
  filledOrderCount: () =>
    db.conn
      .one(`SELECT COUNT(*) FROM filled_order`)
      .then(data => data.count)
      .catch(err => `The error is: ${err}`),
  login: params =>
    `${params.username}-${params.password}` === "temp-username-temp-password",
  updateFilledOrder: params => {
    const update = {}
    update[params.attr] = params.value
    const query = filledOrder
      .update(update)
      .where(filledOrder.external_trade_id.equals(params.id))
      .returning()
      .toQuery()
    return db.conn
      .one(query)
      .then(data => data)
      .catch(err => `The error is: ${err}`)
  },
  updateFilledOrders: params => {
    const update = {}
    update[params.attr] = params.value
    const query = filledOrder
      .update(update)
      .where(filledOrder.external_trade_id.in(params.ids.split(",")))
      .returning()
      .toQuery()

    return db.conn
      .any(query)
      .then(data => data)
      .catch(err => `The error is: ${err}`)
  }
}

module.exports = { schema, rootValue }
