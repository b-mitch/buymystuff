import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import { getOrderDetails } from "../../../utility/helpers";

export default function OrderDetails({ token }) {
  const {id} = useParams();
  
  const [orderDetails, setOrderDetails] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const results = await getOrderDetails(token, id);
      setOrderDetails(results);
    };
    
    fetchData();
  }, [token, id])

  const dateFormator = (date) => {
    let newDate = date.slice(0, 10)
    const y = newDate.slice(0, 4)
    const x = newDate.slice(5).replace('-', '/')
    newDate = x + ' ' + y
    return newDate;
  }

  const OrderDetailItems = () => {
    if(!orderDetails) return;
    return (
      <div className="order-details-container">
        <table className='order-details-table'>
        <tbody>
          {orderDetails.map((item) => {
            return <tr key={item.id}className='item-card'>
              <td>
                Order #: {item.id}
              </td>
              <td>
                Date: {dateFormator(item.date)} 
              </td>
              <td>
                Name: {item.name}
              </td>
              <td>
                Price: {item.price}
              </td>
              <td>
                Amount: {item.amount}
              </td>
            </tr>
            }
          )}
        </tbody>
      </table>
      <Link to='/returns'>Request return</Link>
      </div>
    )
  }

  return(
    <div className="order-details-container">
      <h1>Order Details</h1>
      <Link to='../account/orders'>All orders</Link>
      <OrderDetailItems />
    </div>
  )
}