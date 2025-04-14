// import { useContext, useEffect, useState } from 'react'
// import { MdOutlineShoppingCart } from 'react-icons/md';
// import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
// import { IoGitCompareOutline } from 'react-icons/io5';
// import { Button, Rating } from '@mui/material';
// import { Link, useNavigate } from 'react-router-dom';
// import { MyContext } from '../../App';
// import { PropTypes } from 'prop-types';

// const ProductDetailsContent = (props) => {

//     const [checked, setChecked] = useState(false);
//     const context = useContext(MyContext);
//     const [setProductActionIndex] = useState(null);
//     const [quantity, setQuantity] = useState(1); // Default quantity
//     const [selectedSize, setSelectedSize] = useState(null);
//     const [selectedWeight, setSelectedWeight] = useState(null);
//     const [selectedRam, setSelectedRam] = useState(null);
//     const [isAdded, setIsAdded] = useState(false);
//     const [setCartItem] = useState(null);

//     const navigate = useNavigate(); // React Router's navigate hook for redirection

//     // const props?.product?.countInStock = props?.product?.countInStock - props?.product?.sale;

//     const addToCart = async (product, userId, quantity, selectedSize, selectedWeight, selectedRam) => {
//     if (!context.cartData) {
//         console.error("Cart data is undefined or context is not initialized.");
//         context?.openAlertBox("error", "Cart is not available. Please try again later.");
//         return;
//     }

//     if (quantity <= 0) return; // Prevent adding 0 quantity

//     // Check which options are required but not selected
//     const missingOptions = [];

//     if (props?.product?.size?.length > 0 && !selectedSize?.trim()) missingOptions.push("Size");
//     if (props?.product?.productWeight?.length > 0 && !selectedWeight?.trim()) missingOptions.push("Weight");
//     if (props?.product?.productRam?.length > 0 && !selectedRam?.trim()) missingOptions.push("RAM");

//     if (missingOptions.length > 0) {
//         const errorMessage = `Please select ${missingOptions.join(", ")} before adding to cart.`;
//         context?.openAlertBox("error", errorMessage);
//         return;
//     }

//     // Filter out empty available options
//     const availableOptions = {};
//     if (Array.isArray(product.size) && product.size.length > 0) availableOptions.size = product.size;
//     if (Array.isArray(product.productWeight) && product.productWeight.length > 0) availableOptions.productWeight = product.productWeight;
//     if (Array.isArray(product.productRam) && product.productRam.length > 0) availableOptions.productRam = product.productRam;

//     // Filter out empty selected options
//     const selectedOptions = {};
//     if (selectedSize?.trim()) selectedOptions.size = selectedSize;
//     if (selectedWeight?.trim()) selectedOptions.productWeight = selectedWeight;
//     if (selectedRam?.trim()) selectedOptions.productRam = selectedRam;

//     // Create a unique identifier for the combination of product and selected options
//     const uniqueIdentifier = `${product._id}-${selectedSize}-${selectedWeight}-${selectedRam}`;

//     // Check if the item is already in the cart
//     const itemInCart = context.cartData?.find(
//         (cartItem) =>
//             cartItem.productId === product._id &&
//             cartItem.selectedOptions?.size === selectedSize &&
//             cartItem.selectedOptions?.weight === selectedWeight &&
//             cartItem.selectedOptions?.ram === selectedRam
//     );

//     if (itemInCart) {
//         // If the item is already in the cart, show "Go to Cart"
//         setIsAdded(true);
//         setQuantity(itemInCart.quantity); // Sync quantity from cart item
//     } else {
//         // Add the item to the cart
//         await context.addToCart(product, userId, quantity, selectedSize, selectedWeight, selectedRam, uniqueIdentifier);
//         setIsAdded(true); // Update button to show "Go to Cart"
//     }
// };

// // Updating `useEffect` and `handleOptionSelection` remains unchanged


// useEffect(() => {
//     if (!context?.cartData || !props?.product?._id) return;

//     // Check if the item with selected options is already in the cart
//     const item = context.cartData.find(
//         (cartItem) =>
//             cartItem.productId === props.product._id &&
//             cartItem.selectedOptions?.size === selectedSize &&
//             cartItem.selectedOptions?.weight === selectedWeight &&
//             cartItem.selectedOptions?.ram === selectedRam
//     );

//     if (item) {
//         setCartItem(item);
//         setQuantity(item.quantity); // Sync quantity from context
//     } else {
//         // setCartItem(null); // Reset to null instead of an empty array
//         setQuantity(1); // Reset quantity
//     }
// }, [context?.cartData, props?.product?._id, selectedSize, selectedWeight, selectedRam]);


//     useEffect(() => {
//         setIsAdded(false);
//     }, [selectedSize, selectedWeight, selectedRam])

//     const handleOptionSelection = (type, value) => {
//         // Handle size, weight, and RAM selection
//         switch (type) {
//             case 'size':
//                 setSelectedSize(value);
//                 break;
//             case 'weight':
//                 setSelectedWeight(value);
//                 break;
//             case 'ram':
//                 setSelectedRam(value);
//                 break;
//             default:
//                 break;
//         }
//     };

//     return (
//         <>
//             <h1 className="text-[20px] text-[var(--text-dark)] font-bold mb-1 productBrand">
//                 <Link to="#">{props?.product?.brand}</Link>
//             </h1>
//             <h1 className="text-[18px] mb-1 productTitle pr-10">
//                 <Link to="#">{props?.product?.name}</Link>
//             </h1>

//             <div className="flex items-center justify-start gap-3 text-[14px] py-1">
//                 <Link to="#">
//                     <span className="flex items-center gap-1 border px-2 hover:border-[var(--text-dark)]">
//                         <span className="flex items-center gap-1 font-semibold">
//                             {props?.product?.rating}
//                             <Rating defaultValue={1} max={1} size="small" readOnly className="!text-[var(--rating-star-color)]" />
//                         </span>
//                         <span className="line !h-[15px] mx-0.5"></span>
//                         <span className="flex items-center gap-1 font-semibold">
//                             {new Intl.NumberFormat("en", { notation: "compact" }).format(5100).toLowerCase()}
//                             <span className="font-normal">Ratings</span>
//                         </span>
//                     </span>
//                 </Link>
//                 <span className="line !h-[15px] mx-1"></span>
//                 <span className="cursor-pointer link" onClick={props?.gotoReviews}>Review{props?.reviewsCount >= 2 ? "s" : ""} ({props?.reviewsCount})</span>
//             </div>

//             <hr className="my-2" />

//             <div className="flex flex-col gap-3 py-1">
//                 <div className="flex items-center gap-3">

//                     <span className="price text-[var(--text-dark)] text-[28px] font-medium flex items-center gap-0.5">
//                         ₹<span>{new Intl.NumberFormat('en-IN').format(`${props?.product?.price}`)}</span>
//                     </span>
//                     <span className="oldPrice text-[var(--text-light)] text-[16px] font-medium flex items-center gap-0.5">
//                         <span className="line-through gap-0.5">₹<span>{new Intl.NumberFormat('en-IN').format(`${props?.product?.oldPrice}`)}</span></span>
//                     </span>
//                     <span className="uppercase text-[16px] text-[var(--off-color)] font-medium">
//                         ({`${props?.product?.discount}`}% OFF)
//                     </span>
//                 </div>

//                 <div className='flex items-center gap-5'>
//                     <div className="flex items-center">
//                         <span className="text-[16px] font-normal flex items-center gap-2">
//                             Available in stocks:
//                             {
//                                 props?.product?.countInStock > 0 ? (
//                                     <span className="font-bold text-[var(--rating-star-color)]">{`${props?.product?.countInStock} Items`}</span>
//                                 ) : (
//                                     <span className="p-1 text-[12px] bg-red-50 font-bold text-red-500 border border-red-500 capitalize">
//                                         Out of Stock
//                                     </span>
//                                 )
//                             }
//                         </span>
//                     </div>

//                     <div className="flex items-start flex-col gap-2">
//                         {
//                             props?.product?.countInStock === 0 ? (
//                                 <span className="normal-case border bg-[#fff2e5] p-1 px-2 border-orange-500 text-orange-500 text-[16px] font-medium">
//                                     There are not enough products in stock
//                                 </span>
//                             ) : (
//                                 <span className="capitalize border bg-[#e5ffe8] p-1 px-2 border-green-500 text-green-500 text-[16px] font-medium">
//                                     In stock
//                                 </span>
//                             )
//                         }
//                     </div>
//                 </div>
//             </div>


//             {/* Product Details */}
//             <div className="shadow-sm w-full px-8 border rounded-md mb-5 description py-5 mt-3">
//                 <h2 className="text-[18px] font-bold text-[var(--text-dark)] mb-3">Description:</h2>
//                 <p className="text-[16px] text-justify">
//                     {props?.product?.description || "No description available."}
//                 </p>
//             </div>

//             {/* Product Options */}
//             {props?.product?.size?.length > 0 && (
//                 <div className="flex items-center gap-3 mb-4">
//                     <span className="text-[16px] font-bold">Size:</span>
//                     <div className="flex items-center gap-1 actions">
//                         {props?.product?.size?.map((size, index) => (
//                             <Button
//                                 key={index}
//                                 className={`${selectedSize === size ? "!bg-[var(--bg-primary)] !text-white" : ""} ${props?.product?.countInStock === 0 ? "!cursor-not-allowed !text-gray-400 hover:!border-none" : ""}`}
//                                 onClick={() => { props?.product?.countInStock !== 0 && setProductActionIndex(index); handleOptionSelection("size", size); }}
//                                 disableRipple={props?.product?.countInStock === 0}>
//                                 {size}
//                             </Button>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Product Weight Options */}
//             {props?.product?.productWeight?.length > 0 && (
//                 <div className="flex items-center gap-3 mb-4">
//                     <span className="text-[16px] font-bold">Weight:</span>
//                     <div className="flex items-center gap-1 actions">
//                         {props?.product?.productWeight?.map((weight, index) => (
//                             <Button
//                                 key={index}
//                                 className={`${selectedWeight === weight ? "!bg-[var(--bg-primary)] !text-white" : ""} ${props?.product?.countInStock === 0 ? "!cursor-not-allowed !text-gray-400 hover:!border-none" : ""}`}
//                                 onClick={() => { props?.product?.countInStock !== 0 && setProductActionIndex(index); handleOptionSelection("weight", weight); }}
//                                 disableRipple={props?.product?.countInStock === 0}>
//                                 {weight}
//                             </Button>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Product RAM Options */}
//             {props?.product?.productRam?.length > 0 && (
//                 <div className="flex items-center gap-3 mb-4">
//                     <span className="text-[16px] font-bold">RAM:</span>
//                     <div className="flex items-center gap-1 actions">
//                         {props?.product?.productRam?.map((ram, index) => (
//                             <Button
//                                 key={index}
//                                 className={`${selectedRam === ram ? "!bg-[var(--bg-primary)] !text-white" : ""} ${props?.product?.countInStock === 0 ? "!cursor-not-allowed !text-gray-400 hover:!border-none" : ""}`}
//                                 onClick={() => { props?.product?.countInStock !== 0 && setProductActionIndex(index); handleOptionSelection("ram", ram); }}
//                                 disableRipple={props?.product?.countInStock === 0}>
//                                 {ram}
//                             </Button>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             <p className="text-[14px] text-[rgba(0,0,0,0.5)]">Free Shipping (Est. Delivery Time 7 Days)</p>

//             <div className="flex items-center my-4 gap-5 rounded-md">
//                 <Button
//                     className={`!h-[40px] w-52 !text-[16px] flex items-center justify-center gap-1 ${props?.product?.countInStock === 0 ? "!cursor-not-allowed !bg-gray-300 !text-white" : "buttonPrimaryBlack"}`}
//                     onClick={async () => {
//                         if (isAdded) {
//                             // Navigate to cart if "Go to Cart" is displayed
//                             context?.handleCloseProductDetailsModal();
//                             navigate('/cart');
//                         } else {
//                             // Add to cart if "Add to Cart" is displayed
//                             if (props?.product?.countInStock !== 0) {
//                                 await addToCart(props?.product, context?.userData?._id, quantity, selectedSize, selectedWeight, selectedRam);
//                             }
//                         }
//                     }}
//                     disableRipple={props?.product?.countInStock === 0}
//                 >
//                     <MdOutlineShoppingCart className="text-[16px]" />
//                     {isAdded ? 'Go to Cart' : 'Add to Cart'}
//                 </Button>
//             </div>

//             <div className="flex items-center gap-4 my-4">
//                 <input id="wishlist-checkbox" type="checkbox" checked={checked} onChange={() => setChecked(!checked)} className="hidden" />
//                 <label htmlFor="wishlist-checkbox" className="flex items-center gap-1 cursor-pointer group link text-[16px]">
//                     {checked ? (
//                         <IoMdHeart className="text-[22px] text-red-500 transition-all duration-300" />
//                     ) : (
//                         <IoMdHeartEmpty className="text-[22px] text-gray-700 group-hover:text-[var(--bg-primary)] transition-all duration-300" />
//                     )}
//                     <span className="transition-all duration-300">Add to Wishlist</span>
//                 </label>
//                 <span className="line !h-[15px] mx-0.5"></span>
//                 <span className="flex items-center gap-2 text-[16px] cursor-pointer link transition-all duration-300">
//                     <IoGitCompareOutline className="text-[20px]" />Add to Compare
//                 </span>
//             </div>

//         </>
//     );
// };

// ProductDetailsContent.propTypes = {
//     product: PropTypes.shape({
//         _id: PropTypes.string,
//         brand: PropTypes.string,
//         name: PropTypes.string,
//         rating: PropTypes.number,
//         price: PropTypes.number,
//         oldPrice: PropTypes.number,
//         discount: PropTypes.number,
//         countInStock: PropTypes.number,
//         description: PropTypes.string,
//         size: PropTypes.arrayOf(PropTypes.string),
//         productWeight: PropTypes.arrayOf(PropTypes.string),
//         productRam: PropTypes.arrayOf(PropTypes.string),
//     }),
//     gotoReviews: PropTypes.func,
//     reviewsCount: PropTypes.number,
// };


// export default ProductDetailsContent;

import { useContext, useEffect, useState } from 'react';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { IoGitCompareOutline } from 'react-icons/io5';
import { Button, Rating } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { deleteData, postData } from '../../utils/api';

const ProductDetailsContent = (props) => {
    const [checked, setChecked] = useState(false);
    const [quantity, setQuantity] = useState(1); // Default quantity
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedWeight, setSelectedWeight] = useState(null);
    const [selectedRam, setSelectedRam] = useState(null);
    const [isAdded, setIsAdded] = useState(false);
    const [cartItem, setCartItem] = useState(null);
    const [isAddedWishlist, setIsAddedWishlist] = useState(false);

    const context = useContext(MyContext);
    const navigate = useNavigate(); // React Router's navigate hook for redirection

    const addToCart = async (product, userId, quantity, selectedSize, selectedWeight, selectedRam) => {
        if (!context.cartData) {
            console.error("Cart data is undefined or context is not initialized.");
            context?.openAlertBox("error", "Cart is not available. Please try again later.");
            return;
        }

        if (quantity <= 0) return; // Prevent adding 0 quantity

        // Check which options are required but not selected
        const missingOptions = [];
        if (props?.product?.size?.length > 0 && !selectedSize?.trim()) missingOptions.push("Size");
        if (props?.product?.productWeight?.length > 0 && !selectedWeight?.trim()) missingOptions.push("Weight");
        if (props?.product?.productRam?.length > 0 && !selectedRam?.trim()) missingOptions.push("RAM");

        if (missingOptions.length > 0) {
            const errorMessage = `Please select ${missingOptions.join(", ")} before adding to cart.`;
            context?.openAlertBox("error", errorMessage);
            return;
        }

        // Create a unique identifier for the combination of product and selected options
        const uniqueIdentifier = `${product._id}-${selectedSize}-${selectedWeight}-${selectedRam}`;

        // Check if the item is already in the cart
        const itemInCart = context.cartData?.find(
            (cartItem) =>
                cartItem.productId === product._id &&
                cartItem.selectedOptions?.size === selectedSize &&
                cartItem.selectedOptions?.weight === selectedWeight &&
                cartItem.selectedOptions?.ram === selectedRam
        );

        if (itemInCart) {
            // If the item is already in the cart, show "Go to Cart"
            setIsAdded(true);
            setQuantity(itemInCart.quantity); // Sync quantity from cart item
        } else {
            // Add the item to the cart
            await context.addToCart(product, userId, quantity, selectedSize, selectedWeight, selectedRam, uniqueIdentifier);
            setIsAdded(true); // Update button to show "Go to Cart"
        }
    };

    useEffect(() => {
        if (!context?.cartData || !props?.product?._id) return;

        // Check if the item with selected options is already in the cart
        const item = context.cartData.find(
            (cartItem) =>
                cartItem.productId === props.product._id &&
                cartItem.selectedOptions?.size === selectedSize &&
                cartItem.selectedOptions?.weight === selectedWeight &&
                cartItem.selectedOptions?.ram === selectedRam
        );

        if (item) {
            setCartItem(item);
            setQuantity(item.quantity); // Sync quantity from context
        } else {
            setQuantity(1); // Reset quantity
        }
    }, [context?.cartData, props?.product?._id, selectedSize, selectedWeight, selectedRam]);

    useEffect(() => {
        setIsAdded(false);
    }, [selectedSize, selectedWeight, selectedRam]);

    const handleOptionSelection = (type, value) => {
        switch (type) {
            case 'size':
                setSelectedSize(value);
                break;
            case 'weight':
                setSelectedWeight(value);
                break;
            case 'ram':
                setSelectedRam(value);
                break;
            default:
                break;
        }
    };


    useEffect(() => {
        if (context?.userData !== null && Array.isArray(context?.wishlistData)) {
            const isWishlistItem = context.wishlistData.filter((item) =>
                item?.productId?.includes(props?.product?._id)
            );

            setIsAddedWishlist(isWishlistItem.length > 0); // Set to true if the item exists in the wishlist
        } else {
            setIsAddedWishlist(false);
        }
    }, [context?.wishlistData, props?.product?._id, context?.userData]);

    const handleAddToMyList = async (item) => {
        if (!context?.userData) {
            context?.openAlertBox("error", "You are not logged in.");
            return;
        }

        // Find the wishlist item ID if it exists
        const wishlistItem = context?.wishlistData?.find((w) => w.productId === item._id);
        const wishlistItemId = wishlistItem?._id; // Correct wishlist item ID

        const obj = {
            productId: item._id,
            userId: context?.userData?._id,
            productTitle: item.name,
            image: item.images[0],
            rating: item.rating,
            price: item.price,
            oldPrice: item.oldPrice,
            brand: item.brand,
            discount: item.discount,
        };

        console.log("Item ID:", item?._id);
        console.log("Wishlist Item ID:", wishlistItemId);

        try {
            if (wishlistItemId) {
                // Item exists in wishlist, so remove it
                const endpoint = `/api/wishlist/remove-from-wishlist/${wishlistItemId}`;
                await toast.promise(deleteData(endpoint), {
                    loading: "Removing from wishlist...",
                    success: (res) => {
                        if (!res.error) {
                            setIsAddedWishlist(false); // Set state to removed
                            context?.getWishlistData(); // Refresh wishlist
                            return res?.message || "Item removed from wishlist!";
                        } else {
                            throw new Error(res?.message || "Failed to remove from wishlist.");
                        }
                    },
                    error: (err) => {
                        console.error("Error Response:", err);
                        return err?.response?.data?.message || err?.message || "Something went wrong!";
                    },
                });
            } else {
                // Item not in wishlist, so add it
                const endpoint = "/api/wishlist/add-to-wishlist";
                await toast.promise(postData(endpoint, obj), {
                    loading: "Adding to wishlist...",
                    success: (res) => {
                        if (!res.error) {
                            setIsAddedWishlist(true); // Set state to added
                            context?.getWishlistData(); // Refresh wishlist
                            return res?.message || "Item added to wishlist!";
                        } else {
                            throw new Error(res?.message || "Failed to add to wishlist.");
                        }
                    },
                    error: (err) => {
                        console.error("Error Response:", err);
                        return err?.response?.data?.message || err?.message || "Something went wrong!";
                    },
                });
            }
        } catch (error) {
            console.error(error);
            context?.openAlertBox("error", "Unexpected error occurred. Please try again.");
        }
    };



    return (
        <>
            <h1 className="text-[20px] text-[var(--text-dark)] font-bold mb-1 productBrand">
                <Link to="#">{props?.product?.brand}</Link>
            </h1>
            <h1 className="text-[18px] mb-1 productTitle pr-10">
                <Link to="#">{props?.product?.name}</Link>
            </h1>

            <div className="flex items-center justify-start gap-3 text-[14px] py-1">
                <Link to="#">
                    <span className="flex items-center gap-1 border px-2 hover:border-[var(--text-dark)]">
                        <span className="flex items-center gap-1 font-semibold">
                            {props?.product?.rating}
                            <Rating defaultValue={1} max={1} size="small" readOnly className="!text-[var(--rating-star-color)]" />
                        </span>
                        <span className="line !h-[15px] mx-0.5"></span>
                        <span className="flex items-center gap-1 font-semibold">
                            {new Intl.NumberFormat("en", { notation: "compact" }).format(5100).toLowerCase()}
                            <span className="font-normal">Ratings</span>
                        </span>
                    </span>
                </Link>
                <span className="line !h-[15px] mx-1"></span>
                <span className="cursor-pointer link" onClick={props?.gotoReviews}>Review{props?.reviewsCount >= 2 ? "s" : ""} ({props?.reviewsCount})</span>
            </div>

            <hr className="my-2" />

            {/* <div className="flex flex-col gap-3 py-1">
                <div className="flex items-center gap-3">
                    <span className="price text-[var(--text-dark)] text-[28px] font-medium flex items-center gap-0.5">
                        ₹<span>{new Intl.NumberFormat('en-IN').format(`${props?.product?.price}`)}</span>
                    </span>
                    <span className="oldPrice text-[var(--text-light)] text-[16px] font-medium flex items-center gap-0.5">
                        <span className="line-through gap-0.5">₹<span>{new Intl.NumberFormat('en-IN').format(`${props?.product?.oldPrice}`)}</span></span>
                    </span>
                    <span className="uppercase text-[16px] text-[var(--off-color)] font-medium">
                        ({`${props?.product?.discount}`}% OFF)
                    </span>
                </div>

                <div className='flex items-center gap-5'>
                    <div className="flex items-center">
                        <span className="text-[16px] font-normal flex items-center gap-2">
                            Available in stocks:
                            {
                                props?.product?.countInStock > 0 ? (
                                    <span className="font-bold text-[var(--rating-star-color)]">{`${props?.product?.countInStock} Items`}</span>
                                ) : (
                                    <span className="p-1 text-[12px] bg-red-50 font-bold text-red-500 border border-red-500 capitalize">
                                        Out of Stock
                                    </span>
                                )
                            }
                        </span>
                    </div>

                    <div className="flex items-start flex-col gap-2">
                        {
                            props?.product?.countInStock === 0 ? (
                                <span className="normal-case border bg-[#fff2e5] p-1 px-2 border-orange-500 text-orange-500 text-[16px] font-medium">
                                    There are not enough products in stock
                                </span>
                            ) : (
                                <span className="capitalize border bg-[#e5ffe8] p-1 px-2 border-green-500 text-green-500 text-[16px] font-medium">
                                    In stock
                                </span>
                            )
                        }
                    </div>
                </div>
            </div> */}

            <div className="flex flex-col gap-3 py-1">
                {/* Price Section */}
                <div className="flex flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="price text-[var(--text-dark)] text-2xl md:text-[28px] font-medium flex items-center gap-0.5">
                        ₹<span>{new Intl.NumberFormat('en-IN').format(`${props?.product?.price}`)}</span>
                    </span>

                    <span className="oldPrice text-[var(--text-light)] text-sm md:text-[16px] font-medium flex items-center gap-0.5">
                        <span className="line-through">₹<span>{new Intl.NumberFormat('en-IN').format(`${props?.product?.oldPrice}`)}</span></span>
                    </span>

                    <span className="uppercase text-sm md:text-[16px] text-[var(--off-color)] font-medium flex items-center">
                        ({`${props?.product?.discount}`}% OFF)
                    </span>
                </div>

                {/* Stock Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
                    {/* Stock Count */}
                    <div className="flex items-center">
                        <span className="text-sm md:text-[16px] font-normal flex items-center gap-2">
                            Available in stocks:
                            {props?.product?.countInStock > 0 ? (
                                <span className="font-bold text-[var(--rating-star-color)]">
                                    {`${props?.product?.countInStock} Items`}
                                </span>
                            ) : (
                                <span className="p-1 text-[12px] bg-red-50 font-bold text-red-500 border border-red-500 capitalize">
                                    Out of Stock
                                </span>
                            )}
                        </span>
                    </div>

                    {/* Stock Status */}
                    <div className="flex flex-col gap-1">
                        {props?.product?.countInStock === 0 ? (
                            <span className="normal-case border bg-[#fff2e5] p-1 px-2 border-orange-500 text-orange-500 text-sm md:text-[16px] font-medium">
                                There are not enough products in stock
                            </span>
                        ) : (
                            <span className="capitalize border bg-[#e5ffe8] p-1 px-2 border-green-500 text-green-500 text-sm md:text-[16px] font-medium">
                                In stock
                            </span>
                        )}
                    </div>
                </div>
            </div>



            {/* Product Options */}
            {props?.product?.size?.length > 0 && (
                <div className="flex items-center gap-3 my-4">
                    <span className="text-[16px] font-bold">Size:</span>
                    <div className="flex items-center gap-1 actions">
                        {props?.product?.size?.map((size, index) => (
                            <Button
                                key={index}
                                className={`${selectedSize === size ? "!bg-[var(--bg-primary)] !text-white" : ""} ${props?.product?.countInStock === 0 ? "!cursor-not-allowed !text-gray-400 hover:!border-none" : ""}`}
                                onClick={() => { props?.product?.countInStock !== 0 && handleOptionSelection("size", size); }}
                                disableRipple={props?.product?.countInStock === 0}>
                                {size}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Product Weight Options */}
            {props?.product?.productWeight?.length > 0 && (
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[16px] font-bold">Weight:</span>
                    <div className="flex items-center gap-1 actions">
                        {props?.product?.productWeight?.map((weight, index) => (
                            <Button
                                key={index}
                                className={`${selectedWeight === weight ? "!bg-[var(--bg-primary)] !text-white" : ""} ${props?.product?.countInStock === 0 ? "!cursor-not-allowed !text-gray-400 hover:!border-none" : ""}`}
                                onClick={() => { props?.product?.countInStock !== 0 && handleOptionSelection("weight", weight); }}
                                disableRipple={props?.product?.countInStock === 0}>
                                {weight}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Product RAM Options */}
            {props?.product?.productRam?.length > 0 && (
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[16px] font-bold">RAM:</span>
                    <div className="flex items-center gap-1 actions">
                        {props?.product?.productRam?.map((ram, index) => (
                            <Button
                                key={index}
                                className={`${selectedRam === ram ? "!bg-[var(--bg-primary)] !text-white" : ""} ${props?.product?.countInStock === 0 ? "!cursor-not-allowed !text-gray-400 hover:!border-none" : ""}`}
                                onClick={() => { props?.product?.countInStock !== 0 && handleOptionSelection("ram", ram); }}
                                disableRipple={props?.product?.countInStock === 0}>
                                {ram}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <p className="text-[14px] text-[rgba(0,0,0,0.5)]">Free Shipping (Est. Delivery Time 7 Days)</p>

            <div className="flex items-center my-4 gap-5 rounded-md">
                <Button
                    className={`!h-[40px] w-52 !text-[16px] flex items-center justify-center gap-1 ${props?.product?.countInStock === 0 ? "!cursor-not-allowed !bg-gray-300 !text-white" : "buttonPrimaryBlack"}`}
                    onClick={async () => {
                        if (isAdded) {
                            // Navigate to cart if "Go to Cart" is displayed
                            context?.handleCloseProductDetailsModal();
                            navigate('/cart');
                        } else {
                            // Add to cart if "Add to Cart" is displayed
                            if (props?.product?.countInStock !== 0) {
                                await addToCart(props?.product, context?.userData?._id, quantity, selectedSize, selectedWeight, selectedRam);
                            }
                        }
                    }}
                    disableRipple={props?.product?.countInStock === 0}
                >
                    <MdOutlineShoppingCart className="text-[16px]" />
                    {isAdded ? 'Go to Cart' : 'Add to Cart'}
                </Button>
            </div>

            {/* <div className="flex items-center gap-4 my-4">
                <input id="wishlist-checkbox" type="checkbox" checked={checked} onChange={() => setChecked(!checked)} className="hidden" />
                <label htmlFor="wishlist-checkbox" className="flex items-center gap-1 cursor-pointer group link text-[16px]">
                    {checked ? (
                        <IoMdHeart className="text-[22px] text-red-500 transition-all duration-300" />
                    ) : (
                        <IoMdHeartEmpty className="text-[22px] text-gray-700 group-hover:text-[var(--bg-primary)] transition-all duration-300" />
                    )}
                    <span className="transition-all duration-300">Add to Wishlist</span>
                </label>
                <span className="line !h-[15px] mx-0.5"></span>
                <span className="flex items-center gap-2 text-[16px] cursor-pointer link transition-all duration-300">
                    <IoGitCompareOutline className="text-[20px]" />Add to Compare
                </span>
            </div> */}
            <div className="flex flex-col items-start sm:flex-row sm:items-center gap-4 my-4 relative z-50">
                <input
                    id="wishlist-checkbox"
                    type="checkbox"
                    checked={isAddedWishlist}
                    onChange={() => handleAddToMyList(props?.product)}
                    className="hidden"
                />

                <label
                    htmlFor="wishlist-checkbox"
                    className="flex items-center gap-1 cursor-pointer group link text-[16px]"
                >
                    <div className="relative">
                        {isAddedWishlist ? (
                            <>
                                <IoMdHeart className="text-[22px] text-red-500 transition-all duration-300" />
                                <IoMdHeartEmpty className="text-[22px] text-white absolute inset-0 transition-opacity duration-300" />
                            </>
                        ) : (
                            <>
                                <IoMdHeart className="text-[22px] text-[rgba(0,0,0,0.3)] transition-all duration-300" />
                                <IoMdHeartEmpty className="text-[22px] text-white absolute inset-0 transition-opacity duration-300" />
                            </>
                        )}
                    </div>
                    <span className="transition-all duration-300">Add to Wishlist</span>
                </label>

                <span className="line !h-[15px] mx-0.5 hidden sm:block"></span>

                <span className="flex items-center gap-2 text-[16px] cursor-pointer link transition-all duration-300">
                    <IoGitCompareOutline className="text-[20px]" />
                    Add to Compare
                </span>
            </div>

        </>
    );
};

ProductDetailsContent.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string,
        brand: PropTypes.string,
        name: PropTypes.string,
        rating: PropTypes.number,
        price: PropTypes.number,
        oldPrice: PropTypes.number,
        discount: PropTypes.number,
        countInStock: PropTypes.number,
        description: PropTypes.string,
        size: PropTypes.arrayOf(PropTypes.string),
        productWeight: PropTypes.arrayOf(PropTypes.string),
        productRam: PropTypes.arrayOf(PropTypes.string),
    }),
    gotoReviews: PropTypes.func,
    reviewsCount: PropTypes.number,
};

export default ProductDetailsContent;