import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Nav({ setToken, token }) {
  const navigate = useNavigate();

  function removeToken() {
    setToken(null);
    sessionStorage.removeItem("token");
    navigate("/")
  }

  if(!token){
    return (
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
          <li>
            <NavLink to="/register">Sign Up</NavLink>
          </li>
        </ul>
      </nav>
    )
  }
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/account">Account</NavLink>
        </li>
        <li>
          <NavLink to="/cart">Cart</NavLink>
        </li>
      </ul>
      <button onClick={removeToken}>Log Out</button>
    </nav>
  )
}