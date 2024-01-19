import { useRef, useEffect, useCallback } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../Socket";
import { ACTIONS } from "../actions";
import freeice from "freeice";

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({}); //to store ref to audio elements associated with each user in WEBRTC
  const connections = useRef({});
  const localMediaStream = useRef(null); //This ref is used to store the local media stream obtained from the user's device.
  const socket = useRef(null);
  const clientsRef = useRef([]); //same as clients of useState...this will be used for mute/unmute 

  //useCallback returns a memoized callback function so that doesn't need to be calculated again
  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => client.id === newClient.id);
      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [clients, setClients]
  );

  //SOCKET.IO client server initialization
  useEffect(() => {
    socket.current = socketInit();
  }, []);

  // Capture Media
  useEffect(() => {
    /*This provides access to user's media devices such as camera and microphone and
      stores the resulting audio stream is stored in the localMediaStream useRef*/
    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        //This specifies that the application is interested in obtaining audio stream
        audio: true,
      });
    };

    /*Captures the user's audio, adds the user to a list along with the muted property and associates the user's
    audio stream with a corresponding audio element while muting it*/
    startCapture().then(() => {
      // add user to clients list
      addNewClient({ ...user, muted: true }, () => {
        //Reterive the audio element associated with the user...i.e ref of <audio/> of the user
        const localElement = audioElements.current[user.id];
        if (localElement) {
          //To initially mute the audio element
          localElement.volume = 0;
          //Assign user's audio stream(microphone) to the audio element(<html>) basically what to play inside this audio element
          localElement.srcObject = localMediaStream.current;
        }

        //Socket emit JOIN socket io
        socket.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });

    // Leaving the room
    return () => {
      localMediaStream.current
        .getTracks()
        .forEach((track) => track.stop());
      socket.current.emit(ACTIONS.LEAVE, { roomId });
    };
  },[]);

  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      // If already connected then prevent connecting again
      if (peerId in connections.current) {
        return console.warn(
          `You are already connected with ${peerId} (${user.name})`
        );
      }
      //If no existing connection create a new RTCPeerConnection and store it
      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });
      //Adds an event handler on the newly created RTCPeerConnection
      connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId, //To whom we want to send the ice-candidate
          icecandidate: event.candidate,
        });
      };
      // Handle on track event on this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        //Adds the remote user to the client list, mutes the audio and associates audio stream with audio element
        addNewClient({ ...remoteUser, muted: true }, () => {
          //If an audio element exists, it updates the srcObject property to the stream
          if (audioElements.current[remoteUser.id]) {
            audioElements.current[remoteUser.id].srcObject = remoteStream;
          }
          //If no then it waits until the audio element is created and then update it
          else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser.id]) {
                audioElements.current[remoteUser.id].srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 1000);
          }
        });
      };
      // Add connection to peer connections track
      localMediaStream.current.getTracks().forEach((track) => {
        //adds each track to the RTCPeerConnection created for the new peer
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });
      // Create an offer if required
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        // Set as local description
        await connections.current[peerId].setLocalDescription(offer);
        // Send offer to the server
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };

    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

    //Cleanup function, it removes the ADD_PEER event listener when the computer unmounts
    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, [clients]);

  // Handle ice candidate
  useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });
    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  //Handle Session Desricption
  useEffect(() => {
    const setRemoteMedia = async ({peerId,sessionDescription: remoteSessionDescription,}) => {
      connections.current[peerId].setRemoteDescription(new RTCSessionDescription(remoteSessionDescription));
      // If session descrition is offer then create an answer
      if (remoteSessionDescription.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();
        connection.setLocalDescription(answer);
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };
    socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  //Handle Remove Peer
  useEffect(() => {
    const handleRemovePeer = ({ peerID, userId }) => {
        console.log('leaving', peerID, userId);
        if (connections.current[peerID]) {
          connections.current[peerID].close();
        }
        delete connections.current[peerID];
        delete audioElements.current[peerID];
        setClients((list) => list.filter((c) => c.id !== userId));
    };
    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
    //Clean-Up Function
    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  },[]);

  //So that for every mute/inmute query out components doesn't render again and again..it would have that's with setClients
  useEffect(() => {
    clientsRef.current = clients;
  },[clients]);

  //Listen For Mute/UnMute
  useEffect(() => {
    socket.current.on(ACTIONS.MUTE,({peerId,userId}) => {
      setMute(true,userId);
    });
    socket.current.on(ACTIONS.UNMUTE,({peerId,userId}) => {
      setMute(false,userId);
    });
    const setMute = (mute,userId) => {
    //map will return a new array which will have client Id's of all the clients..and among those id's we'll find the one matching userId
      const clientIdx = clientsRef.current.map(client => client.id).indexOf(userId);
      const connectedClients = JSON.parse(
        JSON.stringify(clientsRef.current)
      );
      if(clientIdx>-1){
        connectedClients[clientIdx].muted = mute;
        setClients(connectedClients);
      }
    };

  },[]);

  const provideRef = (instance, userId) => {
    // Storing a reference to the audio element(html istance) for a user with userId
    audioElements.current[userId] = instance;
  };

  //Handling Mute
  const handleMute = (isMute,userId) =>{
    let settled = false;
    let interval = setInterval(() => {
      if(localMediaStream.current){
        localMediaStream.current.getTracks()[0].enabled = !isMute;
        if(isMute){
          socket.current.emit(ACTIONS.MUTE,{
            roomId,
            userId,
          });
        }
        else{
          socket.current.emit(ACTIONS.UNMUTE,{
            roomId,
            userId,
          });
        }
        settled = true;
      }
      if(settled){
        clearInterval(interval);
      }
    },200);
  };

  return { clients, provideRef , handleMute};
};
