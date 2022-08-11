/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useRef } from 'react';
import { Input, Button, Tooltip, Modal, message } from 'antd';
import Phone from '../assets/phone.gif';
import Teams from '../assets/teams.mp3';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SocketContext } from '../SocketContext';
import Hang from '../assets/phone-slash-solid.svg';
import Answer from '../assets/phone-flip-solid.svg';
import PeaceOut from '../assets/hand-peace-solid.svg';
import {
  UserOutlined,
  CopyFilled,
  InfoCircleOutlined,
  PhoneFilled,
} from '@ant-design/icons';

const Options = () => {
  const [idToCall, setIdToCall] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const Audio = useRef();
  const {
    call,
    callAccepted,
    name,
    setName,
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
    setOtherUser,
    declineCall,
  } = useContext(SocketContext);

  useEffect(() => {
    if (isModalVisible) {
      Audio?.current?.play();
    } else {
      Audio?.current?.pause();
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      setIsModalVisible(true);
      setOtherUser(call.from);
    } else {
      setIsModalVisible(false);
    }
  }, [call.isReceivingCall]);

  return (
    <div className="options">
      <div style={{ marginBottom: '0.5rem' }}>
        <h2>User Info</h2>
        <Input
          size="large"
          placeholder="Your name"
          prefix={<UserOutlined />}
          maxLength={15}
          disabled={callAccepted && !callEnded}
          suffix={<small>{name.length}/15</small>}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="inputgroup"
        />
        <div className="share_options">
          <CopyToClipboard text={me}>
            <Button
              type="primary"
              icon={<CopyFilled />}
              className="btn"
              tabIndex="0"
              disabled={callAccepted && !callEnded}
              onClick={() => message.success('Code copied successfully')}
            >
              Copy
            </Button>
          </CopyToClipboard>
        </div>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <h2>Make a Call</h2>
        <Input
          placeholder="Enter code to call"
          size="large"
          className="inputgroup"
          value={idToCall}
          disabled={callAccepted && !callEnded}
          onChange={(e) => setIdToCall(e.target.value)}
          style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
          prefix={<UserOutlined className="site-form-item-icon" />}
          suffix={
            <Tooltip title="Enter code of the other user">
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          }
        />
        {callAccepted && !callEnded ? (
          <Button
            variant="contained"
            type="primary"
            danger
            onClick={leaveCall}
            className="hang"
            tabIndex="0"
          >
            <img
              src={PeaceOut}
              alt="hang up"
              style={{ height: '15px', marginBottom: '5px' }}
            />
            &nbsp; Hang Up
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<PhoneFilled />}
            onClick={() => {
              if (name.length && idToCall.length) callUser(idToCall);
              else {
                if (!name.length) {
                  message.error('Please enter your name first');
                } else {
                  message.error('Please enter code of the other user');
                }
              }
            }}
            className="btn"
            tabIndex="0"
          >
            Call
          </Button>
        )}
      </div>
      {call.isReceivingCall && !callAccepted && (
        <>
          <audio src={Teams} loop ref={Audio} />
          <Modal
            title="Incoming Call"
            visible={isModalVisible}
            closable={false}
            footer={null}
          >
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <h1>
                {call.name} is calling:{' '}
                <img
                  src={Phone}
                  alt="phone ringing"
                  className="phone"
                  style={{ display: 'inline-block' }}
                />
              </h1>
            </div>
            <div className="btnDiv">
              <Button
                variant="contained"
                className="answer"
                type="primary"
                onClick={() => {
                  answerCall();
                  Audio.current.pause();
                }}
                tabIndex="0"
              >
                <img src={Answer} alt="hang up" style={{ height: '15px' }} />
                &nbsp; Answer
              </Button>
              <Button
                variant="contained"
                className="decline"
                type="primary"
                danger
                onClick={() => {
                  setIsModalVisible(false);
                  Audio.current.pause();
                  declineCall();
                }}
                tabIndex="0"
              >
                <img src={Hang} alt="hang up" style={{ height: '15px' }} />
                &nbsp; Decline
              </Button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Options;
