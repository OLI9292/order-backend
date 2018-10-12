const { without } = require("lodash")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const cleanFidessaTrades = require("../CleanFidessaTradeService")

const mocks = require("./mocks/fidessaTrade")

const { insertIntoFilledOrder, filledOrder } = require("../../sql/filledOrder")

const { db, seed } = require("../../db")

describe("clean fidessa trade service", () => {
  beforeEach(async () => await seed())

  it("cleans a fidessa trade", async function() {
    const clean = cleanFidessaTrades(mocks)[0]

    without(filledOrder.columns.map(c => c.name), "id").forEach(name =>
      chai.assert.include(Object.keys(clean), name)
    )

    const result = await db.conn.one(insertIntoFilledOrder(clean))
  })
})
