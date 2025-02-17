import { Button, Dialog, Divider, Rating } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import { MdDeleteOutline } from 'react-icons/md';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { TbTruckDelivery } from 'react-icons/tb';
import toast from 'react-hot-toast';
import { deleteData, editData } from '../../utils/api';
import { PropTypes } from 'prop-types';
import { FaCaretDown } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';

const CartPanelItems = (props) => {
  const context = useContext(MyContext);
  const [isOpenModel, setIsOpenModel] = useState(false);
    const [itemId, setItemId] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedWeight, setSelectedWeight] = useState("");
    const [selectedRam, setSelectedRam] = useState("");
    const [selectedOptions, setSelectedOptions] = useState({});


    const handleClickOpen = () => {
        setItemId(props?.item?._id)
        setIsOpenModel(true);
        context.forceUpdate();
    };

    const handleClose = () => {
        setIsOpenModel(false);
        setSelectedOptions(props?.item?.selectedOptions);
    };


    useEffect(() => {
        // Initialize selectedOptions from props when the component is mounted or updated
        if (props?.item?.selectedOptions) {
            setSelectedOptions(props?.item?.selectedOptions);
        }
    }, [props?.item]); // Re-run the effect if props.item changes

    const handleSelectOption = (optionKey, optionValue) => {
        if (optionKey === "size") {
            setSelectedSize(optionValue);
        } else if (optionKey === "productWeight") {
            setSelectedWeight(optionValue);
        } else if (optionKey === "productRam") {
            setSelectedRam(optionValue);
        }

        setSelectedOptions(prevState => ({
            ...prevState,
            [optionKey]: optionValue
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!props?.item?._id) {
            console.error("Error: Missing cart item ID");
            toast.error("Unable to update cart: Missing item information."); // User-friendly error
            return;
        }

        try {
            const obj = {
                id: props?.item?._id, // Send empty string if not selected
                selectedOptions: {
                    size: selectedSize || "",  // Send empty string if not selected
                    productWeight: selectedWeight || "",  // Send empty string if not selected
                    productRam: selectedRam || "",  // Send empty string if not selected
                },
            };

            await toast.promise(
                editData(`/api/cart/update-product-qty-in-cart`, obj),
                {
                    loading: "Updating your cart...", // More user-friendly loading message
                    success: (res) => {
                        if (res?.success) {
                            context?.getCartItems(); // Fetch updated cart
                            setIsOpenModel(false);
                            return res?.message || "Cart updated successfully!"; // Success message
                        } else {
                            throw new Error(res?.message || "Failed to update cart. Please try again."); // Fallback error message
                        }
                    },
                    error: (err) => {
                        return err?.message || "Something went wrong. Please try again later."; // Generic error message
                    }
                }
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
            toast.error("An unexpected error occurred. Please try again."); // Fallback error for unexpected issues
        }
    };

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
            success: (res) => {
              if (res?.success) {
                context?.getCartItems(); // Fetch updated cart
                return res?.message || "Quantity decreased!";
              } else {
                throw new Error(res?.message || "Failed to update quantity.");
              }
            },
            error: (err) => {
              return err?.message || "Error updating quantity. Please try again.";
            }
          }
        );
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
      const obj = {
        id: props?.item?._id,
        qty: updatedQty,
        subTotal: props?.item?.price * updatedQty,
        subTotalOldPrice: props?.item?.oldPrice * updatedQty
      };

      // Backend call to update quantity
      const result = await toast.promise(
        editData(`/api/cart/update-product-qty-in-cart`, obj),
        {
          loading: "Updating quantity...",
          success: (res) => {
            if (res?.success) {
              context?.getCartItems(); // Fetch updated cart
              return res?.message || "Quantity increased!";
            } else {
              throw new Error(res?.message || "Failed to update quantity.");
            }
          },
          error: (err) => {
            // Display the backend error message directly
            return err?.message || "Error updating quantity. Please try again.";
          }
        }
      );
      console.log("Quantity updated:", result); // Optional: log the result if needed
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Show the backend error message or fallback if not available
      toast.error(error?.message || "An unexpected error occurred. Please try again.");
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
          <h4 className="text-[14px] line-clamp-1 leading-6 flex items-center gap-1">
            <span className="font-semibold flex items-center justify-center gap-0.5">{props?.item?.rating}
              <Rating defaultValue={1} max={1} readOnly className="!text-sm !text-[var(--rating-star-color)]" />
            </span>
            <Link to={`/product/${props?.item?._id}`} className="link transition-all" onClick={context.toggleCartPanel(false)}>
              {props?.item?.productTitle?.length > 25 ? `${props?.item?.productTitle?.substr(0, 25)}...` : props?.item?.productTitle}
            </Link>
          </h4>
          <h6 className="text-[12px] line-clamp-1 text-[rgba(0,0,0,0.4)]">Seller: <span className="capitalize">{props?.item?.sellerDetails?.sellerName}</span></h6>
          <div className="flex items-center gap-2 mt-1">
            <div className="relative">
              <span
                className="bg-gray-100 px-2 border hover:border-black rounded-sm font-bold text-[13px] flex items-center gap-1 cursor-pointer"
                onClick={handleClickOpen}
              >
                {props?.item?.availableOptions.size?.length > 0
                  ? "Size: "
                  : props?.item?.availableOptions.productWeight?.length > 0
                    ? "Weight: "
                    : props?.item?.availableOptions.productRam?.length > 0
                      ? "RAM: "
                      : ""}
                <span>
                  {`${props?.item?.selectedOptions?.size || ""} ${props?.item?.selectedOptions?.productWeight || ""} ${props?.item?.selectedOptions?.productRam || ""}`.trim()}
                </span>
                <FaCaretDown />
              </span>
            </div>
            <div className="w-auto">
              <span className='w-full border flex items-center rounded-full'>
                <Button
                  className={`!w-[30px] !min-w-[30px] !h-[20px] !rounded-l-full !bg-gray-200 shadow !text-[20px] !font-bold !text-black ${props?.item?.quantity <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                  onClick={removeQty}
                  disabled={props?.item?.quantity <= 1} // Disable minus button if quantity is 1
                >
                  <FiMinus className='!text-[20px] !font-bold' />
                </Button>
                <span className='w-[40px] text-center text-[13px]'>{props?.item?.quantity}</span>
                <Button
                  className={`!w-[30px] !min-w-[30px] !h-[20px] !rounded-r-full !bg-gray-200 shadow !text-[20px] !font-bold !text-black ${props?.item?.quantity >= props?.item?.countInStock ? 'opacity-30 cursor-not-allowed' : ''}`}
                  onClick={addQty}
                  disabled={props?.item?.quantity >= props?.item?.countInStock} // Disable plus button if quantity reaches stock limit
                >
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

      <Dialog open={isOpenModel} onClose={handleClose}>
        <div className="flex flex-col w-[400px] px-5 py-8 relative">
          <Button
            className="!absolute !top-2 !right-2 !w-[45px] !min-w-[45px] !h-[45px] !rounded-full !bg-red-50 !text-red-500 !text-[20px]"
            onClick={handleClose}
          >
            <RxCross2 />
          </Button>

          <div className="flex w-full gap-2">
            <div className="w-[100px] h-[100px] rounded-md overflow-hidden">
              <img
                src={props?.item?.image}
                alt="ProductImg"
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            <div className="flex flex-col w-full pr-10">
              <h4 className="text-[14px] line-clamp-2">
                {props?.item?.productTitle?.length > 100
                  ? `${props?.item?.productTitle?.substr(0, 100)}...`
                  : props?.item?.productTitle}
              </h4>
              <h6 className="text-[12px] line-clamp-1 text-[rgba(0,0,0,0.4)]">
                Seller:{" "}
                <span className="capitalize">
                  {props?.item?.sellerDetails?.sellerName?.length > 30
                    ? props?.item.sellerDetails.sellerName.substring(0, 30) + "..."
                    : props?.item?.sellerDetails?.sellerName}
                </span>
              </h6>

              <div className="flex items-center gap-2 mt-2">
                <span className="price text-black text-[16px] font-bold flex items-center">
                  ₹{new Intl.NumberFormat("en-IN").format(`${props?.item?.subTotal}`)}
                </span>
                <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[14px] font-normal flex items-center">
                  ₹{new Intl.NumberFormat("en-IN").format(`${props?.item?.subTotalOldPrice}`)}
                </span>
                <span className="uppercase text-[14px] text-[var(--off-color)] font-normal">
                  {props?.item?.discount}% OFF
                </span>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <h2 className="text-gray-800 font-semibold">
            Select{" "}
            {props?.item?.availableOptions.size?.length > 0
              ? "Size"
              : props?.item?.availableOptions.productWeight?.length > 0
                ? "Weight"
                : props?.item?.availableOptions.productRam?.length > 0
                  ? "RAM"
                  : ""}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-start mt-4 gap-4">
              {props?.item?.availableOptions && (
                <div className="flex flex-col gap-2">
                  {["size", "productWeight", "productRam"].map((option, idx) => {
                    const options = props?.item?.availableOptions[option];
                    if (options?.length > 0) {
                      return (
                        <div key={idx} className="flex flex-wrap gap-2">
                          {options.map((item, index) => (
                            <span
                              key={index}
                              className={`w-auto min-w-[45px] h-[45px] rounded-full p-2 border 
                                              ${selectedOptions[option] === item
                                  ? 'border-[var(--bg-primary)] text-[var(--bg-primary)]'
                                  : 'border-gray-400 text-black'} 
                                              hover:border-[var(--bg-primary)] hover:text-[var(--bg-primary)] transition-all 
                                              flex items-center justify-center font-bold cursor-pointer`}
                              onClick={() => handleSelectOption(option, item)}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>

            <Button type="submit" className="buttonPrimaryBlack !mt-8 w-full">
              Done
            </Button>
          </form>
        </div>
      </Dialog>
    </>
  );
};

CartPanelItems.propTypes = {
  item: PropTypes.object.isRequired,
};

export default CartPanelItems;
