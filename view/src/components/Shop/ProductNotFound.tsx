import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../utility/helpers';

const ProductNotFound: React.FC<any> = ({setSearch}) => {

  const [allProducts, setAllProducts] = useState<any[]>([]);

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

  if (!allProducts || allProducts.length === 0) return null;

  const productsList = allProducts.map((product: any) => {
    return (
      <div className="product" key={product.name}>
        <Link onClick={() => handleClick(product.name)} to={`../product/${product.name}`}>
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

export default ProductNotFound;
