import React from "react";
import { Link } from 'react-router-dom';


export default function Account({ token }) {

  return (

    <div className="account-container">
      <div className="account-header">
        <h3>Member since: CREATION_DATE</h3>
        <h1>Hi, FIRST_NAME</h1>
        <h3>Member number: USER_ID</h3>
      </div>
      <div className="account-links">
        <div className="order-links">
          <Link to='/account/orders'>Order history</Link>
          <Link to='/returns'>Returns</Link>
        </div>
        <div className="detail-links">
          <Link to='/account/details'>Account details</Link>
          <Link to='/account/password'>Change password</Link>
        </div>
      </div>
    </div>
  )
}