import React, { useState, useEffect } from "react";
import { getUser } from "../utility/helpers";
import { Link } from 'react-router-dom';
import SearchBar from '../components/Shop/SearchBar';

export default function Home({ token, search, setSearch }) {
  const [first, setFirst] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser(token);
      const newFirst = user.first_name;
      setFirst(newFirst);
    };
    
    fetchData();
  }, [token])

  return (
    <div className="home-container">
      <h1>Hey{token ? ` ${first}!` : "!"} Welcome to Buy My Shit!</h1>
        <SearchBar setSearch={setSearch} search={search}/>
      <h2>Shop by category</h2>
      <div className='categories-links'>
        <Link to="/c/hair">Hair</Link>
        <Link to="/c/face">Face</Link>
        <Link to="/c/body">Body</Link>
      </div>
    </div>
  )
}