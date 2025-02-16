import { Button, Divider } from '@mui/material';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import { MdDeleteOutline } from 'react-icons/md';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { TbTruckDelivery } from 'react-icons/tb';
import toast from 'react-hot-toast';
import { deleteData, editData } from '../../utils/api';
import { PropTypes } from 'prop-types';

const CartPanelItems = (props) => {
  const context = useContext(MyContext);

  // Remove Quantity Handler
  const removeQty = async () => {
    if (!props?.item?._id) {
      console.error("Error: Missing cart item ID");
      return;
    }

    if (props?.item?.quantity > 1) {
      const updatedQty = props?.item?.quantity - 1;
      try {
        const obj = { id: props?.item?._id, qty: updatedQty, subTotal: props?.item?.price * updatedQty, subTotalOldPrice: props?.item?.oldPrice * updatedQty };
        await toast.promise(
          editData(`/api/cart/update-product-qty-in-cart`, obj),
          {
            loading: "Updating quantity...",
            success: "Quantity decreased!",
            error: "Error updating quantity. Please try again.",
          }
        );
        context?.getCartItems(); // Fetch updated cart
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else if (props?.item?.quantity === 1) {
      try {
        await toast.promise(
          deleteData(`/api/cart/delete-cart-item/${props?.item?._id}`),
          {
            loading: "Removing item...",
            success: "Item removed from cart!",
            error: "Error deleting item. Please try again.",
          }
        );
        context?.getCartItems(); // Fetch updated cart
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  // Add Quantity Handler
  const addQty = async () => {
    if (!props?.item?._id) {
      console.error("Error: Missing cart item ID");
      return;
    }

    const updatedQty = props?.item?.quantity + 1;
    try {
      const obj = { id: props?.item?._id, qty: updatedQty, subTotal: props?.item?.price * updatedQty, subTotalOldPrice: props?.item?.oldPrice * updatedQty };
      await toast.promise(
        editData(`/api/cart/update-product-qty-in-cart`, obj),
        {
          loading: "Updating quantity...",
          success: "Quantity increased!",
          error: "Error updating quantity. Please try again.",
        }
      );
      context?.getCartItems(); // Fetch updated cart
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Remove Item Handler
  const removeItem = async (id) => {
    try {
      await toast.promise(
        deleteData(`/api/cart/delete-cart-item/${id}`),
        {
          loading: "Removing item...",
          success: "Item removed from cart!",
          error: "Error deleting item. Please try again.",
        }
      );
      context?.getCartItems(); // Fetch updated cart
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <>
      <div className="cartItem w-full flex items-start gap-3 p-2">
        <div className="cartItemImg w-[30%]">
          <div className="w-full h-[120px] rounded-md border overflow-hidden">
            <Link to={`/product/${props?.item?._id}`} onClick={() => context?.toggleCartPanel(false)}>
              <img src={props?.item?.image} className="w-full h-full object-cover rounded-md hover:scale-105 transition-all" />
            </Link>
          </div>
        </div>
        <div className="cartInfo w-[80%] pr-5 relative">
          <h4 className="text-[14px] line-clamp-1 leading-6">
            <Link to={`/product/${props?.item?._id}`} className="link transition-all" onClick={() => context?.toggleCartPanel(false)}>
              {props?.item?.productTitle}
            </Link>
          </h4>
          <h6 className="text-[12px] line-clamp-1 text-[rgba(0,0,0,0.4)]">Seller: <span className="capitalize">{props?.item?.sellerDetails?.sellerName}</span></h6>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-[90px] h-[22px] px-2 border rounded-full flex items-center justify-center">
              <span className='text-[13px]'>
                Size: {`L`}
              </span>
            </div>
            <div className="w-auto">
              <span className='w-full border flex items-center rounded-full'>
                <Button className='!w-[30px] !min-w-[30px] !h-[20px] !rounded-l-full !bg-gray-200 shadow !text-[20px] !font-bold !text-black' onClick={removeQty}>
                  <FiMinus className='!text-[20px] !font-bold' />
                </Button>
                <span className='w-[40px] text-center text-[13px]'>{props?.item?.quantity}</span>
                <Button className='!w-[30px] !min-w-[30px] !h-[20px] !rounded-r-full !bg-gray-200 shadow !text-[20px] !font-bold !text-black' onClick={addQty}>
                  <FiPlus className='!text-[20px] !font-bold' />
                </Button>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="price text-black text-[16px] font-bold flex items-center">
              ₹{new Intl.NumberFormat('en-IN').format(`${props?.item?.subTotal}`)}
            </span>
            <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[14px] font-normal flex items-center">
              ₹{new Intl.NumberFormat('en-IN').format(`${props?.item?.subTotalOldPrice}`)}
            </span>
            <span className="uppercase text-[14px] text-[var(--off-color)] font-normal">{props?.item?.discount}% OFF</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex flex-row items-center justify-center gap-1 text-[12px]"><TbTruckDelivery className="text-[18px]" />Delivery by Sat Feb 22</span>
          </div>
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] !absolute top-0 right-0 !shadow-md !text-gray-800 hover:!bg-gray-500 hover:!text-white !rounded-full flex items-center justify-center"
            onClick={() => removeItem(props?.item?._id)}
          >
            <MdDeleteOutline className="!text-[40px]" />
          </Button>
        </div>
      </div>
      <Divider />
    </>
  );
};

CartPanelItems.propTypes = {
  item: PropTypes.object.isRequired,
};

export default CartPanelItems;
