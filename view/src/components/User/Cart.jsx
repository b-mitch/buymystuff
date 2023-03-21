import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { getCart, updateCart, getCartTotal, localCartTotal, deleteFromCartDB } from '../../utility/helpers';

export default function Cart({ token }) {
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

  const handleDelete = async (e, i) => {
    e.preventDefault();

    const thisClicked = e.currentTarget;
    thisClicked.innerText = "Removing";

    if(token) {
      const id = cart[i].id;
      const status = await deleteFromCartDB(id);
      console.log(status);
      if (status === 200){
        thisClicked.closest("tr").remove();
        const newCart = cart.filter((item, index) => index !== i);
        setCart(newCart);
      } else {
        alert("Unable to delete!")
      }
    }
    if(!token) {
      const newCart = cart.filter((item, index) => index !== i);
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
      thisClicked.closest("tr").remove();
    }
  };

  const handleDecrement = async (i) => {
    const newCart = cart.map((item, index) => {
      if (index === i) {
        return {...item, amount: item.amount - (item.amount > 1 ? 1:0)};
      } else {
        return item;
      }
    })
    setCart(newCart);
    if(token) {
      const id = newCart[i].id;
      const amount = newCart[i].amount
      await updateCart(id, amount);
      let cartTotal = await getCartTotal(token);
      cartTotal = Number(cartTotal).toFixed(2)
      setTotal(cartTotal);
    }
    if(!token) {
      localStorage.setItem('cart', JSON.stringify(newCart))
      let cartTotal = await localCartTotal();
      cartTotal = Number(cartTotal).toFixed(2);
      setTotal(cartTotal);
    }
  };

  const handleIncrement = async (i) => {
    const newCart = cart.map((item, index) => {
      if (index === i) {
        return {...item, amount: item.amount + (item.amount < 10 ? 1:0)};
      }else {
        return item;
      }
    })
    setCart(newCart);
    if(token) {
      const id = newCart[i].id;
      const amount = newCart[i].amount
      await updateCart(id, amount);
      let cartTotal = await getCartTotal(token);
      cartTotal = Number(cartTotal).toFixed(2);
      setTotal(cartTotal);
    }
    if(!token) {
    localStorage.setItem('cart', JSON.stringify(newCart));
      let cartTotal = await localCartTotal();
      cartTotal = Number(cartTotal).toFixed(2)
      setTotal(cartTotal);
    }
  }

  const CartItems = () => {
    if(!cart) return;
    return (
      <table className = 'items-container'>
        {cart.map((item, i) => {
          return <tr className='item-card'>
            <td>
              {item.name}
            </td>
            <td>
              <img src={`../img/${item.name.replace(/\s+/g, '')}.jpg`} alt={`Container of ${item.name}`}/>
            </td>
            <td>
              <button onClick={() =>{handleDecrement(i)}} className='amount-btn'>-</button>
              <input value={item.amount} className='amount-input' type='number' />
              <button onClick={() => {handleIncrement(i)}} className='amount-btn'>+</button>
            </td>
            <td>
              <button onClick={(e) => {handleDelete(e, i)}}>Remove</button>
            </td>
          </tr>
          }
        )}
      </table>
    )
  }

  const CartTotal = () => {
    if (!cart) return;
    return <h3>Total: ${total}</h3>
  }

  return (
    <div>
      <h1>Cart</h1>
      <CartItems />
      <CartTotal />
      <Link to='/checkout'>Checkout</Link>
    </div>
  )
}