import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function Confirmation() {
  const confirmation = JSON.parse(sessionStorage.getItem('confirmation'))
  const confID = confirmation.id

  return (
    <div className='confirmation'>
      <h1>Order confirmed!</h1>
      <h2>Confirmation #:{confID}</h2>
    </div>
  )
}