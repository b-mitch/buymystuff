import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import { getOrderDetails } from "../../../utility/helpers";

const OrderDetails: React.FC<any> = ({ token }) => {
  const {id} = useParams<{ id: string }>();
  
  const [orderDetails, setOrderDetails] = useState<any[]>();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const results = await getOrderDetails(token, id);
        setOrderDetails(results);
      }
    };
    
    fetchData();
  }, [token, id]);

  const dateFormator = (date: string): string => {
    let newDate = date.slice(0, 10)
    const y = newDate.slice(0, 4)
    const x = newDate.slice(5).replace('-', '/')
    newDate = x + ' ' + y
    return newDate;
  }

  const OrderDetailItems = () => {
    if (!orderDetails) return null;
    return (
      <div className="order-details-container">
        <table className='order-details-table'>
          <thead>
            <th>Order #</th>
            <th>Date</th>
            <th>Product</th>
            <th>Price</th>
            <th>Amount</th>
          </thead>
        <tbody>
          {orderDetails.map((item) => {
            return <tr key={item.id}className='item-card'>
              <td>
                {item.id}
              </td>
              <td>
                {dateFormator(item.date)} 
              </td>
              <td>
                {item.name}
              </td>
              <td>
                {item.price}
              </td>
              <td>
                {item.amount}
              </td>
            </tr>
            }
          )}
        </tbody>
      </table>
      </div>
    )
  }

  return(
    <div className="order-details container">
      <h1>Order Details</h1>
      <div className="align-left">
        <Link to='../account/orders'>&lt;All orders</Link>
      </div>
      <OrderDetailItems />
      <div className="nav-link">
        <Link to='/returns'>Request return</Link>
      </div>
    </div>
  )
}
export default OrderDetails;
