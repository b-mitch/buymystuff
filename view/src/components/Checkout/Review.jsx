import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";

const { seshFirst, seshLast, seshEmail, seshBillingAddress, seshBillingCity, seshBillingState, seshBillingZip, seshShippingAddress, seshShippingCity, seshShippingState, seshShippingZip } = JSON.parse(sessionStorage.getItem('checkout'));

const stripePromise = loadStripe('pk_test_51MpCyhDoFFCpZ0bnXeGikLiIbkZ2f2GcDkzkvYgLXIJamiz6XojIzXOsymQFmXdoaLFxTAQu2WoyOASqDicB5XLQ001b0QGfud');

export default function Review({
  cart,
  total,
  token,
  cartItems,
  cartTotal
}) {
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/checkout/create-payment-intent", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": token 
        },
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const handleSubmit = (e) => {}

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
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
              {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              )}
            </div>
          </div>
        </div>
      );
}