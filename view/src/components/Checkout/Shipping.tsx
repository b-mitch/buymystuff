import React from "react";
import { Link } from 'react-router-dom';

const Shipping: React.FC<any> = ({token, 
  inputFields, 
  handleChange, 
  handleSubmit}) => {

  return (
    <div className='checkout'>
      <div className='page-history'><Link to='../../cart'>&lt;Cart</Link>
      </div>
      <div className="contact-shipping">
        <h1>Shipping</h1>
        <div className="contact">
          <h2>Contact information</h2>
          {token ? <h3>Edit email in account details page</h3> : <></>}
          <label htmlFor="email">Email</label>
          <input value={inputFields.email} className="input" type="email" name="email" disabled={token ? true : false} onChange={e => handleChange(e)}/>
        </div>
        <div className="shipping">
          <h2>Shipping address</h2>
          <label htmlFor="first">First name</label>
          <input value={inputFields.first} className="input" onChange={e => handleChange(e)} type="text" name="first"/>
          <label htmlFor="last">Last name</label>
          <input value={inputFields.last} className="input" onChange={e => handleChange(e)} type="text" name="last"/>
          <label htmlFor="address">Billing address</label>
          <input value={inputFields.shippingAddress} className="input" onChange={e => handleChange(e)} type="text" name="shippingAddress"/>
          <label htmlFor="city">City</label>
          <input value={inputFields.shippingCity} className="input" onChange={e => handleChange(e)} type="text" name="shippingCity"/>
          <label htmlFor="state">State</label>
          <input value={inputFields.shippingState} className="input" onChange={e => handleChange(e)} type="text" name="shippingState"/>
          <label htmlFor="zip">Postal code</label>
          <input value={inputFields.shippingZip} className="input" onChange={e => handleChange(e)} type="text" name="shippingZip"/>
        </div>
      </div>
      <button className="checkout-btn" onClick={e => handleSubmit(e)}>Continue</button>
    </div>
  )
}

export default Shipping;
