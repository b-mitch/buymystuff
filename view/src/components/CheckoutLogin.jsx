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
    <div>
      <h1>Already have an account?</h1>
      <h2>Sign in for easy access to your order!</h2>

      <div className="form">

        <div className="messages">
          {errorMessage()}
        </div>

        <form>
          <label for="username">
            Username:
            <input value={username} className="input" onChange={handleUsername} type="text" name="username"/>
          </label>
          <label for="password">
            Password:
            <input value={password} className="input" onChange={handlePassword} type="text" name="password"/>
          </label>
          <button onClick={handleSubmit} className="btn" type="submit">Submit</button>
        </form>
      </div>
      <button onClick={(e) => {handleClick(e)}}>Checkout as a guest</button>
    </div>
  );
}

  CheckoutLogin.propTypes = {
  setToken: PropTypes.func.isRequired
  }
