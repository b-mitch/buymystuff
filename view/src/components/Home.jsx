import React, { useState, useEffect } from "react";
import { getUser } from "../utility/helpers";
import { Link } from 'react-router-dom';
import SearchBar from '../components/Shop/SearchBar';

export default function Home({ token, search, setSearch }) {
  const [first, setFirst] = useState(null)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearch({
      search: {
        query: '',
        list: []
      }
    })
    const fetchData = async () => {
      setIsLoading(true);
      const user = await getUser(token);
      const newFirst = user.first_name;
      setFirst(newFirst);
      setIsLoading(false)
    };
    
    fetchData();
  }, [token])

  return (
    <div className="container">
        <SearchBar setSearch={setSearch} search={search}/>
      <h1>Welcome{token && !isLoading ? `, ${first}` : ""}! Let's buy some stuff!</h1>
      <h2>Categories of stuff we sell</h2>
      <div className='categories-container'>
        <Link to="/c/hair">
          <div className='category'>
            <img src='../img/hair.jpg' alt='some dreads'/>
            <p>Hair</p>
          </div>
        </Link>
        <Link to="/c/face">
          <div className='category'>
            <img src='../img/face.jpg' alt='pug face'/>
          <p>Face</p>
          </div>
        </Link>
        <Link to="/c/body">
          <div className='category'>
            <img src='../img/body.jpg' alt='manikin body'/>
            <p>Body</p>
          </div>
        </Link>
      </div>
    </div>
  )
}