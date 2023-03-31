import React, { useState } from "react";
import PropTypes from 'prop-types';
import { loginUser, addLocalCartToDB, noLoginCheckout } from '../utility/helpers';
import { useNavigate } from 'react-router-dom';


export default function CheckoutLogin({ setToken }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(false);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError(false);
      if (username === '' || password === '') {
        setError(true);
        return;
      }
      setError(false);
      const token = await loginUser({
          username,
          password
      });
      setToken(token);
      addLocalCartToDB(JSON.parse(JSON.stringify(token.token)));
      localStorage.removeItem("cart");
      navigate("/cart");
    }

  const handleClick = (e) => {
    e.preventDefault();
    noLoginCheckout();
    navigate("/checkout/shipping")
  }

  const errorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h2>Please enter all the fields</h2>
      </div>
    );
  };

  return (
    <div className="form-container">
      <div className="chkout-login form">
        <h1 className="title">Already have an account?</h1>

      <div className="messages">
        {errorMessage()}
      </div>

      <h2 className="subtitle">Sign in for easy access to your order!</h2>
        <div className="input-container ic1">
          <input value={username} className="input" onChange={handleUsername} type="text" id="username"/>
          <div className="cut"></div>
          <label for="username" className="placeholder">Username</label>
        </div>
        <div className="input-container ic2">
          <input value={password} className="input" onChange={handlePassword} type="text" id="password"/>
          <div className="cut"></div>
          <label for="password" className="placeholder">Password</label>
        </div>
        <button onClick={handleSubmit} className="submit" type="submit">Submit</button>
        <button onClick={(e) => {handleClick(e)}}
        className="chkout-btn submit" type="submit">Checkout as a guest</button>
      </div>
    </div>
  );
}

  CheckoutLogin.propTypes = {
  setToken: PropTypes.func.isRequired
  }
