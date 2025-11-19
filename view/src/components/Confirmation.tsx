import React from "react";

export default function Confirmation() {
  const confirmation = JSON.parse(sessionStorage.getItem('confirmation') || 'null')
  const confID = confirmation.id

  return (
    <div className='container'>
      <h1>Order confirmed!</h1>
      <h2>Confirmation #: {confID}</h2>
    </div>
  )
}