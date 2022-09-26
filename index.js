const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminRoute = require("./module/admin/routes/index.js");
const customerRoute = require("./module/customer/routes/index");
const http = require("http");
const WebSockets = require("./module/common/socket/service");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const app = express();
const db = require("./module/model/index");
const { v4: uuidv4 } = require('uuid');
app.use(
  bodyParser.json({
    urlencoded: true,
  })
);
app.use(cors());

app.use("/admin", adminRoute);
app.use("/customer", customerRoute);

const server = http.createServer(app);
/** Create socket connection */
const io = require("socket.io")(server);
io.use((socket, next) => {});
io.of("/chat").on("connection", function (socket) {
  console.log("a user connected");
  console.log(socket.id);
  let token = socket.handshake.query.token;
  console.log(token);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return new Error("authentication error");
    }
    socket.decodedtoken = decoded;
    // console.log("ASE",socket.decodedtoken )
  });
  jwt.verify(socket.handshake.token, process.env.JWT_SECRET, (err, decoded) => {
    let decodedToken = socket.decodedtoken;
    if (!decodedToken) {
      io.close();
    } else {
      db.user
        .update(
          { isActive: "TRUE", socketID: socket.id },
          { where: { id: decodedToken.id } }
        )
        .then((user) => {
          console.log("user is online");
          socket.broadcast.emit("online User", decodedToken.id);
        });
    }
    socket.on("disconnect", function (data) {
      db.user
        .update(
          { isActive: "FALSE", socketID: null },
          { where: { id: decodedToken.id } }
        )
        .then((user) => {
          console.log("user is offline");
          socket.broadcast.emit("disconnected User", decodedToken.id);
        });
      console.log("user disconnected");
      socket.emit("disconnected");
    });

    socket.on("message", async function (msg) {
      //get online users
      const user = await db.user.findOne({
        where: { id: decodedToken.id },
        attributes: ["role"],
        raw: true,
      });
      if (user.role === "CUSTOMER") {
        const onlineAdmin = await db.user.findOne({
          where: {
            role: "ADMIN",
            isActive: "TRUE",
          },
          attributes: ["id"],
          raw: true,
        });
        if(typeof onlineAdmin.id === "number"){
           const message = {
            message_body:msg,
            sender_id:decodedToken.id,
            receiver_id:onlineAdmin.id,
            conversation_id:uuidv4() 
           }
           db.message.create(message)
           .then((message) => {
            socket.to(message.conversation_id).emit("new message", {
              message_body:msg,
              user:decodedToken.email,
              created_at:message.created_at
            })
            db.user.findOne({ where: { id: message.receiver_id } }).then((user) => {
              socket.to(user.socketId).emit("notify", {
                message_body: message.message_body,
                sender_id: decodedToken.id,
                created_at: message.created_at,
              });
            });
           })
        }
      }else{
        const userId = msg.id
        const message = {
          message_body:msg,
          sender_id:decodedToken.id,
          receiver_id:userId,
          conversation_id:uuidv4() 
         }
         db.message.create(message)
         .then((message) => {
          socket.to(message.conversation_id).emit("new message", {
            message_body:msg,
            user:decodedToken.email,
            created_at:message.created_at
          })
          db.user.findOne({ where: { id: message.receiver_id } }).then((user) => {
            socket.to(user.socketId).emit("notify", {
              message_body: message.message_body,
              sender_id: decodedToken.id,
              created_at: message.created_at,
            });
          });
         })
      }
    });

    socket.on("join room", function (roomname) {
      console.log("joined room " + roomname);
      socket.join(roomname);
    });
  });
});
/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});
