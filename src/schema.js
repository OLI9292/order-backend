const graphql = require("graphql")

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema
} = graphql

const { db } = require("./db")

const filledOrderType = new GraphQLObjectType({
  name: "FilledOrder",
  fields: () => ({
    id: { type: GraphQLID },
    journal_type: { type: GraphQLString },
    external_order_id: { type: GraphQLString },
    bunched_order_id: { type: GraphQLString },
    account_trade_id: { type: GraphQLString },
    strategy_trade_id: { type: GraphQLString },
    external_trade_id: { type: GraphQLString },
    bunched_trade_id: { type: GraphQLString },
    trade_date: { type: GraphQLString },
    executing_account_id: { type: GraphQLString },
    buy_sell: { type: GraphQLString },
    quantity: { type: GraphQLString },
    external_symbol: { type: GraphQLString },
    price: { type: GraphQLString },
    commissions: { type: GraphQLString },
    exchange_id: { type: GraphQLString },
    trader_id: { type: GraphQLString },
    strategy_id: { type: GraphQLString },
    client_id: { type: GraphQLString },
    clearing_account_id: { type: GraphQLString },
    settlement_date: { type: GraphQLString },
    assigned: { type: GraphQLBoolean }
  })
})

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    filledOrder: {
      type: new GraphQLList(filledOrderType),
      resolve(parentValue, args) {
        const query = `SELECT * FROM filled_order`
        return db.conn
          .any(query)
          .then(data => data)
          .catch(err => `The error is: ${err}`)
      }
    },
    filledOrderCount: {
      type: GraphQLString,
      resolve(parentValue, args) {
        const query = `SELECT COUNT(*) FROM filled_order`
        return db.conn
          .one(query)
          .then(data => data.count)
          .catch(err => `The error is: ${err}`)
      }
    },
    login: {
      type: GraphQLBoolean,
      args: {
        username: {
          type: GraphQLString
        },
        password: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return `${args.username}-${args.password}` === "1-2"
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
