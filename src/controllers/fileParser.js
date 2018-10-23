const Busboy = require("busboy")
const stream = require("stream")
const csv = require("fast-csv")

const cleanFidessaTrades = require("../services/CleanFidessaTradeService")

const { insertIntoFilledOrder } = require("../sql/filledOrder")
const { db } = require("../db")

exports.parse = async (req, res, next) => {
  const busboy = new Busboy({ headers: req.headers })
  let allRows = []

  busboy.on("file", async (fieldname, file, filename, encoding, mimetype) => {
    file
      .pipe(csv({ headers: true }))
      .on("data", row => allRows.push(row))
      .on("finish", async () => {
        const orders = cleanFidessaTrades(allRows).filter(c => c)
        try {
          const results = await db.conn.query(insertIntoFilledOrder(orders))
          return res.status(201).send(results)
        } catch (error) {
          console.log(error)
          return res.status(422).send({ error: error.message })
        }
      })
  })

  req.pipe(busboy)
}
