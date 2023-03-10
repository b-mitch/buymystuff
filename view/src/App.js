import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Registration from './components/Registration';
import Login from './components/Login';
import Home from './components/User/Home';
import { useToken } from './utility/helpers';

function App () {
  const { token, setToken } = useToken();

  if(!token) {
    return (
      <div>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/register">Sign Up</NavLink>
        </nav>
        <Routes>
          <Route 
            path="/" 
            element={<Login setToken={setToken} />} 
          />
          <Route path="/register" element={<Registration setToken={setToken} />} />
        </Routes>
      </div>
    )
  }
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/account">Account</NavLink>
        <NavLink to="/cart">Cart</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home token={token} />} />
      </Routes>
    </div>
  )
}

export default App;
