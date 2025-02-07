// // import React from 'react'
// import PropTypes from 'prop-types';
// import { useEffect, useState } from 'react';
// import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

// const QtyBox = ({ totalStocks, onQuantityChange  }) => {
//     const [quantity, setQuantity] = useState(totalStocks === 0 ? 0 : 1); // Initialize quantity state

//     // Update quantity state when totalStocks changes
//     useEffect(() => {
//         setQuantity(totalStocks >= 1 ? 1 : 0);
//     }, [totalStocks]);

//      // Notify parent whenever quantity changes
//      useEffect(() => {
//         onQuantityChange(quantity);
//     }, [quantity, onQuantityChange]);

//     const handleIncrement = () => {
//         if (quantity < totalStocks) {
//             setQuantity(prev => prev + 1); // Increment quantity safely
//         }
//     };

//     const handleDecrement = () => {
//         if (quantity > 1) {
//             setQuantity(prev => prev - 1); // Decrement quantity safely
//         }
//     };

//     const handleInputChange = (e) => {
//         const value = Number(e.target.value);
//         // Ensure the value stays within range (1 to totalStocks)
//         if (!isNaN(value)) {
//             setQuantity(Math.max(1, Math.min(totalStocks, value)));
//         }
//     };

//     return (
//         <div className="qtyBox flex items-center justify-between border border-gray-200 rounded-md">
//             {/* Input Field */}
//             <input
//                 type="number"
//                 min="1"
//                 max={totalStocks} // Dynamic max value based on totalStocks
//                 value={quantity} // Bind input value to state
//                 onChange={handleInputChange} // Handle manual input
//                 disabled={totalStocks === 0} // Disable input if no stocks available
//                 className={`w-[60px] h-[40px] p-2 text-[15px] text-center rounded-l-md focus:outline-none ${
//                     totalStocks === 0 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
//                 }`}
//             />
//             <span className="flex flex-col">
//                 {/* Increment Button */}
//                 <button
//                     onClick={handleIncrement}
//                     disabled={quantity >= totalStocks} // Disable if quantity reaches totalStocks
//                     className={`flex items-center justify-center bg-gray-200 hover:bg-gray-300 h-[20px] w-[40px] rounded-tr-md ${
//                         quantity >= totalStocks ? 'cursor-not-allowed opacity-50' : ''
//                     }`}
//                 >
//                     <FiChevronUp />
//                 </button>
//                 <hr className="w-full border-gray-300" />
//                 {/* Decrement Button */}
//                 <button
//                     onClick={handleDecrement}
//                     disabled={quantity <= 1 || totalStocks === 0} // Disable if quantity is 1 or no stocks
//                     className={`flex items-center justify-center bg-gray-200 hover:bg-gray-300 h-[20px] w-[40px] rounded-br-md ${
//                         quantity <= 1 || totalStocks === 0 ? 'cursor-not-allowed opacity-50' : ''
//                     }`}
//                 >
//                     <FiChevronDown />
//                 </button>
//             </span>
//         </div>
//     );
// };

// QtyBox.propTypes = {
//     totalStocks: PropTypes.number.isRequired,
//     onQuantityChange: PropTypes.func.isRequired, // Callback prop
// };

// export default QtyBox;


import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const QtyBox = ({ totalStocks, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(totalStocks > 0 ? 1 : 0); // Default: 1 if stock exists, else 0

    // Update quantity when totalStocks changes
    useEffect(() => {
        setQuantity(totalStocks > 0 ? 1 : 0);
    }, [totalStocks]);

    // Notify parent when quantity changes
    useEffect(() => {
        onQuantityChange(quantity);
    }, [quantity, onQuantityChange]);

    const handleIncrement = () => {
        if (quantity < totalStocks) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleInputChange = (e) => {
        const value = Number(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= totalStocks) {
            setQuantity(value);
        } else if (value < 1) {
            setQuantity(1);
        }
    };

    return (
        <div className="qtyBox flex items-center border border-gray-200 rounded-md">
            {/* Quantity Input Field */}
            <input
                type="number"
                min="1"
                max={totalStocks}
                value={quantity}
                onChange={handleInputChange}
                disabled={totalStocks === 0}
                className={`w-[60px] h-[40px] p-2 text-[15px] text-center rounded-l-md focus:outline-none ${
                    totalStocks === 0 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                }`}
            />
            <span className="flex flex-col w-full">
                {/* Increment Button */}
                <button
                    onClick={handleIncrement}
                    disabled={quantity >= totalStocks}
                    className={`flex items-center justify-center bg-gray-200 hover:bg-gray-300 h-[20px] min-w-full shadow rounded-tr-md ${
                        quantity >= totalStocks ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                >
                    <FiChevronUp />
                </button>
                <hr className="w-full border-gray-300" />
                {/* Decrement Button */}
                <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1 || totalStocks === 0}
                    className={`flex items-center justify-center bg-gray-200 hover:bg-gray-300 h-[20px] min-w-full shadow rounded-br-md ${
                        quantity <= 1 || totalStocks === 0 ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                >
                    <FiChevronDown />
                </button>
            </span>
        </div>
    );
};

QtyBox.propTypes = {
    totalStocks: PropTypes.number.isRequired,
    onQuantityChange: PropTypes.func.isRequired,
};

export default QtyBox;
