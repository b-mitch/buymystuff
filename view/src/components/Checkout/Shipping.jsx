import React from "react";
import { Link } from 'react-router-dom';

export default function Shipping({
  token, 
  inputFields, 
  handleChange, 
  handleSubmit
}) {

  return (
    <div className='checkout'>
      <div className='page-history'><Link to='../../cart'>&lt;Cart</Link>
      </div>
      <div className="contact-shipping">
        <div className="contact">
          <h2>Contact information</h2>
          {token ? <h3>Edit email in account details page</h3> : <></>}
          <label for="email">
            Email*
            <input value={inputFields.email} className="input" type="email" name="email" disabled={token ? true : false} onChange={e => handleChange(e)}/>
          </label>
        </div>
        <div className="shipping">
          <h2>Shipping address</h2>
          <label for="first">
            First name* 
            <input value={inputFields.first} className="input" onChange={e => handleChange(e)} type="text" name="first"/>
          </label>
          <label for="last">
            Last name*
            <input value={inputFields.last} className="input" onChange={e => handleChange(e)} type="text" name="last"/>
          </label>
          <label for="address">
            Billing address*
            <input value={inputFields.shippingAddress} className="input" onChange={e => handleChange(e)} type="text" name="shippingAddress"/>
          </label>
          <label for="city">
            City*
            <input value={inputFields.shippingCity} className="input" onChange={e => handleChange(e)} type="text" name="shippingCity"/>
          </label>
          <label for="state">
            State*
            <input value={inputFields.shippingState} className="input" onChange={e => handleChange(e)} type="text" name="shippingState"/>
          </label>
          <label for="zip">
            Postal code*
            <input value={inputFields.shippingZip} className="input" onChange={e => handleChange(e)} type="text" name="shippingZip"/>
          </label>
        </div>
      </div>
      <button className="checkout-btn" onClick={e => handleSubmit(e)}>Continue</button>
    </div>
  )
}