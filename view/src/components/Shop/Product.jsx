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
        setError(true)
      }
      return setSuccess(true);
    }
    let filteredCart;
    if (!localCart){
      addToCartLocal({name: search.query, amount: 1});
      localCart = JSON.parse(localStorage.getItem('cart'));
      return setSuccess(true);
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
        }else {
          return item;
        }
      })
      localStorage.setItem('cart', JSON.stringify(newCart));
      setSuccess(true)
      }
    }
  }

  const successMessage = () => {
    return (
      <div
        className="success"
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
        className="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h3>{error ? 'Error adding to cart. Please try again or contact us if error persists' : ''}</h3>
      </div>
    );
  };

  if(product.length===0) return;

  return (
    <div className="product-container" key={product}>
      <p>{product[0].name} -- {product[0].price}</p>
      <img src={`../img/${product[0].name.replace(/\s+/g, '')}.jpg`} alt={`Container of ${product[0].name}`}/>
      <button value={product[0].name} onClick={handleAdd} type="submit">Add to cart</button>
      {errorMessage()}
      {successMessage()}
    </div>
  )
}