const { graphql } = require("graphql")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const { schema, rootValue } = require("../schema")
const { seed } = require("../db")
const { gqlQuery, gqlMutation } = require("../lib/helpers")

const mocks = require("./mocks/groupedTrade").mocks

const tablename = "grouped_trade"
const typename = "GroupedTrade"

describe(`${tablename}`, () => {
  beforeEach(async () => await seed())

  it(`returns rows from ${tablename}`, async function() {
    const query = gqlQuery(`rows(tablename: "${tablename}", typename: "${typename}") {
      ... on ${typename} {
        id
      }
    }`)

    const result = await graphql(schema, query, rootValue)
    const { rows } = result.data

    chai.assert.equal(rows.length, mocks.length)
  })
})
