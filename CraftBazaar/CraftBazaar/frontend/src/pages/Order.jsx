import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Order() {

    //reciever data storing variable with parameters required 
    const [recieverData, setRecieverData] = useState({
        username: '',
        email: '',
        address: '',
        phone: '',
        pincode: '',
        paymentMode: ''
    });

    //bill attributes required for bill display 
    const [bill, setBill] = useState({
        totalAmount: 0,
        gst: 0,
        totalBill: 0
    })

    //handling input changes
    function handleChange(e) {
        e.preventDefault();

        const { name, value } = e.target;
        setRecieverData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

    }

    const navigator = useNavigate();
    //getting order id from url
    const { orderId } = useParams();

    //function to clear cart once the purchase has been made 
    function clearCart() {
        const token = localStorage.getItem('userToken');
        axios
            .delete(`http://localhost:5000/cart`, {
                headers: {
                    Authorization: token,
                }
            },)
            .then((response) => {
                console.log("Cart Cleared");
                navigator('/');
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }

    //function to get the required data for display
    function getData() {
        const token = localStorage.getItem('userToken');
        axios
            .get('http://localhost:5000/user/getOne', {
                headers: {
                    Authorization: token,
                }
            })
            .then((response) => {
                setRecieverData(response.data);
            })
            .catch((error) => {
                console.log(error.response.data);
            });

        axios
            .get(`http://localhost:5000/orders/${orderId}`, {
                headers: {
                    Authorization: token,
                }
            })
            .then((response) => {
                setBill((prevData) => ({ ...prevData, totalAmount: response.data.totalAmount }));
                setBill((prevData) => ({ ...prevData, gst: response.data.gst }));
                setBill((prevData) => ({ ...prevData, totalBill: response.data.totalBill }))
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    }


    //function to handle order
    function handleOrder(e) {
        e.preventDefault();

        //add orderid to the reciever data
        recieverData.orderId = orderId;
        //get user token
        const token = localStorage.getItem('userToken');
        //send request to api for updating order
        axios
            .put('http://localhost:5000/orders/update', recieverData)
            .then((response) => {
                if (response.status === 200) {
                    alert("Order Placed");
                    clearCart();
                    navigator('/');
                }
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    }

    //function to handle cancel 
    function handleCancel(e) {
        e.preventDefault();

        axios.
            delete(`http://localhost:5000/orders/${orderId}`)
            .then((response) => {
                console.log(response.data);
                navigator('/cart');
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    }

    //get all the required data to display on render
    useEffect(() => {
        getData();
    }, [])
    return (
        <>
            <div className="container-fluid p-4">
                <div className="row flex-jcenter gap-3">
                    <div className="col-md-5 bg-light p-3">
                        <h3 className="text-center fw-normal">Reciever Details</h3>
                        <hr />
                        <div className="mb-3">
                            <label className='form-label' htmlFor="username">Recipient</label>
                            <input
                                className='form-control'
                                type="text"
                                id="username"
                                name="username"
                                value={recieverData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="email">Email</label>
                            <input
                                className='form-control'
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleChange}
                                value={recieverData.email}
                            />
                        </div>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="phone">Phone</label>
                            <input
                                className='form-control'
                                type="number"
                                id="phone"
                                name="phone"
                                onChange={handleChange}
                                value={recieverData.phone}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <textarea
                                name="address"
                                id="address"
                                rows={5}
                                className='form-control'
                                value={recieverData.address}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pincode" className="form-label">Pincode</label>
                            <input
                                type="number"
                                name="pincode"
                                id="pincode"
                                value={recieverData.pincode}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="col-md-5 bg-light p-3">
                        <h3 className="text-center fw-normal">Payment Details</h3>
                        <hr />
                        <p className="fs-5"><b>Total Amount :</b> ₹{bill.totalAmount.toFixed(2)}</p>
                        <p className="fs-5"><b>GST (18%):</b> ₹ {bill.gst.toFixed(2)}</p>
                        <hr />
                        <p className="fs-5"><b>Total Bill :</b> ₹{bill.totalBill.toFixed(2)}</p>
                        <div className="mb-3">
                            <label className='form-label' htmlFor="paymentMode">Payment Mode</label>
                            <select
                                className="form-select"
                                id='paymentMode'
                                name='paymentMode'
                                onChange={handleChange}
                                required
                            >
                                <option selected>Select Payment Mode</option>
                                <option value="Cash on Delivery">Cash on Delivery</option>
                                <option value="UPI">UPI</option>
                                <option value="Card">Card</option>
                            </select>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-end gap-3">
                            <button className="btn btn-danger" onClick={handleCancel}>Cancel Order</button>
                            <button className="btn btn-primary" onClick={handleOrder}>Place Order Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Order
