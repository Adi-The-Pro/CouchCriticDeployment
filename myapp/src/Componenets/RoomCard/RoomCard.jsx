import React from "react";
import styles from "./RoomCard.module.css";
import { useNavigate } from "react-router-dom";

export default function RoomCard({room }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/room/${room.id}`)} className={styles.card}>
      {/* This will render the Topic of the room */}
      <h3 className={styles.topic}>{room.topic}</h3>

      {/* This will render the avatars of all the speakers along with their names  */}
      <div className={`${styles.speakers} ${room.speakers.length===1 ? styles.singleSpeaker : ''}`}>
        {/* Rendering Images */}
        <div className={styles.avatars}>
          {
            room.speakers.map((speaker) => (
              <img key={speaker.id} src={speaker.avatar} alt="speaker-avatar" />
            ))
          }
        </div>
        {/* Rendering Names */}
        <div className={styles.names}>
          {
            room.speakers.map((speaker) => (
              <div key={speaker.id} className={styles.nameWrapper}>
                <span>{speaker.name}</span>
                <img src="/images/chatBubble.png" alt="chat-bubble" />
              </div>
            ))
          }
        </div>
      </div>

      {/* This will render the people count of the room*/}
      <div className={styles.peopleCount}>
        <span>{room.totalPeople}</span>
        <img src="/images/userProfile.png" alt="userProfile" />
      </div>
    </div>
  );
}
