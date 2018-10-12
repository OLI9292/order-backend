const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect
const { uniq } = require("lodash")

const { schema, rootValue } = require("../schema")
const { seed } = require("../db")
const { gqlQuery, gqlMutation } = require("../lib/helpers")

const mocks = require("./mocks/filledOrder").mocks

const allocationData = encodeURIComponent(
  JSON.stringify({
    quantity: 39,
    external_symbol: "xyz",
    buy_sell: "B",
    allocation_type: "sequential",
    allocations: [
      {
        client: "client 1",
        quantity: 3,
        price: 6.33
      },
      {
        client: "client 2",
        quantity: 4,
        price: 5
      }
    ]
  })
)

const tablename = "filled_order"
const typename = "FilledOrder"

describe("filled_order", () => {
  beforeEach(async () => await seed())

  it("returns rows from filled_order", async function() {
    const query = gqlQuery(`rows
      (tablename: "${tablename}", typename: "${typename}", startDate: "", endDate: "",) {
      ... on ${typename} {
        id
      }
    }`)

    const result = await graphql(schema, query, rootValue)
    const { rows } = result.data

    chai.assert.equal(rows.length, mocks.length)
  })

  it("updates a filled order", async function() {
    const mock = mocks[0]
    const id = 1
    const attr = "journal_type"
    const value = "strategy"

    const query = gqlMutation(
      `updateFilledOrder(id: "${id}", attr: "${attr}", value: "${value}") { id ${attr} }`
    )

    const result = await graphql(schema, query, rootValue)
    const { updateFilledOrder } = result.data

    chai.assert.equal(updateFilledOrder[attr], value)
    chai.assert.notEqual(mock[attr], updateFilledOrder[attr])
    chai.assert.notEqual(id, updateFilledOrder.external_trade_id)
  })

  it("updates multiple filled orders", async function() {
    const ids = mocks.map(m => m.external_trade_id)
    const attr = "journal_type"
    const value = "account"

    const query = gqlMutation(
      `updateFilledOrders(ids: "${ids}", attr: "${attr}", value: "${value}") { id ${attr} }`
    )

    const result = await graphql(schema, query, rootValue)
    const { updateFilledOrders } = result.data

    chai.assert.isArray(updateFilledOrders)
    chai.assert.equal(ids.length, updateFilledOrders.length)
    updateFilledOrders.forEach(o => chai.assert.equal(value, o[attr]))
  })

  it("allocates filled orders", async function() {
    const ids = ["1", "2"]

    const query = gqlMutation(
      `allocateFilledOrders(ids: "${ids.join(
        ","
      )}", data: "${allocationData}") {
        groupedTrade {
          id
        } 
        accountTrades {
          id
          grouped_trade_id
        }
        filledOrders {
          id
          grouped_trade_id
        }
      }`
    )

    const result = await graphql(schema, query, rootValue)
    const {
      groupedTrade,
      accountTrades,
      filledOrders
    } = result.data.allocateFilledOrders

    chai.assert.equal(
      uniq(
        accountTrades
          .concat(filledOrders)
          .map(a => a.grouped_trade_id)
          .concat(groupedTrade.id)
      ).length,
      1
    )

    chai.assert.deepEqual(ids.sort(), filledOrders.map(f => f.id).sort())
  })
})
