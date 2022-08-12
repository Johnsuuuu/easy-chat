import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './App.less';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
