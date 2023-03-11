import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, Link } from 'react-router-dom';


export default function Account({ token }) {

  return (
    <div className="account-container">
      <h1>Account</h1>
      <Link to='/account/details'>Account Details</Link>
      <Link to='/account/orders'>Order History</Link>
    </div>
  )
}