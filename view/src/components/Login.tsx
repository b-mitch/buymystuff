import React, { useState } from "react";
import { loginUser, addLocalCartToDB } from '../utility/helpers';
import { useNavigate } from 'react-router-dom';


const Login: React.FC<any> = ({setToken}) => {
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
    addLocalCartToDB(response.token);
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
    <div className="form-container">
      <div className="messages">
        {errorMessage()}
      </div>
      <div className="login form">
        <h1 className="title">Welcome!</h1>

      <h2 className="subtitle">Login to your account</h2>
        <div className="input-container ic1">
          <input value={username} className="input" onChange={handleUsername} type="text" id="username"/>
          <div className="cut"></div>
          <label htmlFor="username" className="placeholder">Username</label>
        </div>
        <div className="input-container ic2">
          <input value={password} className="input" onChange={handlePassword} type="PASSWORD" id="password"/>
          <div className="cut"></div>
          <label htmlFor="password" className="placeholder">Password</label>
        </div>
        <button onClick={handleSubmit} className="submit" type="submit">Submit</button>
      </div>
    </div>
  );
}

export default Login;
