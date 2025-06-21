import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
//importing cart item component to render each item
import CartItem from '../components/CartItem';

function Cart() {

    const [items, setItems] = useState([]);
    const navigator = useNavigate();

    //function to get all cart items for user
    function getItems() {
        const token = localStorage.getItem('userToken');

        axios
            .get(`http://localhost:5000/cart/`, {
                headers: {
                    Authorization: token
                }
            })
            .then((response) => {
                setItems(response.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // function to update the cart quantity 
    function updateCartItemQuantity(itemId, newQuantity) {
        axios
            .put('http://localhost:5000/cart/updateQty', {
                cartId: itemId,
                qty: newQuantity
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err.response.data);

            })
    }

    // calculating total with useMemo hook
    const calculateTotals = useMemo(() => {
        let totalProducts = 0;
        let totalAmount = 0;

        if (items.length != 0) {
            items.forEach((item) => {
                totalProducts += item.qty;
                totalAmount += item.price * item.qty;
            });
        }

        const gst = totalAmount * 0.18; // 18% GST
        const totalBill = totalAmount + gst;

        return { totalProducts, totalAmount, gst, totalBill };
    }, [items]);

    //handle the order now button
    const handleOrderNow = async () => {
        try {
            const token = localStorage.getItem('userToken'); // Get token
            const response = await axios.post(
                'http://localhost:5000/orders',
                {
                    items: items.map((item) => ({
                        productId: item._id,
                        quantity: item.qty,
                        price: item.price,
                        name: item.p_name,
                    })),
                    totalAmount: calculateTotals.totalAmount,
                    gst: calculateTotals.gst,
                    totalBill: calculateTotals.totalBill,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (response.status == 201)
                navigator(`/order/${response.data._id}`)

        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    //get cart items on render
    useEffect(() => {
        getItems();
    }, []);

    return (
        <>
            <div className="container-fluid p-3">
                <h1 className="text-center fw-normal fst-italic">Cart Items</h1>
                <hr />
                <div className="row p-3">
                    <div className="col-md-7">
                        {items.length == 0 ? <h1 className='fw-normal text-center fst-italic'>No Items In the cart</h1> :
                            items.map((item) => (
                                <CartItem key={item._id} item={item} onQuantityChange={updateCartItemQuantity} />
                            ))}
                    </div>
                    <div className="vr g-0 opacity-100"></div>
                    {items.length == 0 ? '' : (
                        <div className="col-md-4">
                            <h2>Order Summary</h2>
                            <p>Total Products: {calculateTotals.totalProducts}</p>
                            <p>Total Amount: ₹{calculateTotals.totalAmount.toFixed(2)}</p>
                            <p>GST (18%): ₹{calculateTotals.gst.toFixed(2)}</p>
                            <hr />
                            <p>Total Bill: ₹{calculateTotals.totalBill.toFixed(2)}</p>
                            <button className="btn btn-primary" onClick={handleOrderNow}>Order Now</button>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}

export default Cart
