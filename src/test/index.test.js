const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const gql = require("graphql-tag")

const schema = require("../schema")
const { seed } = require("../db")

const mocks = require("./mocks/filledOrder").mocks

describe("filled_order", () => {
  beforeEach(async () => await seed())

  it("returns rows from filled_order", async function() {
    const query = `
      query {
        filledOrder {
          id
        }
      }
    `
    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { filledOrder } = result.data

    chai.assert.equal(filledOrder.length, mocks.length)
  })

  it("returns the count of rows from filled_order", async function() {
    const query = `
      query {
        filledOrderCount
      }
    `
    const rootValue = {}
    const context = {}

    const result = await graphql(schema, query, rootValue, context)
    const { filledOrderCount } = result.data

    chai.assert.equal(parseInt(filledOrderCount, 10), mocks.length)
  })
})
