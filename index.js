const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminRoute = require("./module/admin/routes/index.js");
const customerRoute = require("./module/customer/routes/index")
const http = require("http");
const WebSockets = require("./module/common/socket/service");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const app = express();
const db = require("./module/model/index");

app.use(
  bodyParser.json({
    urlencoded: true,
  })
);
app.use(cors());

app.use("/admin",adminRoute)
app.use("/customer",customerRoute)

const server = http.createServer(app);
/** Create socket connection */
const io = require("socket.io")(server);
io.use((socket, next) => {
  let token = socket.handshake.query.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return next(new Error("authentication error"));
    }

    socket.decodedtoken = decoded;
    return next();
  });
});
io.of("/chat").on("connection", function (socket) {
  console.log("a user connected");
  console.log(socket.id);
  
  jwt.verify(
    socket.handshake.query.token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      let decodedToken = decoded;
      if (!decodedToken) {
        io.close();
      } else {
        db.users
          .update(
            { isActive: 1, socketID: socket.id },
            { where: { id: decodedToken.user_id } }
          )
          .then((user) => {
            console.log("user is online");
            socket.broadcast.emit("online User", decodedToken.user_id);
          });
      }
      socket.on("disconnect", function (data) {
        db.users
          .update(
            { isActive: 0, socketID: null },
            { where: { id: decodedToken.user_id } }
          )
          .then((user) => {
            console.log("user is offline");
            socket.broadcast.emit("disconnected User", decodedToken.user_id);
          });
        console.log("user disconnected");
        socket.emit("disconnected");
      });

      socket.on("message", function (msg) {
        console.log("new message");
        db.users
          .findOne({ where: { id: decodedToken.user_id } })
          .then((user) => {
            socket.to(msg.conversation_id).emit("new message", {
              message_body: msg.message_body,
              user: {
                first_name: user.first_name,
              },
              created_at: msg.created_at,
            });
            socket.emit(msg.conversation_id, message);
          });

        db.users.findOne({ where: { id: msg.receiver_id } }).then((user) => {
          socket.to(user.socketID).emit("notify", {
            message_body: msg.message_body,
            sender_id: decodedToken.user_id,
            created_at: msg.created_at,
          });
        });
      });

      socket.on("join room", function (roomname) {
        console.log("joined room " + roomname);
        socket.join(roomname);
      });
    }
  );
});
/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});
