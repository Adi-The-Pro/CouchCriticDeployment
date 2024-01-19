import React, { useEffect, useState } from "react";
import styles from "./Rooms.module.css";
import RoomCard from "../../Componenets/RoomCard/RoomCard";
import AddRoomModal from "../../Componenets/AddRoomModal/AddRoomModal";
import { getAllRooms } from "../../http";

export default function Rooms() {
  const [showModal, setShowModal] = useState(false);
  const [rooms,setRooms] = useState([]);

  //To Fetch The Data Of All The Rooms Present In The Backend
  useEffect(() => {
    const fetchRooms = async() =>{
      const {data} = await getAllRooms();
      setRooms(data);
    };
    fetchRooms();
  },[]);

  //To Open The Add Room Modal 
  function openModal(){
    setShowModal(true);
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.roomsHeader}>
        {/* Search Rooms*/}
        <div className={styles.left}>
          <span className={styles.heading}>All Voice Rooms</span>
          <div className={styles.searchBox}>
            <img src="/images/searchIcon.png" alt="search"></img>
            <input className={styles.searchInput}></input>
          </div>
        </div>
          {/* Add Room Button */}
        <div className={styles.right}>
          <button onClick={openModal} className={styles.startRoomButton}>
            <img src="/images/addRoom.png" alt="add-room" />
            <span>Add a room</span>
          </button>
        </div>
      </div>

      {/* This will take data of a single room and then render it...and so on */}
      <div className={styles.roomList}>
        {
          rooms.map((room) => (
            <RoomCard key={room.id} room={room}></RoomCard>
          ))
        }
      </div>
      {/* This will be visibe once the Add A Room Button Is Clicked It Appears Traslucent Due to postion fixed property */}
      {showModal && <AddRoomModal onClose={() => setShowModal(false)}></AddRoomModal>}
    </div>
  );
}
