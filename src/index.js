const express = require("express")
const expressGraphQL = require("express-graphql")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")

const { schema, rootValue } = require("./schema")

const FileParser = require("./controllers/fileParser")

app.use("*", cors())

app.use("/file-upload", function(req, res, next) {
  return FileParser.parse(req, res, next)
})

app.use(
  "/graphql",
  expressGraphQL({
    schema,
    rootValue,
    graphiql: true
  })
)
app.listen(4000, () => {
  console.log("Listening...")
})
