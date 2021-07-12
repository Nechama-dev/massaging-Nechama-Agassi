import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const GET_ALL_ROOMS = "getAllRooms";
const DELETE_ROOM = "deleteRoom";
const ADD_ROOM = "addRoom";
const JOIN_ROOM = "joinRoom";
const SOCKET_SERVER_URL = "http://localhost:4000";

const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    socketRef.current.on(GET_ALL_ROOMS, (rooms) => {
        console.log("rooms", rooms)
        setRooms(rooms)
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const getRooms = () => {
    socketRef.current.emit(GET_ALL_ROOMS)
  }

  const addRoom = (room) => {
    socketRef.current.emit(ADD_ROOM, room)
  }

  const deleteRoom = (room) => {
    socketRef.current.emit(DELETE_ROOM, room)
  }

  const joinRoom = (room) => {
    socketRef.current.emit(JOIN_ROOM, {room})
  }

  return { rooms, getRooms, addRoom, deleteRoom, joinRoom };
};

export default useRooms;
