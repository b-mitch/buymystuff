import React, { useState, useEffect } from "react";
import { getUser } from "../../utility/helpers";

export default function Home({ token }) {
  const [first, setFirst] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser(token);
      const newFirst = user.first_name;
      setFirst(newFirst);
    };
    
    fetchData();
  }, [])

  return (
    <div className="home-container">
      <h1>Hey{first ? ` ${first}!` : "!"} Welcome to Buy My Shit!</h1>
      <p>All Products</p>
    </div>
  )
}