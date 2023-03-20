import React, { useState, useEffect } from 'react';
import { getProduct, addToCartDB, addToCartLocal } from '../../utility/helpers';

export default function Product({ search, token }) {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetching product data')
      const newProduct = await 
      getProduct(search.query);
      setProduct(newProduct);
    };
    
    fetchData();
  }, [search.query])

  const handleAdd = async () => {
    const item = {
      name: search.query,
      amount: 1
    }
    if(token){
      await addToCartDB(search.query, token, 1);
    }
    addToCartLocal(item);
  }

  return (
    <div className="product-container" key={product}>
      <p>{product.name} -- {product.price}</p>
      <img src={`../img/${product.name.replace(/\s+/g, '')}.jpg`} alt={`Container of ${product.name}`}/>
      <button onClick={handleAdd} type="submit">Add to cart</button>
    </div>
  )
}