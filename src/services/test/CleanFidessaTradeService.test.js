const chai = require("chai")
const should = chai.should()
const expect = chai.expect

const cleanFidessaTrade = require("../CleanFidessaTradeService")

const mock = require("./mocks/fidessaTrade")

const { insertIntoFilledOrder, filledOrder } = require("../../sql/filledOrder")

const { db, clean } = require("../../db")

describe("clean fidessa trade service", () => {
  beforeEach(async () => await clean())

  it("cleans a fidessa trade", async function() {
    const clean = cleanFidessaTrade(mock)

    filledOrder.columns.forEach(col =>
      chai.assert.include(Object.keys(clean), col.name)
    )
  })
})
