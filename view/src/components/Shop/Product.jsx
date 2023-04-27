import React, { useState, useEffect } from 'react';
import {Link, useParams, useNavigate } from 'react-router-dom';
import { getProduct, addToCartDB, addToCartLocal } from '../../utility/helpers';

export default function Product({ setSearch, search, token }) {
  const [product, setProduct] = useState();

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const {name} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(search)
    console.log(name)
    const fetchData = async () => {
      let newProductArray = []
      const response = await 
      getProduct(name);
      if(response.error){
        navigate("/productnotfound")
      }
      newProductArray.push(response);
      setProduct(newProductArray);
    };
    
    fetchData();
  }, [search])

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

  


  if(!product) return;

  return (
    <div className="container" key={product}>
      {errorMessage()}
      {successMessage()}
      <div className='page-history'><Link to='/'>/ home </Link><Link to={`/c/${product[0].category}`}>/ {product[0].category}</Link>
      </div>
      <div className="product-page">
        <h2>{product[0].name}</h2>
        <img src={`../img/${product[0].name.replace(/\s+/g, '')}.jpg`} alt={`Container of ${product[0].name}`}/>
        <h3>{product[0].price}</h3>
        <button value={product[0].name} onClick={handleAdd} type="submit">Add to cart</button>
      </div>
    </div>
  )
}