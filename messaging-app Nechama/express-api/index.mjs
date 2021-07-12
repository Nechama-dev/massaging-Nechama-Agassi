import express, { json } from 'express'
import morgan from 'morgan'
import log from '@ajar/marker'
import cors from 'cors'

import user_router from './modules/user/user.router.mjs';
import login_router from './modules/login/login.router.mjs';
import { error_handler, not_found } from './middleware/errors.handler.mjs'
import { connect_db } from './db/mongoose.connection.mjs';
//import { Server } from "socket.io";
//import * as http from 'http'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { PORT, HOST, DB_URI, SOCKET_PORT } = process.env;

const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const GET_ALL_ROOMS = "getAllRooms";
const DELETE_ROOM = "deleteRoom";
const ADD_ROOM = "addRoom";
const JOIN_ROOM = "joinRoom";

const getActiveRooms = (io) => {
  const arr = Array.from(io.sockets.adapter.rooms);
  const filtered = arr.filter(room => !room[1].has(room[0]))
  const res = filtered.map(i => i[0]);
  return res;
}

io.on("connection", (socket) => {

  console.log(`Client ${socket.id} connected`);
  
  //Get all rooms
  socket.on(GET_ALL_ROOMS, () => {
    const rooms = getActiveRooms(io);
    console.log("hi", rooms)
    socket.emit(GET_ALL_ROOMS, [...rooms])
  });

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    socket.join(data.room);
    const rooms = getActiveRooms(io);
    console.log("rooms", rooms);
    console.log("data to send", data)
    io.in(data.room).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  //Add room for admin
  socket.on(ADD_ROOM, (roomId) => {
    socket.join(roomId);
    const allRooms = getActiveRooms(io);
    socket.emit(GET_ALL_ROOMS, [...allRooms])
  });

  //Join room for user
  socket.on(JOIN_ROOM, (data) => {
    console.log("joine roomid", data.room)
    socket.join(data.room);
  });

  //Delete room
  socket.on(DELETE_ROOM, (roomId) => {
    socket.leave(roomId);
    const allRooms = getActiveRooms(io);
    socket.emit(GET_ALL_ROOMS, [...allRooms])
  })

  //Leave the room if the user closes the socket
  socket.on("disconnect", (room) => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(room);
  });
});

server.listen(SOCKET_PORT, () => {
  console.log(`Listening on port ${SOCKET_PORT}`);
});

const app = express();
// apply middleware
app.use(cors());
app.use(morgan('dev'))

// routing
app.use('/api/users', user_router);
app.use('/api/login', login_router);

// central error handling
app.use(error_handler);

//when no routes were matched...
app.use('*', not_found);

//start the express api server
(async () => {
  //connect to mongo db
  await connect_db(DB_URI);
  await app.listen(PORT, HOST);
  log.magenta(`api is live on`, ` ✨ ⚡  http://${HOST}:${PORT} ✨ ⚡`);
})().catch(log.error)