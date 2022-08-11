/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useRef } from 'react';
import { SocketContext } from '../SocketContext';
import { Modal, Input, notification, Avatar } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import VideoIcon from '../assets/video.svg';
import VideoOff from '../assets/video-off.svg';
import ChatIllus from '../assets/chat.svg';
import Msg from '../assets/comments-solid.svg';
import { socket } from '../SocketContext';

const { Search } = Input;

const Video = () => {
  const {
    callAccepted,
    myVideo,
    userVideo,
    stream,
    name,
    callEnded,
    call,
    sendMsg: sendMsgFunc,
    msgRcv,
    chat,
    setChat,
    userName,
    myVideoStatus,
    userVideoStatus,
    updateVideo,
    myMicStatus,
    userMicStatus,
    updateMic,
  } = useContext(SocketContext);

  const [sendMsg, setSendMsg] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scroller = useRef();

  socket.on('msgRcv', ({ name, msg: value, sender }) => {
    let msg = {};
    msg.msg = value;
    msg.type = 'rcv';
    msg.sender = sender;
    msg.timestamp = Date.now();
    setChat([...chat, msg]);
  });

  useEffect(() => {
    if (scroller?.current)
      scroller.current.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const showModal = (showVal) => {
    setIsModalVisible(showVal);
  };

  const onSearch = (value) => {
    if (value && value.length) {
      sendMsgFunc(value);
    }
    setSendMsg('');
  };

  useEffect(() => {
    if (msgRcv.value && !isModalVisible) {
      notification.open({
        message: '',
        description: `${msgRcv.sender}: ${msgRcv.value}`,
        icon: <MessageOutlined style={{ color: '#185348' }} />,
      });
    }
  }, [msgRcv]);

  return (
    <div className="grid">
      {stream ? (
        <div style={{ textAlign: 'center' }} className="card-my">
          <div style={{ height: '2rem' }}>
            <h3 style={{ color: 'white' }}>{myVideoStatus && name}</h3>
          </div>
          <div className="video-avatar-container">
            <video
              width="100%"
              height="100%"
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="video-active"
              style={{
                opacity: `${myVideoStatus ? '1' : '0'}`,
              }}
            />
            <Avatar
              style={{
                backgroundColor: '#1f1f1f8e',
                position: 'absolute',
                opacity: `${myVideoStatus ? '0' : '1'}`,
              }}
              size={98}
              icon={!name && <UserOutlined />}
            >
              {name}
            </Avatar>
          </div>
          <div className="iconsDiv">
            <div
              className="icons"
              onClick={() => {
                updateMic();
              }}
              tabIndex="0"
            >
              <i
                className={`fa fa-microphone${myMicStatus ? '' : '-slash'}`}
                style={{ transform: 'scaleX(-1)', color: '#185348' }}
                aria-label={`${myMicStatus ? 'mic on' : 'mic off'}`}
                aria-hidden="true"
              ></i>
            </div>

            {callAccepted && !callEnded && (
              <div
                className="icons"
                onClick={() => {
                  setIsModalVisible(!isModalVisible);
                }}
                tabIndex="0"
              >
                <img src={Msg} alt="chat icon" />
              </div>
            )}
            <Modal
              title="Chat"
              footer={null}
              visible={isModalVisible}
              onCancel={() => showModal(false)}
              style={{ maxHeight: '100px' }}
            >
              {chat.length ? (
                <div className="msg_flex">
                  {chat.map((msg) => (
                    <div
                      className={msg.type === 'sent' ? 'msg_sent' : 'msg_rcv'}
                    >
                      {msg.msg}
                    </div>
                  ))}
                  <div ref={scroller} id="no_border"></div>
                </div>
              ) : (
                <div className="chat_img_div">
                  <img src={ChatIllus} alt="msg_illus" className="img_illus" />
                </div>
              )}
              <Search
                placeholder="your message"
                allowClear
                className="input_msg"
                enterButton="Send"
                onChange={(e) => setSendMsg(e.target.value)}
                value={sendMsg}
                size="large"
                onSearch={onSearch}
              />
            </Modal>
            <div className="icons" onClick={() => updateVideo()} tabIndex="0">
              {myVideoStatus ? (
                <img src={VideoIcon} alt="video on icon" />
              ) : (
                <img src={VideoOff} alt="video off icon" />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bouncing-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {callAccepted && !callEnded && userVideo && (
        <div className="card-user" style={{ textAlign: 'center' }}>
          <div style={{ height: '2rem' }}>
            <h3 style={{ color: 'white' }}>
              {userVideoStatus && (call.name || userName)}
            </h3>
          </div>
          <div className="video-avatar-container">
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className="video-active"
              style={{
                opacity: `${userVideoStatus ? '1' : '0'}`,
              }}
            />
            <Avatar
              style={{
                backgroundColor: '#1f1f1f8e',
                position: 'absolute',
                opacity: `${userVideoStatus ? '0' : '1'}`,
              }}
              size={98}
              icon={!(call.name || userName) && <UserOutlined />}
            >
              {call.name || userName}
            </Avatar>
            {!userMicStatus && (
              <i
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  padding: '0.3rem',
                  backgroundColor: '#fefefebf',
                }}
                className="fad fa-volume-mute fa-2x"
                aria-hidden="true"
                aria-label="microphone muted"
              ></i>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Video;
