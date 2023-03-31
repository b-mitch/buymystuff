import React, { useState, useEffect } from 'react';
import { getProduct, addToCartDB, addToCartLocal } from '../../utility/helpers';

export default function Product({ setSearch, search, token }) {
  const [product, setProduct] = useState([]);

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let newProductArray = []
      const newProduct = await 
      getProduct(search.query);
      newProductArray.push(newProduct);
      setProduct(newProductArray);
    };
    
    fetchData();
  }, [])

  function resetSuccess() {
    let el = document.getElementById('success');
    el.style.animation = '';
    el.style.display = '';
    setTimeout(() => {
      el.style.display='none';
      el.style.animation='none';
    }, "3000")
  }

  const handleAdd = async (e) => {
    setError(false);
    let localCart = JSON.parse(localStorage.getItem('cart'));
    setSearch({
      search: {
        query: e.target.getAttribute('value')
      }
    })
    if(token){
      const response = await addToCartDB(search.query, token, 1);
      console.log(response)
      if(!response) {
        setSuccess(false)
        setError(true)
      }
      setSuccess(true);
      resetSuccess();
      return;
    }
    let filteredCart;
    if (!localCart){
      addToCartLocal({name: search.query, amount: 1});
      localCart = JSON.parse(localStorage.getItem('cart'));
      setSuccess(true);
      resetSuccess();
      return;
    }
    if (localCart) {
      filteredCart = localCart.filter(item => item.name===search.query)
      if (!filteredCart[0]){
        addToCartLocal({name: search.query, amount: 1});
        localCart = JSON.parse(localStorage.getItem('cart'));
      } else {
          const newCart = localCart.map(item => {
          if(item.name === search.query){
            return {...item, amount: item.amount + 1};
          } else {
              return item;
            }
        })
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
      setSuccess(true);
      resetSuccess();
    }
  }

  const successMessage = () => {
    return (
      <div
        id="success"
        style={{
          display: success ? '' : 'none',
        }}>
        <h3>Item added to cart!</h3>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div
        id="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h3>{error ? 'Error adding to cart. Please try again or contact us if error persists' : ''}</h3>
      </div>
    );
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if(product.length===0) return;

  return (
    <div className="container" key={product}>
      <div className="product-page">
        <h2>{capitalizeFirstLetter(product[0].name)}</h2>
        <img src={`../img/${product[0].name.replace(/\s+/g, '')}.jpg`} alt={`Container of ${product[0].name}`}/>
        <h3>{product[0].price}</h3>
        <button value={product[0].name} onClick={handleAdd} type="submit">Add to cart</button>
          {errorMessage()}
          {successMessage()}
      </div>
    </div>
  )
}