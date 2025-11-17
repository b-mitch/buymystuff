import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { getUser } from "../../../utility/helpers";


const Account: React.FC<any> = ({ token }) => {

  const [first, setFirst] = useState('');
  const [id, setID] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser(token);
      const newFirst = user.first_name;
      setFirst(newFirst);
      const newID = user.id;
      setID(newID);
    };
    
    fetchData();
  }, [token])

  return (
    <div className="account container">
      <div className="account-header">
        <h1>Hi, {first}</h1>
      </div>
      <div className="account-links">
          <Link to='/account/orders'>Order history</Link>
          <Link to='/account/details'>Account details</Link>
          <Link to='/account/password'>Change password</Link>
      </div>
    </div>
  )
}
export default Account;
