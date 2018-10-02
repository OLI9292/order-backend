const express = require("express")
const expressGraphQL = require("express-graphql")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")

const schema = require("./schema")

const FileParser = require("./controllers/fileParser")

app.use("*", cors())

app.use("/upload-file", function(req, res, next) {
  return FileParser.parse(req, res, next)
})

app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true
  })
)
app.listen(4000, () => {
  console.log("Listening...")
})
