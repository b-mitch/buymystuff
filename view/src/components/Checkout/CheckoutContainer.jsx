import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Shipping from './Shipping';
import Review from './Review';
import { getCart, getCartTotal, localCartTotal, setCheckoutSession } from '../../utility/helpers';

const checkoutSession = JSON.parse(sessionStorage.getItem('checkout'))

const { first, last, email, billingAddress, billingCity, billingState, billingZip, shippingAddress, shippingCity, shippingState, shippingZip } = JSON.parse(sessionStorage.getItem('checkout'));

export default function Checkout({ token }) {

  const navigate = useNavigate();
  const page = window.location.href;

  const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+\.[a-zA-Z_.+-]+$/, "gm");

  const [cart, setCart] = useState();
  const [total, setTotal] = useState(null);
  const [inputFields, setInputFields] = useState({
    first: first,
    last: last,
    email: email,
    shippingAddress: shippingAddress,
    shippingCity: shippingCity,
    shippingState: shippingState,
    shippingZip: shippingZip,
    billingAddress: billingAddress,
    billingCity: billingCity,
    billingState: billingState,
    billingZip: billingZip
  });
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [radio, setRadio] = useState('same');

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem('cart'));
    const fetchCart = async () => {
      const cart = await getCart(token);
      setCart(cart);
    };
    const fetchTotal = async () => {
      let cartTotal;
      if(token) {
        cartTotal = await getCartTotal(token)
      } 
      if(!token) {
        cartTotal = await localCartTotal()
      };
      cartTotal = Number(cartTotal).toFixed(2)
      setTotal(cartTotal);
    }
    if(!token) {
      setCart(localCart) 
      fetchTotal()
      return
      };
    fetchCart();
    fetchTotal();
  }, [token])

  const handleFormChange = (e) => {
    setInputFields({
      ...inputFields,
      [e.target.name]: e.target.value
    })
  };

  const handleRadioChange = (e) => {
    const value = e.target.value
    setRadio(value)
    if(value==='same') {
      setInputFields({
      ...inputFields,
      billingAddress: inputFields.shippingAddress,
      billingCity: inputFields.shippingCity,
      billingState: inputFields.shippingState,
      billingZip: inputFields.shippingZip
    })
      document.getElementById('billing-form').style.display="none";
      return;
    }
    if(value==='different'){
      setInputFields({
        ...inputFields,
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingZip: ''
      })
      document.getElementById('billing-form').style.display="inline-block";
      return;
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError(false);
    setEmailError(false);
    if (inputFields.first === '' || inputFields.last === '' || inputFields.email === '' || inputFields.shippingAddress === '' || inputFields.shippingCity === '' || inputFields.shippingState === '' || inputFields.shippingZip === '') {
      setError(true);
      return;
    }
    if (!emailRegex.test(inputFields.email)){
      setEmailError(true);
      return;
    }
    setError(false);
    setEmailError(false);
    sessionStorage.setItem('checkout', JSON.stringify(inputFields))
    if(page==='http://localhost:3000/checkout/shipping'){
      navigate('review')
    }
  };

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

  const CartItems = () => {
    if(!cart) return;
    return (
      <table className = 'items-container'>
        <tbody>
          {cart.map((item, i) => {
            return <tr key={item.name.replace(/\s+/g, '')}className='item-card'>
              <td>
                {item.name}
              </td>
              <td>
                <img src={`../img/${item.name.replace(/\s+/g, '')}.jpg`} alt={`Container of ${item.name}`}/>
              </td>
              <td>
                <Link to='../../cart'>Edit in cart</Link>
              </td>
            </tr>
            }
          )}
        </tbody>
      </table>
    )
  }

  const CartTotal = () => {
    if (!cart) return;
    if (cart.length===0) return;
    return <h3>Total: ${total}</h3>
  }

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <div className="messages">
        {emailErrorMessage()}
        {errorMessage()}
      </div>
      <Routes>
        <Route 
          path="shipping" 
          element={<Shipping token={token} inputFields={inputFields} handleChange={handleFormChange} handleSubmit={handleFormSubmit}/>} 
        />
        <Route path="review" element={
          <Review inputFields={inputFields} handleChange={handleFormChange} handleSubmit={handleFormSubmit} radio={radio} handleRadioChange={handleRadioChange} cartItems={<CartItems/>} cartTotal={<CartTotal/>} token={token}/>
          } 
        />
      </Routes>
    </div>
    
  )
}