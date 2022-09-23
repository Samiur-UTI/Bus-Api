const express  = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminRoute = require('./module/admin/routes/index.js')
const http = require('http');
const WebSockets = require("./module/common/socket/service")
require("dotenv").config();
const port  = process.env.PORT || 5000
const app = express();


app.use(bodyParser.json({
    urlencoded: true,
}))
app.use(cors())

app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist'
  })
});

const server = http.createServer(app);
/** Create socket connection */
global.io = require("socket.io")(server)
global.io.on('connection', WebSockets.connection)
/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});
