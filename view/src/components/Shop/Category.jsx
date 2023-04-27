import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductsOfCategory } from '../../utility/helpers';

export default function Hair({ setSearch }) {
  const {category} = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const newProducts = await getProductsOfCategory(category);
      setProducts(newProducts);
    };
    
    fetchData();
  }, [])

  const handleClick = (product) => {
    setSearch({
      search: {
        query: product
      }
    })
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const productsList = products.map((product) => {
    return (
      <div className="product" key={product.name}>
        <Link value={product.name} onClick={() => handleClick(product.name)} to={`../product/${product.name}`}>
        <div className="category-grid">
          <img src={`../img/${product.name.replace(/\s+/g, '')}.jpg`} alt={`Container of ${product.name}`}/>
          <p>{product.name}</p>
        </div>
        </Link>
      </div>
    )
  })

  return (
    <div className="container">
      <div className='page-history'><Link to='/'>/ home</Link>
      </div>
      <h1>{capitalizeFirstLetter(category)} Products</h1>
      <div className="products-container">
        {productsList}
      </div>
    </div>
  )

}