import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Shipping from './Shipping';
import Review from './Review';
import { getCart, getCartTotal, localCartTotal, createOrder, updateProducts, deleteCart, setCheckoutSession } from '../../utility/helpers';

export default function Checkout({ token }) {

  const { first, last, email, billingAddress, billingCity, billingState, billingZip, shippingAddress, shippingCity, shippingState, shippingZip } = JSON.parse(sessionStorage.getItem('checkout'));

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

  const [success, setSuccess] = useState(false);

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
    }
  }

  const onSame = () => {
    setCheckoutSession({
      billingAddress: inputFields.shippingAddress,
      billingCity: inputFields.shippingCity,
      billingState: inputFields.shippingState,
      billingZip: inputFields.shippingZip
      })
    return setSuccess(false);
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
      setCheckoutSession({
      billingAddress: inputFields.shippingAddress,
      billingCity: inputFields.shippingCity,
      billingState: inputFields.shippingState,
      billingZip: inputFields.shippingZip
      })
      navigate('review')
    }
    if(page==='http://localhost:3000/checkout/review'){
      setCheckoutSession({
        billingAddress: inputFields.billingAddress,
        billingCity: inputFields.billingCity,
        billingState: inputFields.billingState,
        billingZip: inputFields.billingZip
      })
      setSuccess(true);
    }
  };

  const placeOrder = async() => {
    let credentials;
    if(token){
      credentials = {
        first: first,
        last: last,
        email: email,
        address: shippingAddress,
        city: shippingCity,
        state: shippingState,
        zip: shippingZip
      }
    } else {
      credentials = {
        first: first,
        last: last,
        email: email,
        address: shippingAddress,
        city: shippingCity,
        state: shippingState,
        zip: shippingZip,
        idArray: JSON.parse(localStorage.getItem('cart-ids'))
      }
    }
    const confNumber = await createOrder(credentials, token ? token : 1)
    sessionStorage.setItem('confirmation', JSON.stringify(confNumber))
  }

  const updateInventory = async() => {
    let credentials;
    if(token){
      credentials = {booty: 'booty'};
    } else {
      credentials = {
        idArray: JSON.parse(localStorage.getItem('cart-ids'))
      }
    }
    await updateProducts(credentials, token ? token : 1);
  }

  const handleDelete = async() => {
    await deleteCart({
        idArray: JSON.parse(localStorage.getItem('cart-ids'))
      }, token ? token : 1);
    localStorage.removeItem("cart");
    localStorage.removeItem("cart-ids");
    sessionStorage.removeItem("checkout");
  }

  const errorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h3>Please enter all the fields</h3>
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
        <h3>Please enter a valid email</h3>
      </div>
    );
  };

  const CartItems = () => {
    if(!cart) return;
    return (
      <table>
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
    return <h4 className="total">Total: ${total}</h4>
  }

  return (
    <div className="container">
      <h1>Checkout</h1>
      <div className="messages">
        {emailErrorMessage()}
        {errorMessage()}
      </div>
      <Routes>
        <Route 
          path="shipping" 
          element={
          <Shipping 
            token={token} 
            inputFields={inputFields} 
            handleChange={handleFormChange} 
            handleSubmit={handleFormSubmit} />
          } 
        />
        <Route path="review" element={
          <Review 
            inputFields={inputFields}
            success={success} 
            handleChange={handleFormChange} 
            handleSubmit={handleFormSubmit} 
            radio={radio} 
            handleRadioChange={handleRadioChange} 
            onSame={onSame}
            cartItems={<CartItems/>} 
            cartTotal={<CartTotal/>} 
            token={token} 
            placeOrder={placeOrder}
            updateInventory={updateInventory}
            handleDelete={handleDelete} />
          } 
        />
      </Routes>
    </div>
    
  )
}