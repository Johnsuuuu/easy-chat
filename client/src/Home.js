import React from 'react';
import Video from './components/Video';
import Options from './components/Options';
import AppBar from './components/AppBar';
import { ContextProvider } from './SocketContext';

const Home = () => {
  return (
    <ContextProvider>
      <div>
        <AppBar />
        <Video />
        <Options />
      </div>
    </ContextProvider>
  );
};

export default Home;
