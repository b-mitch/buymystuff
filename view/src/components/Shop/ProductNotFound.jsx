import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../utility/helpers';

export default function ProductNotFound({setSearch}) {

  const [allProducts, setAllProducts] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllProducts();
      setAllProducts(response);
    }

    fetchData();
  }, [])

  const handleClick = (product) => {
    setSearch({
      search: {
        query: product
      }
    })
  }

  if(!allProducts) return;

  const productsList = allProducts.map((product) => {
    return (
      <div className="product" key={product.name}>
        <Link value={product.name} onClick={() => handleClick(product.name)} to={`../product/${product.name}`}>
          <img src={`../img/${product.name.replace(/\s+/g, '')}.jpg`} alt={`Container of ${product.name}`}/>
          <p>{product.name}</p>
        </Link>
      </div>
    )
  })

  return(
    <div className="container">
      <h1>Product Not Found</h1>
      <h2>All Products</h2>
      {productsList}
  </div>
  )
}