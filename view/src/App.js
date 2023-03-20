import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate, Outlet, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Registration from './components/Registration';
import Login from './components/Login';
import Hair from './components/Shop/Categories/Hair';
import Face from './components/Shop/Categories/Face';
import Body from './components/Shop/Categories/Body';
import Product from './components/Shop/Product';
import ProtectedRoutes from './components/ProtectedRoutes';
import Account from './components/User/Account/Account';
import Details from "./components/User/Account/Details";
import Orders from "./components/User/Account/Orders";
import Returns from "./components/User/Account/Returns";
import Password from "./components/User/Account/Password";
import Cart from "./components/User/Cart";
import Checkout from "./components/User/Checkout";
import { useToken } from './utility/helpers';

function App () {
  const navigate = useNavigate();
  const { token, setToken } = useToken();
  const [search, setSearch] = useState({
    query: '',
    list: []
  });

  function handleLogOut() {
    sessionStorage.removeItem("token");
    setToken({token: null});
    navigate("/")
  }

  const NavBar = () => {
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
            <li>
              <NavLink to="/cart">Cart</NavLink>
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
        <button onClick={handleLogOut}>Log Out</button>
      </nav>
    )
  }

  const Redirect = () => {
    return token ? <Navigate to="/" /> : <Outlet />;
  };

    return (
      <div>

        <NavBar />

        <Routes>
          <Route path="/" element={<Home token={token} setSearch={setSearch} search={search} />} />
          <Route element={<Redirect />}>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Registration setToken={setToken} />} />
          </Route>
          <Route path="/c/hair" element={<Hair />} />
          <Route path="/c/face" element={<Face />} />
          <Route path="/c/body" element={<Body />} />
          <Route path="/product/:id" element={<Product search={search} token={token}/>} />
          <Route path="/cart" element={<Cart token={token} />} />
          <Route path="/checkout" element={<Checkout token={token} />} />
          <Route element={<ProtectedRoutes token={token} />}>
            <Route path="account" element={<Account token={token} />} />
            <Route path="/account/details" element={<Details token={token} />} />
            <Route path="/account/orders" element={<Orders token={token} />} />
            <Route path="/account/password" element={<Password token={token} />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/cart" element={<Cart token={token} />} />
            <Route path="/checkout" element={<Checkout token={token} />} />
          </Route>
        </Routes>
      </div>
    )
}

export default App;
