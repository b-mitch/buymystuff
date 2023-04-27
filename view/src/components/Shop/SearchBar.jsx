import React from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../utility/helpers';

const SearchBar = ({ search, setSearch }) => {

  const handleChange = async (e) => {
    const query = e.target.value;
    const products = await getAllProducts();
    const results = products.filter(product => {
      if (!query) return
      return product.name.toLowerCase().includes(e.target.value.toLowerCase()) || product.category.toLowerCase().includes(e.target.value.toLowerCase())  
    })
    setSearch({search: {
      ...search,
      query: query,
      list: results
    }})
  }

  const handleClick = (e) => {
    setSearch({
      search: {
        query: e.target.getAttribute('value')
      }
    })
  }

  const Results = () => {
    if (!search || !search.list) return;
    if (!search.list.length) return;
    return (
      <div className='search-auto'>
        <ul>
          {search.list.map(product => {
            return <li key={product.name.replace(/\s+/g, '')}><Link value={product.name} onClick={handleClick} to={`/product/${product.name.replace(/\s+/g, '')}`}>{product.name}</Link></li>
          })}
        </ul>
      </div>
    )
   
  }

  return(
    <div className="search-bar">
      <form>
        <input
          value={search.query}
          onChange={handleChange}
          type="search"
          id="header-search"
          placeholder="Search for stuff"
          name="search" 
        />
      </form>
      <Results />
    </div>
  )
};

export default SearchBar;