import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function Orders() {

    const [orders, setOrders] = useState([]);

    // fucntion to get all the orders data for render
    function getOrders() {
        axios
            .get('http://localhost:5000/orders/')
            .then((response) => {
                setOrders(response.data);
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    }

    useEffect(() => {
        getOrders();
    }, []);

    return (
        <>
            <div className="container-fluid p-3 mt-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Recipient</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Email</th>
                            <th scope='col'>Address</th>
                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!orders ? '' :
                            orders.map((order, index) => (
                                <tr key={order._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{order.recipient}</td>
                                    <td>{order.phone}</td>
                                    <td>{order.email}</td>
                                    <td>{order.shippingAddress}</td>
                                    <td className='d-flex gap-3'>
                                        <div className="dropdown">
                                            <button className="btn btn-light " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li><Link to={`/admin/orders/${order._id}`} className="dropdown-item">Update</Link></li>
                                                <li><Link to={`/admin/orders/${order._id}`} className="dropdown-item">Details</Link></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Orders
