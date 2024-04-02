import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MyComponent from './components/MyComponent';
import { MyProvider } from './context/MyContext';
import SavedLocations from './components/SavedLocations';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mycomponent" element={<MyProvider><MyComponent /></MyProvider>} />
          <Route path="/SavedLocations" element={<MyProvider><SavedLocations /></MyProvider>} />
          <Route path="/" element={isLoggedIn == "true" ? <MyProvider><Dashboard /></MyProvider>  : <Login />} />
          <Route path="/Signup" element={<MyProvider><Signup /></MyProvider>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
