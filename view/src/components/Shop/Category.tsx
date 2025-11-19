import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductsOfCategory } from '../../utility/helpers';

const Hair: React.FC<any> = ({ setSearch }) => {
  const {category} = useParams<{ category: string }>();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (category) {
        const newProducts = await getProductsOfCategory(category);
        setProducts(newProducts);
      }
    };
    
    fetchData();
  }, [category]);

  const handleClick = (product: string): void => {
    setSearch({
      search: {
        query: product
      }
    });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const productsList = products.map((product) => {
    return (
      <div className="product" key={product.name}>
        <Link onClick={() => handleClick(product.name)} to={`../product/${product.name}`}>
        <div className="category-grid">
          <img src={`../img/${product.name.replace(/\s+/g, '')}.jpg`} alt={`Container of ${product.name}`}/>
          <p>{product.name}</p>
        </div>
        </Link>
      </div>
    );
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
  );

};

export default Hair;
