import React, { useState } from 'react'
import styles from './AddRoomModal.module.css'
import TextInput from '../TextInput/TextInput'
import {createRoom as create} from '../../http/index'
import{ useNavigate } from 'react-router-dom' //Replacement of useHistory hook

export default function AddRoomModal({onClose}) {
    const navigate = useNavigate();
    const [roomType,setRoomType] = useState('open');
    const [topic,setTopic] = useState('');
    
    async function createRoom(){
        //server call
        try{
            if(!topic) return;
            const {data} = await create({topic,roomType,});
            navigate(`/room/${data.id}`); //this is the id of the room data given by mongoose not the owner id
            console.log(data);
        }catch(err){
            console.log(err.message);
        }
    }

    return (
    <div className={styles.modalMask}>
        <div className={styles.modalBody}>
            <button onClick={onClose} className={styles.closeButton}>
                <img src="/images/close.png" alt="" />
            </button>
            
            <div className={styles.modalHeader}>
                <h3>Enter the topic to be disscussed</h3>
                <TextInput 
                    onChange={(e) => setTopic(e.target.value)} 
                    value={topic} 
                    fullWidth="true"
                />
                <h1>Room Types</h1>
                <div className={styles.roomsTypes}>
                    {/* This will apply dark background only on the cilcked roomType  */}
                    <div 
                        onClick={() => setRoomType('open')}
                        className={`${styles.typeBox}  ${
                            roomType==='open' ? styles.active : ''}`
                        }
                    >
                        <img src="/images/globe.png" alt="globe"/>
                        <span>Open</span>
                    </div>
                    <div 
                        onClick={() => setRoomType('social')}
                        className={`${styles.typeBox}  ${
                            roomType==='social' ? styles.active : ''}`
                        }
                    >
                        <img src="/images/user.png" alt="user"/>
                        <span>Social</span>
                    </div>
                    <div 
                        onClick={() => setRoomType('private')}
                        className={`${styles.typeBox}  ${
                            roomType==='private' ? styles.active : ''}`
                        }
                    >
                        <img src="/images/lock-2.png" alt="lock"/>
                        <span>Private</span>
                    </div>
                </div>
            </div>
            <div className={styles.modalFooter}>
                <h2>Start a room, open to everyone</h2>
                <button 
                    onClick={createRoom}
                    className={styles.footerButton}
                >
                    <img src="/images/celebration.png" alt="celebration"/>
                    <span>Let's Go</span>
                </button>
            </div>
        </div>
    </div>
  )
}
