import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { setCheckoutSession } from '../../utility/helpers';

const { seshBillingAddress, seshBillingCity, seshBillingState, seshBillingZip, seshShippingAddress, seshShippingCity, seshShippingState, seshShippingZip } = JSON.parse(sessionStorage.getItem('checkout'));

export default function Shipping() {
  
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(seshShippingAddress);
  const [shippingCity, setShippingCity] = useState(seshShippingCity);
  const [shippingState, setShippingState] = useState(seshShippingState);
  const [shippingZip, setShippingZip] = useState(seshShippingZip);
  const [useShipping, setUseShipping] = useState(false);

  const [error, setError] = useState(false);

  const handleShippingAddress = (e) => {
    setCheckoutSession({seshShippingAddress: e.target.value})
  };

  const handleShippingCity = (e) => {
    setCheckoutSession({seshShippingCity: e.target.value})
  };

  const handleShippingState = (e) => {
    setCheckoutSession({seshShippingState: e.target.value})
  };

  const handleShippingZip = (e) => {
    setCheckoutSession({seshShippingZip: e.target.value})
  };

  const handleCheckboxChange = () => {
    if(useShipping) window.location.reload(false);
    if(!useShipping) {
      setShippingAddress(seshBillingAddress);
      setShippingCity(seshBillingCity);
      setShippingState(seshBillingState);
      setShippingZip(seshBillingZip);
      document.getElementById('shipping-form').style.display="none";
    }
    setUseShipping(!useShipping);
  }

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

  const handleShippingContinue = (e) => {
    e.preventDefault();
    setError(false);
    if (shippingAddress === '' || shippingCity === '' || shippingState === '' || shippingZip === '') {
      setError(true);
      return;
    }
    setError(false);
    setShippingAddress(seshShippingAddress);
    setShippingCity(seshShippingCity);
    setShippingState(seshShippingState);
    setShippingZip(seshShippingZip);

    navigate('../review')
  }

  const label = 'Shipping address same as billing?'

  return (
    <div className='checkout-step'>
      <nav className='page-history'><Link to='../contact-billing'>&lt; Contact and Billing</Link></nav>
      <div className="messages">
        {errorMessage()}
      </div>
      <h1>Shipping</h1>
        <label>
          <input type="checkbox" name={label} value={useShipping} onChange={handleCheckboxChange} className='shipping-checkbox'/>
          {label}
        </label>
        <form id="shipping-form">
          <label for="address">
            Shipping address*
            <input defaultValue={shippingAddress} className="input" onChange={handleShippingAddress} type="text" name="address" disabled={useShipping ? true : false}/>
          </label>
          <label for="city">
            City*
            <input defaultValue={shippingCity} className="input" onChange={handleShippingCity} type="text" name="city"
            disabled={useShipping ? true : false}/>
          </label>
          <label for="state">
            State*
            <input defaultValue={shippingState} className="input" onChange={handleShippingState} type="text" name="state" disabled={useShipping ? true : false}/>
          </label>
          <label for="zip">
            Postal code*
            <input defaultValue={shippingZip} className="input" onChange={handleShippingZip} type="text" name="zip" disabled={useShipping ? true : false}/>
          </label>
        </form>
      <button className="checkout-btn"><Link to='../checkout/review' onClick={handleShippingContinue}>Continue</Link></button>
    </div>
    
  )
}