import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import ProtectedRoutes from './components/ProtectedRoutes';
import Nav from './components/Nav';
import Registration from './components/Registration';
import Login from './components/Login';
import Home from './components/Home';
import Account from './components/User/Account/Account';
import Details from "./components/User/Account/Details";
import Orders from "./components/User/Account/Orders";
import Returns from "./components/User/Account/Returns";
import Password from "./components/User/Account/Password";
import Cart from "./components/User/Cart";
import Checkout from "./components/User/Checkout";
import { useToken } from './utility/helpers';

function App () {
  const { token, setToken } = useToken();

  return (
    <div>
      <Nav 
        setToken={setToken}
        token={token}
      />
      <Routes>
        <Route 
            path="/login" 
            element={<Login setToken={setToken} />} 
          />
        <Route 
          exact path="/register"   
          element={<Registration setToken={setToken} />} />
        <Route path="/" element={<Home token={token} />} />
        <Route path="/c/:id" element={<Categories />} />
        <Route path="/product/:id" element={<Product />} />
        <Route element={<ProtectedRoutes token={token} />}>
          <Route path="/account" element={<Account token={token} />} />
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
