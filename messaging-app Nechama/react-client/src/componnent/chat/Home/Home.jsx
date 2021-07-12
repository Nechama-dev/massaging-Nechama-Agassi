import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import socketIOClient from "socket.io-client";
import useRooms from '../../groups/useRooms';
import "./Home.css";

const Home = () => {

  const { rooms, getRooms, addRoom, deleteRoom, joinRoom } = useRooms();

  useEffect(() => {
    getRooms();
    console.log(rooms)
  }, []);

  const joinSocketRoom = (room) => {
    debugger;
    joinRoom(room);
  }

  return (
    <div className="home-container">
      {
        rooms.map((d) =>
          <Link key={d} onClick={() => joinSocketRoom(d)} to={`/${d}`} className="enter-room-button">
            Join room {d}
          </Link>
        )
      }
    </div>
  );
};

export default Home;
