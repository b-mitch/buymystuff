import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllProducts } from '../../utility/helpers';

const SearchBar = ({ search, setSearch }) => {
  const navigate = useNavigate();

  const handleChange = async (e) => {
    e.preventDefault();
    const products = await getAllProducts();
    const results = products.filter(product => {
      if (e.target.value === "")      return
      return product.name.toLowerCase().includes(e.target.value.toLowerCase()) || product.category.toLowerCase().includes(e.target.value.toLowerCase())  
    })
    setSearch({
      search: {
        query: e.target.value,
        list: results
      }
    })
  }

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`product/${search.query}`)
  }

  const handleClick = (e) => {
    setSearch({
      search: {
        query: e.target.getAttribute('value')
      }
    })
  }

  return(
    <div className="search-bar">
      <form>
        <input
          onChange={handleChange}
          type="search"
          id="header-search"
          placeholder="Search for shit"
          name="search" 
        />
        <button onClick={handleSearch} type="submit">Search</button>
    </form>
    <ul>
      {(!search.list ? "" : search.list.map(product => {
        return <li key={product.name.replace(/\s+/g, '')}><Link value={product.name} onClick={handleClick} to={`/product/${product.name.replace(/\s+/g, '')}`}>{product.name}</Link></li>
      }))}
    </ul>
    </div>
  )
};

export default SearchBar;