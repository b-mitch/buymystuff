import React, { useState, useEffect } from "react";
import { getUser, updateDetails } from "../../../utility/helpers";

export default function Details({ token }) {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser(token);
      const newFirst = user.first_name;
      setFirst(newFirst);
      const newLast = user.last_name;
      setLast(newLast);
      const newEmail = user.email;
      setEmail(newEmail);
      const newUsername = user.username;
      setUsername(newUsername);
      const newAddress = user.address;
      setAddress(newAddress);
      const newCity = user.city;
      setCity(newCity);
      const newState = user.state;
      setState(newState);
      const newZip = user.zip;
      setZip(newZip);
    };
    
    fetchData();
  }, [])

  const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+\.[a-zA-Z_.+-]+$/, "gm");

  const handleFirst = (e) => {
    setFirst(e.target.value);
    setUpdated(false);
  };

  const handleLast = (e) => {
    setLast(e.target.value);
    setUpdated(false);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setUpdated(false);
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
    setUpdated(false);
  };

  const handleAddress = (e) => {
    setAddress(e.target.value);
    setUpdated(false);
  };

  const handleCity = (e) => {
    setCity(e.target.value);
    setUpdated(false);
  };

  const handleState = (e) => {
    setState(e.target.value);
    setUpdated(false);
  };

  const handleZip = (e) => {
    setZip(e.target.value);
    setUpdated(false);
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(false);
    setEmailError(false);
    if (first === '' || last === '' || email === '' || username === '') {
      setError(true);
      return;
    }
    if (!emailRegex.test(email)){
      setEmailError(true);
      return;
    }
    setError(false);
    setEmailError(false);
    setUpdated(true);
    await updateDetails(token, {
      first: first,
      last: last,
      email: email,
      username: username,
      address: address,
      city: city,
      state: state,
      zip: zip
    });
  }

  const successMessage = () => {
    return (
      <div
        className="success"
        style={{
          display: updated ? '' : 'none',
        }}>
        <h3>Details updated</h3>
      </div>
    );
  };

  const updateError = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h3>Error</h3>
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
        <h3>Please enter a valid email</h3>
      </div>
    );
  };

  return (
    <div className="update-details">
      <div className="messages">
        {emailErrorMessage()}
        {updateError()}
        {successMessage()}
      </div>
      <form>
        <h1>Your personal details</h1>
        <label for="first">
          First name*
          <input value={first} className="input" onChange={handleFirst} type="text" name="first"/>
        </label>
        <label for="last">
          Last name*
          <input value={last} className="input" onChange={handleLast} type="text" name="last"/>
        </label>
        <label for="email">
          Email*
          <input value={email} className="input" onChange={handleEmail} type="email" name="email"/>
        </label>
        <label for="username">
          Username*
          <input value={username} className="input" onChange={handleUsername} type="text" name="username"/>
        </label>
        <label for="address">
          Mailing address*
          <input value={address} className="input" onChange={handleAddress} type="text" name="address"/>
        </label>
        <label for="city">
          City*
          <input value={city} className="input" onChange={handleCity} type="text" name="city"/>
        </label>
        <label for="state">
          State*
          <input value={state} className="input" onChange={handleState} type="text" name="state"/>
        </label>
        <label for="zip">
          Postal code*
          <input value={zip} className="input" onChange={handleZip} type="text" name="zip"/>
        </label>
        <button onClick={handleUpdate} className="btn" type="submit">Update</button>
      </form>
    </div>
  )
}