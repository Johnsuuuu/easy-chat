import React from 'react';
import video from '../assets/video_title.svg';

const AppBar = () => {
  return (
    <div className="site-title">
      <img src={video} alt="chat icon" style={{ height: 30 }} /> EASY CHAT
    </div>
  );
};

export default AppBar;
