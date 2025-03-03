import { useContext, useEffect, useState } from 'react'
import { Button, Rating } from '@mui/material';
import { RiCloseLargeLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import toast from 'react-hot-toast';
import { deleteData } from '../../utils/api';
import PropTypes from 'prop-types';

const WishlistItems = (props) => {

    const context = useContext(MyContext);
    const [setIsAddedWishlist] = useState(false);

    useEffect(() => {
        window?.scroll(0, 0);
    }, [])


    useEffect(() => {
        if (context?.userData) {
            const isWishlistItem = context?.wishlistData?.find((w) => w?.productId === props?.item?._id);
            setIsAddedWishlist(!!isWishlistItem); // Convert to boolean
        } else {
            setIsAddedWishlist(false);
        }
    }, [context?.wishlistData, props?.item?._id, context?.userData]);

    const handleRemoveFromMyList = async (itemId) => {
        if (!context?.userData) {
            context?.openAlertBox("error", "You are not logged in.");
            return;
        }

        if (!itemId) {
            console.warn("Item not found in wishlist.");
            return;
        }

        try {
            const endpoint = `/api/wishlist/remove-from-wishlist/${itemId}`;
            await toast.promise(deleteData(endpoint), {
                loading: "Removing from wishlist...",
                success: (res) => {
                    if (!res.error) {
                        setIsAddedWishlist(false); // Update state
                        context?.getWishlistData(); // Refresh wishlist
                        return res?.message || "Item removed from wishlist!";
                    }
                    throw new Error(res?.message || "Failed to remove from wishlist.");
                },
                error: (err) => err?.response?.data?.message || err?.message || "Something went wrong!",
            });
        } catch (error) {
            console.error(error);
            context?.openAlertBox("error", "Unexpected error occurred. Please try again.");
        }
    };


    return (
        <>
            <div className="cartItem w-full p-3 flex items-start gap-4 border rounded-md relative">
                <Link to={`/product/${props?.item?.productId}`} className="w-full flex items-start gap-4 group" onClick={context.toggleCartPanel(false)} >
                    <div className="cartItemImg w-[15%] flex items-center justify-center">
                        <div className="w-full h-[150px] rounded-md overflow-hidden">
                            <img src={props?.item?.image} alt="ProductImg" className="w-full h-full object-cover rounded-md hover:scale-105 transition-all" />
                        </div>
                    </div>
                    <div className="cartInfo w-[85%] pr-5">
                        <div className='flex items-center text-[12px] gap-1'>
                            <span className="font-semibold flex items-center justify-center gap-0.5 bg-[var(--rating-star-color)] !text-white rounded-sm px-1">
                                {props?.item?.rating}
                                <Rating defaultValue={1} max={1} label={props?.item?.rating} readOnly className="!text-[14px] !text-white mb-0.5" />
                            </span>
                            <span className="font-bold text-[14px]">{props?.item?.brand?.length > 40 ? `${props?.item?.brand?.substr(0, 40)}...` : props?.item?.brand}</span>
                        </div>
                        {/* Add group-hover:text-blue-600 on h4, not the inner Link */}
                        <h4 className="text-[15px] mr-10 line-clamp-2 leading-6 flex items-center gap-1 group-hover:text-[var(--bg-primary)] transition-all">
                            <span>
                                {/* {props?.item?.productTitle?.length > 50 ? `${props?.item?.productTitle?.substr(0, 50)}...` : props?.item?.productTitle} */}
                                {props?.item?.productTitle}
                            </span>
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="price text-black text-[22px] font-semibold flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(`${props?.item?.price}`)}
                            </span>
                            <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[14px] font-normal flex items-center">
                                ₹{new Intl.NumberFormat('en-IN').format(`${props?.item?.oldPrice}`)}
                            </span>
                            <span className="uppercase text-[14px] text-[var(--off-color)] font-normal">{props?.item?.discount}% OFF</span>
                        </div>
                    </div>
                </Link>
                <Button
                    className="!w-[30px] !h-[30px] !min-w-[30px] !absolute top-4 right-4 !shadow-md !text-gray-800 hover:!bg-gray-500 hover:!text-white !rounded-full flex items-center justify-center"
                    onClick={() => handleRemoveFromMyList(props?.item?._id)}
                >
                    <RiCloseLargeLine className="!text-[50px]" />
                </Button>
            </div >

        </>
    )
}

WishlistItems.propTypes = {
    item: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        productId: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        brand: PropTypes.string.isRequired,
        productTitle: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        oldPrice: PropTypes.number.isRequired,
        discount: PropTypes.number.isRequired,
    }).isRequired,
};

export default WishlistItems
