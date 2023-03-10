import React, { useState } from "react";
import PropTypes from 'prop-types';
import { loginUser } from '../utility/helpers';


export default function Login({ setToken }) {
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
        <h1>Welcome!</h1>

      <div className="form">

        <div className="messages">
          {errorMessage()}
        </div>

        <form>
          <h3>Login to your account</h3>
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