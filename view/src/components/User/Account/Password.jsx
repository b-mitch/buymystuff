import React, { useState } from "react";
import { updatePassword } from "../../../utility/helpers";

export default function Password({ token }) {

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setUpdated(false);
  };

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
    setUpdated(false);
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(false);
    if (newPassword.length < 6 || newPassword.length > 20){
      setPasswordError(true);
      return;
    }
    setError(false);
    setPasswordError(false);
    const response = await updatePassword(token, {
      currentPassword: password,
      password: newPassword
    });
    if(response.error){
      setError(response.message)
      return;
    }
    setUpdated(true);
    setPassword('');
    setNewPassword('');
  }

  const successMessage = () => {
    return (
      <div
        className="success"
        style={{
          display: updated ? '' : 'none',
        }}>
        <h3>Password updated</h3>
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
        <h3>{error===true ? 'Please enter all the fields' : error}</h3>
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
        <h3>Password must be greater than 5 digits and less than 20</h3>
      </div>
    );
  };

  return (
    <div className="update-details">
      <div className="messages">
        {passwordErrorMessage()}
        {updateError()}
        {successMessage()}
      </div>
      <form>
        <h1>Edit password</h1>
        <label for="password">
          Current password*
          <input value={password} className="input" onChange={handlePassword} type="text" name="password"/>
        </label>
          <label for="new-password">
            New password*
            <input value={newPassword} className="input" onChange={handleNewPassword} type="text" name="new-password"/>
        </label>
        <button onClick={handleUpdate} className="btn" type="submit">Update</button>
      </form>
    </div>
  )
}