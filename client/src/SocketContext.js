/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, createContext } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();
// for local testing, use url 'http://localhost:5000' instead
const URL = 'https://easy-chat-slugj.herokuapp.com';
const socket = io(URL);

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(null);
  const [chat, setChat] = useState([]);
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [userName, setUserName] = useState('');
  const [otherUser, setOtherUser] = useState('');
  const [myVideoStatus, setMyVideoStatus] = useState(true);
  const [userVideoStatus, setUserVideoStatus] = useState();
  const [myMicStatus, setMyMicStatus] = useState(true);
  const [userMicStatus, setUserMicStatus] = useState();
  const [msgRcv, setMsgRcv] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.on('me', (id) => {
      setMe(id);
    });

    socket.on('endCall', () => {
      setCallEnded(true);
      connectionRef.current.destroy();
      window.location.reload();
    });

    socket.on('declineCall', () => {
      window.location.reload();
    });

    socket.on('updateUserMedia', ({ type, currentMediaStatus }) => {
      if (
        currentMediaStatus !== null &&
        currentMediaStatus !== [] &&
        currentMediaStatus !== undefined
      ) {
        switch (type) {
          case 'video':
            setUserVideoStatus(currentMediaStatus);
            break;
          case 'mic':
            setUserMicStatus(currentMediaStatus);
            break;
          default:
            setUserMicStatus(currentMediaStatus[0]);
            setUserVideoStatus(currentMediaStatus[1]);
            break;
        }
      }
    });

    socket.on('callUser', ({ signal, from, name: callerName }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    socket.on('msgRcv', ({ msg: value, sender }) => {
      setMsgRcv({ value, sender });
      setTimeout(() => {
        setMsgRcv({});
      }, 2000);
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    setOtherUser(call.from);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', {
        signal: data,
        to: call.from,
        userName: name,
        type: 'initial',
        myMediaStatus: [myMicStatus, myVideoStatus],
      });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    setOtherUser(id);
    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', ({ signal, userName }) => {
      setCallAccepted(true);
      setUserName(userName);
      peer.signal(signal);
      socket.emit('updateMyMedia', {
        type: 'initial',
        currentMediaStatus: [myMicStatus, myVideoStatus],
      });
    });

    connectionRef.current = peer;
  };

  const updateVideo = () => {
    setMyVideoStatus((currentStatus) => {
      socket.emit('updateMyMedia', {
        type: 'video',
        currentMediaStatus: !currentStatus,
      });
      stream.getVideoTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };

  const updateMic = () => {
    setMyMicStatus((currentStatus) => {
      socket.emit('updateMyMedia', {
        type: 'mic',
        currentMediaStatus: !currentStatus,
      });
      stream.getAudioTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    socket.emit('endCall', { id: otherUser });
    window.location.reload();
  };

  const declineCall = () => {
    socket.emit('declineCall', { id: call.from });
    window.location.reload();
  };

  const sendMsg = (value) => {
    socket.emit('msgUser', { name, to: otherUser, msg: value, sender: name });
    let msg = {};
    msg.msg = value;
    msg.type = 'sent';
    msg.timestamp = Date.now();
    msg.sender = name;
    setChat([...chat, msg]);
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        sendMsg,
        msgRcv,
        chat,
        setChat,
        setMsgRcv,
        setOtherUser,
        userName,
        myVideoStatus,
        setMyVideoStatus,
        userVideoStatus,
        setUserVideoStatus,
        updateVideo,
        myMicStatus,
        userMicStatus,
        updateMic,
        declineCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext, socket };
