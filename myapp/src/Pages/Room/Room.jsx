import React, { useState,useEffect} from 'react'
import { useWebRTC } from '../../hooks/useWebRTC'
import { useParams,useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Room.module.css';
import { getRoom } from '../../http';

export default function Room() {
  const {id:roomId} = useParams();
  const user = useSelector((state) => state.auth.user)
  const {clients,provideRef,handleMute} = useWebRTC(roomId,user); 
  const [room,setRoom] = useState(null);
  const [isMute,setMute] = useState(true);

  //Handling user when they want to leave
  const navigate = useNavigate();
  const handleManualLeave = () => {
    navigate('/rooms');
  }
  
  //Fetching the data of the particular room
  useEffect(()=>{
    const fetchRoom = async () =>{
      const {data} = await getRoom(roomId);
      setRoom(data);
    }
    fetchRoom();
  },[roomId]);

  //Handling mute functionality
  useEffect(() =>{
    handleMute(isMute,user.id);
  },[isMute]);
  const handleMuteClick = (clientId) => {
    if(clientId!=user.id) return;
    //This will change isMute which will automatically trigger the above useEffect
    setMute((isMute) => !isMute);
  }

  return (
    <>
    <div className={styles.container}>
      <button onClick={handleManualLeave}className={styles.goBack}>
        <img src="/images/backArrow.png" alt="arrow" />
        <span>All Voice Rooms</span>
      </button>
    </div>
    <div className={styles.clientWrap}>
      <div className={styles.header}>
        <h1 className={styles.topic}>{room?.topic}</h1>
        <div className={styles.actions}>
          <button className={styles.actionBtn}>
            <img src="/images/handWave2.png" alt="handWave" />
          </button>
          <button onClick={handleManualLeave} className={styles.actionBtn}>
            <img src="/images/handWave3.png" alt="handWave2"/>
            <span>Leave Quietly</span>
          </button>
        </div>
      </div>
      <div className={styles.clientsList}>
        {
          clients.map((client)=>(
            <div className={styles.client} key={client.id}>
              <div className={styles.userHead}>
                <img className={styles.userAvatar} src={client.avatar} alt="avatar" />
                <audio 
                  ref={(instance)=>{
                    provideRef(instance,client.id);
                  }}
                  // controls //To show the toggles for audio
                autoPlay>
                </audio>
                {/* Mic Button */}
                <button onClick={() => {handleMuteClick(client.id)}} className={styles.micBtn}>
                  {client.muted ? 
                    <img src="/images/mic-off2.png" alt="mic-off" /> :
                    <img src="/images/mic-on.png" alt="mic-on"/>
                  }
                </button>
                <h4>{client.name}</h4>
              </div>
            </div>
          ))
        }
      </div>
    </div> 
    </>
  )
}
