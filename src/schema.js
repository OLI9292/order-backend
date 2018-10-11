const { graphql, buildSchema } = require("graphql")
const { extend, omit } = require("lodash")
const uuidv4 = require("uuid/v4")

const { filledOrder } = require("./sql/filledOrder")
const { groupedTrade, insertIntoGroupedTrade } = require("./sql/groupedTrade")
const { accountTrade, insertIntoAccountTrade } = require("./sql/accountTrade")
const { db } = require("./db")

const schema = buildSchema(`
  type FilledOrder {
    id: ID!
    fidessa_id: String
    journal_type: String
    external_order_id: String
    bunched_order_id: String
    account_trade_id: String
    grouped_trade_id: String
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

  type AccountTrade {
    id: ID!
    client: String!
    grouped_trade_id: String!
    buy_sell: String!
    quantity: String!
    external_symbol: String!
    price: String!
  }

  type GroupedTrade {
    id: ID!
    buy_sell: String!
    quantity: String!
    external_symbol: String!
    allocation_type: String!
  }

  type AllocateResult {
    groupedTrade: GroupedTrade!
    accountTrades: [AccountTrade]!
    filledOrders: [FilledOrder]!
  }

  union Row = FilledOrder | AccountTrade | GroupedTrade

  type Query {
    random: Float!
    rows(tablename: String!, typename: String!): [Row]
    login(username: String, password: String): Boolean
  }

  type Mutation {
    updateFilledOrder(id: String, attr: String, value: String): FilledOrder
    updateFilledOrders(ids: String, attr: String, value: String): [FilledOrder]
    allocateFilledOrder(id: String!, client: String!): AccountTrade
    allocateFilledOrders(ids: String!, data: String!): AllocateResult
  }
`)

const rootValue = {
  rows: async params =>
    db.conn
      .any(`SELECT * FROM ${params.tablename}`)
      .then(data => data.map(d => extend(d, { __typename: params.typename })))
      .catch(err => `The error is: ${err}`),

  login: params =>
    `${params.username}-${params.password}` === "temp-username-temp-password",

  updateFilledOrder: params => {
    const update = {}
    update[params.attr] = params.value
    return db.conn.one(
      filledOrder
        .update(update)
        .where(filledOrder.id.equals(params.id))
        .returning()
        .toQuery()
    )
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
  },

  allocateFilledOrders: async params => {
    const ids = params.ids.split(",")
    const data = JSON.parse(decodeURIComponent(params.data))
    const { buy_sell, external_symbol } = data

    const id = uuidv4()
    const grouped_trade_id = id

    const groupedTrade = await db.conn.one(
      insertIntoGroupedTrade(extend(omit(data, "allocations"), { id }))
    )

    const filledOrders = await db.conn.any(
      filledOrder
        .update({ assigned: true, grouped_trade_id })
        .where(filledOrder.id.in(ids))
        .returning()
        .toQuery()
    )

    const accountTrades = await db.conn.any(
      insertIntoAccountTrade(
        data.allocations.map(a =>
          extend({}, a, {
            id: uuidv4(),
            grouped_trade_id,
            buy_sell,
            external_symbol
          })
        )
      )
    )

    return {
      groupedTrade,
      accountTrades,
      filledOrders
    }
  }
}
/* 
Allocations[]
      client
      quantity
      price

      ids of filled orders

    create grouped_trade
      external_symbol
      buy_sell
      quantity
      allocation_type ( single client, average price, sequence )

    for each client
      create account trade
      above - allocation type + client_id, grouped_trade_id
*/
module.exports = { schema, rootValue }
