import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, Link } from 'react-router-dom';

export default function Details({ token }) {
  return (
    <div>
      <h1>Account Details</h1>
      <Link to='/account/details/edit'>Edit Details</Link>
      <Link to='/account/details/password'>Edit Password</Link>
    </div>
  )
}