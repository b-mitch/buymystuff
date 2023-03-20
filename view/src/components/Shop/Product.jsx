import React, { useState, useEffect } from 'react';
import { getProduct, addToCartDB, addToCartLocal } from '../../utility/helpers';

export default function Product({ search, token }) {
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

  if(product.length===0) return;

  return (
    <div className="product-container" key={product}>
      <p>{product[0].name} -- {product[0].price}</p>
      <img src={`../img/${product[0].name.replace(/\s+/g, '')}.jpg`} alt={`Container of ${product[0].name}`}/>
      <button onClick={handleAdd} type="submit">Add to cart</button>
    </div>
  )
}