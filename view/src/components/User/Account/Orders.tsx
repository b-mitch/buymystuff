import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { getOrders } from "../../../utility/helpers";

const Orders: React.FC<any> = ({ token }) => {

  const [orders, setOrders] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const results = await getOrders(token);
      setOrders(results);
    };
    
    fetchData();
  }, [token])

  const dateFormator = (date) => {
    let newDate = date.slice(0, 10)
    const y = newDate.slice(0, 4)
    const x = newDate.slice(5).replace('-', '/')
    newDate = x + ' ' + y
    return newDate;
  }

  const OrderItems = () => {
    if (!orders) return null;
    return (
      <table className='orders-table'>
        <thead>
            <th>Order #</th>
            <th>Date</th>
            <th>Total</th>
          </thead>
        <tbody>
          {orders.map((item: any) => {
            return <tr key={item.id}className='item-card'>
              <td>
                {item.id}
              </td>
              <td>
                {dateFormator(item.date)} 
              </td>
              <td>
                {item.total}
              </td>
              <td>
                <Link to={`${item.id}`}>Order details</Link>
              </td>
            </tr>
            }
          )}
        </tbody>
      </table>
    )
  }

  return (
    <div className="orders container">
      <h1>Order History</h1>
      <OrderItems />
    </div>
  )
}
export default Orders;
