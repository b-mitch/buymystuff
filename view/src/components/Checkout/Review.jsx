import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

const { seshFirst, seshLast, seshEmail, seshBillingAddress, seshBillingCity, seshBillingState, seshBillingZip, seshShippingAddress, seshShippingCity, seshShippingState, seshShippingZip } = JSON.parse(sessionStorage.getItem('checkout'));

export default function Review({
  cart,
  total,
  token,
  cartItems,
  cartTotal
}) {
  const navigate = useNavigate();


  const [error, setError] = useState(false);

  const handleSubmit = (e) => {}

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

  return (
        <div className='checkout-step'>
          <nav className='page-history'><Link to='../shipping'>&lt; Shipping</Link></nav>
          <h1>Review and Pay</h1>
          <div className='summary-container'>
            <div className='summary-card'>
              <h2>Shipping to</h2>
              <p>{seshFirst} {seshLast}<br/>
              {seshShippingAddress}<br/>
              {seshShippingCity}, {seshShippingState} {seshShippingZip}</p>
              <Link to='../shipping'>Change shipping address</Link>
              <h2>Shipping method:</h2>
              <p>Standard shipping - FREE<br/>
              Estimated arrival: 5 business days</p> 
            </div>
            <div className='summary-card'>
              {cartItems}
              {cartTotal}
            </div>
            <div className='summary-card'>
              <h2>Billing address</h2>
              <p>{seshFirst} {seshLast}<br/>
              {seshBillingAddress}<br/>
              {seshBillingCity}, {seshBillingState} {seshBillingZip}</p>
              <Link to='../contact-billing'>Edit</Link>
            </div>
            <div className='summary-card'>
              <h2>Payment options</h2>
            </div>
          </div>
          <button className="checkout-btn" type='../checkout/submit' onClick={(e) => {handleSubmit(e)}}>Submit order</button>
        </div>
      );
}