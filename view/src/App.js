import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Registration from './components/Registration';
import Login from './components/Login';
import Home from './components/User/Home';
import Account from './components/User/Account/Account';
import Details from "./components/User/Account/Details";
import Orders from "./components/User/Account/Orders";
import Edit from "./components/User/Account/Edit";
import Password from "./components/User/Account/Password";
import Cart from "./components/User/Cart";
import Checkout from "./components/User/Checkout";
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
          <Route exact path="/register" element={<Registration setToken={setToken} />} />
        </Routes>
      </div>
    )
  }
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/account">Account</NavLink>
        <NavLink to="/account/cart">Cart</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home token={token} />} />
        <Route path="/account" element={<Account token={token} />} />
        <Route path="/account/details" element={<Details token={token} />} />
        <Route path="/account/orders" element={<Orders token={token} />} />
        <Route path="/account/details/password" element={<Password token={token} />} />
        <Route path="/account/details/edit" element={<Edit token={token} />} />
        <Route path="/account/cart" element={<Cart token={token} />} />
        <Route path="/account/checkout" element={<Checkout token={token} />} />
      </Routes>
    </div>
  )
}

export default App;
