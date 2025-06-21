// QuantityControl.jsx
import React, { useState } from 'react';

function QuantityControl({ initialQuantity = 1, onQuantityChange }) {
    const [quantity, setQuantity] = useState(initialQuantity);

    //fucntion to handle decrease in item quantity
    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            if (onQuantityChange) {
                onQuantityChange(quantity - 1);
            }
        }
    };

    //fucntion to handle increase in item quantity
    const handleIncrease = () => {
        setQuantity(quantity + 1);
        if (onQuantityChange) {
            onQuantityChange(quantity + 1);
        }
    };

    //fucntion to handle change in quantity
    const handleInputChange = (event) => {
        const newValue = parseInt(event.target.value);
        if (!isNaN(newValue) && newValue >= 1) {
            setQuantity(newValue);
            if (onQuantityChange) {
                onQuantityChange(newValue);
            }
        } else {
            setQuantity(1);
            if (onQuantityChange) {
                onQuantityChange(1);
            }
        }
    };

    return (
        <div className="quantity-control">
            <button className="quantity-btn quantity-minus" onClick={handleDecrease}>
                -
            </button>
            <input
                type="number"
                className="quantity-input"
                value={quantity}
                onChange={handleInputChange}
                min="1"
            />
            <button className="quantity-btn quantity-plus" onClick={handleIncrease}>
                +
            </button>
        </div>
    );
}

export default QuantityControl;