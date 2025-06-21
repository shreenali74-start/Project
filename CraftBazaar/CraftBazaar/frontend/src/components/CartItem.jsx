// CartItem.jsx
import React, { useState } from 'react';
import QuantityControl from './QuantityControl';

function CartItem({ item, onQuantityChange }) {
    const [quantity, setQuantity] = useState(item.qty || 1);

    //fucntion to handle change in quantity
    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
        onQuantityChange(item._id, newQuantity);
    };

    return (
        <div className='container-fluid flex-acenter gap-4 p-3'>
            <div className="col-md-6">
                <img src={`http://localhost:5000${item.img[0]}`} alt="" className="img-fluid" />
            </div>
            <div className="col-md-6">
                <p>Product : {item.p_name}</p>
                <p>Price: ₹{item.price}</p>
                <QuantityControl initialQuantity={quantity} onQuantityChange={handleQuantityChange} />
                <p>Total: ₹{item.price * quantity}</p>
            </div>
        </div>
    );
}

export default CartItem;