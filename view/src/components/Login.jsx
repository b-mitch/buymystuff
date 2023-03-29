import React, { useState } from "react";
import PropTypes from 'prop-types';
import { loginUser, addLocalCartToDB } from '../utility/helpers';
import { useNavigate } from 'react-router-dom';


export default function Login({ setToken }) {
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
    const response = await loginUser({
        username,
        password
    });
    if(response.error){
      setError(response.message)
      return;
    }
    setToken(response);
    addLocalCartToDB(JSON.parse(JSON.stringify(response.token)));
    localStorage.removeItem("cart");
    navigate("/");
  }

  const errorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h3>{error===true ? 'Please enter all the fields' : error}</h3>
      </div>
    );
  };

  return (
    <div>
        <h1>Welcome!</h1>

      <div className="form">

        <div className="messages">
          {errorMessage()}
        </div>

        <form>
          <h2>Login to your account</h2>
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
    </div>
  );
}

  Login.propTypes = {
  setToken: PropTypes.func.isRequired
  }
  