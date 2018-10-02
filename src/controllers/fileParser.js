const Busboy = require("busboy")
const stream = require("stream")
const csv = require("fast-csv")

const cleanFidessaTrade = require("../services/CleanFidessaTradeService")

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
        const orders = allRows.map(cleanFidessaTrade).filter(c => c)
        console.log(orders)
        try {
          await db.conn.query(insertIntoFilledOrder(orders))
          return res.status(201).send("success")
        } catch (error) {
          return res.status(404).send({ error: error.message })
        }
      })
  })

  req.pipe(busboy)
}
