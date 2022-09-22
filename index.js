const express  = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminRoute = require('./module/admin/routes/index.js')

require(dotenv).config();

const app = express();


app.use(bodyParser.json({
    urlencoded: true,
}))
app.use(cors())

app.listen(
  process.env.PORT,
  console.log(`BUS ENGINE STARTED AT ${process.env.PORT}`)
);
