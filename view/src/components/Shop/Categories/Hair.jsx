import React, { useState, useEffect } from 'react';
import { getProductsOfCategory } from '../../../utility/helpers';

export default function Hair() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const newProducts = await getProductsOfCategory('hair');
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
    <div className="hair-container">
      <h1>Hair Products</h1>
      {productsList}
    </div>
  )

}