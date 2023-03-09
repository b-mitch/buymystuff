import React, { useState } from "react";

export default function Registration() {
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
 
  const handleSubmit = (e) => {
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
    setSubmitted(true);
    fetch('/register' , {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first: first,
        last: last,
        email: email,
        username: username,
        password: password
      })
    })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
    })
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
        <h1>Please enter all the fields</h1>
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
    <div className="form">
      <div>
        <h1>User Registration</h1>
      </div>

      <div className="messages">
        {passwordErrorMessage()}
        {emailErrorMessage()}
        {errorMessage()}
        {successMessage()}
      </div>

      <form>
        <h3>Create your account</h3>
        <label for="first">
          First Name: 
          <input value={first} className="input" onChange={handleFirst} type="text" name="first"/>
        </label>
        <label for="last">
          Last Name:
          <input value={last} className="input" onChange={handleLast} type="text" name="last"/>
        </label>
        <label for="email">
          Email:
          <input value={email} className="input" onChange={handleEmail} type="email" name="email"/>
        </label>
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
  );
}