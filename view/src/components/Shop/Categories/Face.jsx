import React, { useState, useEffect } from 'react';
import { getProductsOfCategory } from '../../../utility/helpers';

export default function Hair() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const newProducts = await getProductsOfCategory('face');
      setProducts(newProducts);
    };
    
    fetchData();
  }, [])

  const productsList = products.map((product) => {
    return (
      <div className="product-container" key={product}>
        <p>{product.name} -- {product.price}</p>
        <img src={`../img/${product.name}.jpg`} alt={`Container of ${product.name}`}/>
      </div>
    )
  })

  return (
    <div className="face-container">
      <h1>Face Products</h1>
      {productsList}
    </div>
  )

}