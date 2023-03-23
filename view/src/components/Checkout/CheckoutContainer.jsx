import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import Billing from './Billing';
import Shipping from './Shipping';
import Review from './Review';
import { getCart, getCartTotal, localCartTotal, getUser } from '../../utility/helpers';

export default function Checkout({ token }) {

  const [cart, setCart] = useState();
  const [total, setTotal] = useState(null);

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
    <Routes>
      <Route 
        path="contact-billing" 
        element={<Billing token={token}/>} 
      />
      <Route path="shipping" element={
        <Shipping />
        } 
      />
      <Route path="review" element={
        <Review cart={cart} total={total} cartItems={<CartItems/>} cartTotal={<CartTotal/>}token={token}/>
        } 
      />
    </Routes>
    </div>
    
  )
}