import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './App.less';
import Video from './components/Video';
import Options from './components/Options';
import AppBar from './components/AppBar';

const App = () => {
  return (
    <div>
      <AppBar />
      <Video />
      <Options />
    </div>
  );
};

export default App;
