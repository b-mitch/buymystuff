import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, addLocalCartToDB } from "../utility/helpers";

export default function Registration({ setToken }) {
  const navigate = useNavigate();
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+\.[a-zA-Z_.+-]+$/, "gm");

  const handleFirst = (e) => {
    setFirst(e.target.value);
    setSubmitted(false);
  };

  const handleLast = (e) => {
    setLast(e.target.value);
    setSubmitted(false);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setSubmitted(false);
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
    setSubmitted(false);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setSubmitted(false);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setEmailError(false);
    setPasswordError(false);
    if (first === '' || last === '' || email === '' || username === '' || password === '') {
      setError(true);
      return;
    }
    if (!emailRegex.test(email)){
      setEmailError(true);
      return;
    }
    if (password.length < 6 || password.length > 20){
      setPasswordError(true);
      return;
    }
    setError(false);
    setEmailError(false);
    setPasswordError(false);
    const response = await createUser({
      first: first,
      last: last,
      email: email,
      username: username,
      password: password
    })
    if(response.error){
      setError(response.message)
      return;
    }
    setSubmitted(true);
    setToken(response);
    addLocalCartToDB(JSON.parse(JSON.stringify(response.token)));
    localStorage.removeItem("cart");
    navigate("/");
  }

  const successMessage = () => {
    return (
      <div
        className="success"
        style={{
          display: submitted ? '' : 'none',
        }}>
        <h1>User {username} successfully registered!!</h1>
      </div>
    );
  };

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

  const emailErrorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: emailError ? '' : 'none',
        }}>
        <h1>Please enter valid email</h1>
      </div>
    );
  };

  const passwordErrorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: passwordError ? '' : 'none',
        }}>
        <h1>Password must be greater than 5 digits and less than 20</h1>
      </div>
    );
  };

  return (
    <div className="form-container">
      <div className="registration form">
        <h1 className="title">User Registration</h1>

      <div className="messages">
        {passwordErrorMessage()}
        {emailErrorMessage()}
        {errorMessage()}
        {successMessage()}
      </div>

        <h2 className="subtitle">Create your account</h2>
        <div className="input-container ic1">
          <input value={first} className="input" onChange={handleFirst} type="text" id="first"/>
          <div className="cut"></div>
          <label for="first" className="placeholder">First name</label>
        </div>
        <div className="input-container ic2">
          <input value={last} className="input" onChange={handleLast} type="text" id="last"/>
          <div className="cut"></div>
          <label for="last" className="placeholder">Last name</label>
        </div>
        <div className="input-container ic2">
          <input value={email} className="input" onChange={handleEmail} type="email" id="email"/>
          <div className="cut"></div>
          <label for="email" className="placeholder">Email</label>
        </div>
        <div className="input-container ic2">
          <input value={username} className="input" onChange={handleUsername} type="text" id="username"/>
          <div className="cut"></div>
          <label for="username" className="placeholder">Username</label>
        </div>
        <div className="input-container ic2">
          <input value={password} className="input" onChange={handlePassword} type="PASSWORD" id="password"/>
          <div className="cut"></div>
          <label for="password" className="placeholder">Password</label>
        </div>
        <button onClick={handleSubmit} className="submit" type="submit">Submit</button>
      </div>
    </div>
  );
}