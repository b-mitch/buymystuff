import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductsOfCategory } from '../../../utility/helpers';

export default function Hair({ setSearch }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const newProducts = await getProductsOfCategory('face');
      setProducts(newProducts);
    };
    
    fetchData();
  }, [])

  const handleClick = (e) => {
    setSearch({
      search: {
        query: e.target.getAttribute('value')
      }
    })
  }

  const productsList = products.map((product) => {
    return (
      <div className="product-container" key={product}>
        <p><Link value={product.name} onClick={handleClick} to={`../product/${product.name.replace(/\s+/g, '')}`}>{product.name}</Link> -- {product.price}</p>
        <img src={`../img/${product.name.replace(/\s+/g, '')}.jpg`} alt={`Container of ${product.name}`}/>
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