import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, Link } from 'react-router-dom';

export default function Cart({ token }) {
  return (
    <div>
      <h1>Cart</h1>
      <Link to='/checkout'>Checkout</Link>
    </div>
  )
}