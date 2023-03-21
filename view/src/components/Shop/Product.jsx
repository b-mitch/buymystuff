import React, { useState, useEffect } from 'react';
import { getProduct, addToCartDB, addToCartLocal } from '../../utility/helpers';

export default function Product({ setSearch, search, token }) {
  const [product, setProduct] = useState([]);

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
    setSearch({
      search: {
        query: e.target.getAttribute('value')
      }
    })
    if(token){
      await addToCartDB(search.query, token, 1);
    }
    const localCart = JSON.parse(localStorage.getItem('cart'));
    if(!token && localCart){
      const filteredCart = localCart.filter(item => item.name===search.query)
      if(filteredCart[0]){
        const newCart = localCart.map(item => {
          if(item.name === search.query){
            return {...item, amount: item.amount + 1};
          }else {
            return item;
          }
        })
        return localStorage.setItem('cart', JSON.stringify(newCart));
      }
    }
    const item = {
    name: search.query,
    amount: 1
    }
    addToCartLocal(item);
  }

  if(product.length===0) return;

  return (
    <div className="product-container" key={product}>
      <p>{product[0].name} -- {product[0].price}</p>
      <img src={`../img/${product[0].name.replace(/\s+/g, '')}.jpg`} alt={`Container of ${product[0].name}`}/>
      <button value={product[0].name} onClick={handleAdd} type="submit">Add to cart</button>
    </div>
  )
}