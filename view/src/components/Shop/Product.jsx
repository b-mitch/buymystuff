import React, { useState, useEffect } from 'react';
import { getProduct } from '../../utility/helpers';

export default function Product({ search }) {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetching product data')
      const newProduct = await 
      getProduct(search.query);
      setProduct(newProduct);
    };
    
    fetchData();
  }, [])

  return (
    <div className="product-container" key={product}>
      <p>{product.name} -- {product.price}</p>
      <img src={`../img/${product.name}.jpg`} alt={`Container of ${product.name}`}/>
    </div>
  )
}