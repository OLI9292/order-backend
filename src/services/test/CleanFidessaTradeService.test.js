const { without } = require("lodash")
const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const cleanFidessaTrade = require("../CleanFidessaTradeService")

const mock = require("./mocks/fidessaTrade")

const { insertIntoFilledOrder, filledOrder } = require("../../sql/filledOrder")

const { db, seed } = require("../../db")

describe("clean fidessa trade service", () => {
  beforeEach(async () => await seed())

  it("cleans a fidessa trade", async function() {
    const clean = cleanFidessaTrade(mock)

    without(filledOrder.columns.map(c => c.name), "id").forEach(name =>
      chai.assert.include(Object.keys(clean), name)
    )

    console.log(clean)
    const result = await db.conn.one(insertIntoFilledOrder(clean))
  })
})
