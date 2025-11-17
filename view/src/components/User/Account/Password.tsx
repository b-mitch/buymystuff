import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { updatePassword } from "../../../utility/helpers";

const Password: React.FC<any> = ({ token }) => {

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
      return null;
    }
    setError(false);
    setPasswordError(false);
    const response = await updatePassword(token, {
      currentPassword: password,
      password: newPassword
    });
    if(response.error){
      setError(response.message)
      return null;
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
    <div className="container">
      <div className='page-history'><Link to='/account'>&lt; account</Link>
      </div>
      <div className="messages">
        {passwordErrorMessage()}
        {updateError()}
        {successMessage()}
      </div>
      <h1>Edit password</h1>
      <div className="account-details">
        <label htmlFor="password">
          Current password*
          <input value={password} className="input" onChange={handlePassword} type="text" name="password"/>
        </label>
          <label htmlFor="new-password">
            New password*
            <input value={newPassword} className="input" onChange={handleNewPassword} type="text" name="new-password"/>
        </label>
        <button onClick={handleUpdate} className="btn" type="submit">Update</button>
      </div>
    </div>
  )
}
export default Password;
