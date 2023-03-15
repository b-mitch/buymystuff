import React, { useState, useEffect } from 'react';
import { getProductsOfCategory } from '../../../utility/helpers';

export default function Body() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const newProducts = await getProductsOfCategory('body');
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
    <div className="body-container">
      <h1>Body Products</h1>
      {productsList}
    </div>
  )

}