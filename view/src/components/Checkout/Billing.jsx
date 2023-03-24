import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { setCheckoutSession } from '../../utility/helpers';

const { seshFirst, seshLast, seshEmail, seshBillingAddress, seshBillingCity, seshBillingState, seshBillingZip } = JSON.parse(sessionStorage.getItem('checkout'));

export default function Billing({token}) {

  const navigate = useNavigate();

  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');


  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    const onLoad = () => {
      setFirst(seshFirst);
      setLast(seshLast);
      setEmail(seshEmail);
      setBillingAddress(seshBillingAddress);
      setBillingCity(seshBillingCity);
      setBillingState(seshBillingState);
      setBillingZip(seshBillingZip);
    };
    
    onLoad();
  })

  const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+\.[a-zA-Z_.+-]+$/, "gm");

  const handleFirst = (e) => {
    setFirst(e.target.value)
    setCheckoutSession({seshFirst: e.target.value});
  };

  const handleLast = (e) => {
    setLast(e.target.value)
    setCheckoutSession({seshLast: e.target.value});
  };

  const handleEmail = (e) => {
    setEmail(e.target.value)
    setCheckoutSession({seshEmail: e.target.value});
  };

  const handleBillingAddress = (e) => {
    setBillingAddress(e.target.value)
    setCheckoutSession({seshBillingAddress: e.target.value});
  };

  const handleBillingCity = (e) => {
    setBillingCity(e.target.value)
    setCheckoutSession({seshBillingCity: e.target.value});
  };

  const handleBillingState = (e) => {
    setBillingState(e.target.value)
    setCheckoutSession({seshBillingState: e.target.value});
  };

  const handleBillingZip = (e) => {
    setBillingZip(e.target.value)
    setCheckoutSession({seshBillingZip: e.target.value});
  };
  

  const handleBillingContinue = (e) => {
    e.preventDefault();
    setError(false);
    setEmailError(false);
    if (first === '' || last === '' || email === '' || billingAddress === '' || billingCity === '' || billingState === '' || billingZip === '') {
      setError(true);
      return;
    }
    if (!emailRegex.test(email)){
      setEmailError(true);
      return;
    }
    setError(false);
    setEmailError(false);
    navigate('../shipping')
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

  const emailErrorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: emailError ? '' : 'none',
        }}>
        <h1>Please enter valid email</h1>
      </div>
    );
  };

  if(!JSON.parse(sessionStorage.getItem('checkout'))) return

  return (
    <div className='checkout'>
      <nav className='page-history'><Link to='../cart'>&lt; Cart</Link></nav>
      <div className="messages">
        {emailErrorMessage()}
        {errorMessage()}
      </div>
      <h1>Contact and Billing</h1>
        <form>
          <label for="email">
            Email*
            <input defaultValue={seshEmail} className="input" onChange={handleEmail} type="email" name="email" disabled={token ? true : false}/>
          </label>
          <label for="first">
            First name* 
            <input defaultValue={seshFirst} className="input" onChange={handleFirst} type="text" name="first"/>
          </label>
          <label for="last">
            Last name*
            <input defaultValue={seshLast} className="input" onChange={handleLast} type="text" name="last"/>
          </label>
          <label for="address">
            Billing address*
            <input defaultValue={seshBillingAddress} className="input" onChange={handleBillingAddress} type="text" name="address"/>
          </label>
          <label for="city">
            City*
            <input defaultValue={seshBillingCity} className="input" onChange={handleBillingCity} type="text" name="city"/>
          </label>
          <label for="state">
            State*
            <input defaultValue={billingState} className="input" onChange={handleBillingState} type="text" name="state"/>
          </label>
          <label for="zip">
            Postal code*
            <input defaultValue={seshBillingZip} className="input" onChange={handleBillingZip} type="text" name="zip"/>
          </label>
        </form>
      <button className="checkout-btn" onClick={handleBillingContinue}>Continue</button>
    </div>
  )
}