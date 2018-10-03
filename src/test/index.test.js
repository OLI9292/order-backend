const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const { schema, rootValue } = require("../schema")
const { seed } = require("../db")
const { gqlQuery, gqlMutation } = require("../lib/helpers")

const mocks = require("./mocks/filledOrder").mocks

describe("filled_order", () => {
  beforeEach(async () => await seed())

  it("returns rows from filled_order", async function() {
    const query = gqlQuery("filledOrder { id }")

    const result = await graphql(schema, query, rootValue)
    const { filledOrder } = result.data

    chai.assert.equal(filledOrder.length, mocks.length)
  })

  it("returns the count of rows from filled_order", async function() {
    const query = gqlQuery("filledOrderCount")

    const result = await graphql(schema, query, rootValue)
    const { filledOrderCount } = result.data

    chai.assert.equal(parseInt(filledOrderCount, 10), mocks.length)
  })

  it("updates a filled order", async function() {
    const mock = mocks[0]
    const id = mock.external_trade_id
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
})
