import React, { useContext, useEffect, useState } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { IoGitCompareOutline } from "react-icons/io5";
import { BsArrowsFullscreen } from "react-icons/bs";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { Checkbox, Tooltip } from "@mui/material";
import ProductImageOpacityChange from "./ImageChanger/ProductImageOpacity";
import { MyContext } from "../../App";
import PropTypes from "prop-types";
import { FiMinus, FiPlus } from "react-icons/fi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { deleteData, editData } from "../../utils/api";
import toast from "react-hot-toast";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ProductItem = (props) => {

  const context = useContext(MyContext);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [cartItem, setCartItem] = useState(null);

  const addToCart = (product, userId, quantity) => {
    if (quantity <= 0) return; // ✅ Prevent adding 0 quantity

    context?.addToCart(product, userId, quantity);
    setIsAdded(true);
  };

  useEffect(() => {
    if (!context?.cartData || !props?.product?._id) return;

    const item = context.cartData.find(
      (cartItem) => cartItem.productId === props.product._id
    );

    if (item) {
      setCartItem(item);
      setQuantity(item.quantity); // ✅ Sync quantity from cart
      setIsAdded(true);
    } else {
      setCartItem(null);
      setIsAdded(false);
      setQuantity(1); // ✅ Reset quantity after removal
    }
  }, [context?.cartData, props?.product?._id]);

  const removeQty = async () => {
    if (!cartItem?._id) {
      console.error("Error: Missing cart item ID");
      return;
    }
  
    if (quantity > 1) {
      const updatedQty = quantity - 1;
      setQuantity(updatedQty);
  
      try {
        const obj = { id: cartItem._id, qty: updatedQty, subTotal: props?.product?.price * updatedQty, subTotalOldPrice: props?.product?.oldPrice * updatedQty };
  
        await toast.promise(
          editData(`/api/cart/update-product-qty-in-cart`, obj),
          {
            loading: "Updating quantity...",
            success: "Quantity decreased!",
            error: "Error updating quantity. Please try again.",
          }
        );
        context?.getCartItems();
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else if (quantity === 1) {
      try {
        await toast.promise(
          deleteData(`/api/cart/delete-cart-item/${cartItem._id}`),
          {
            loading: "Removing item...",
            success: "Item removed from cart!",
            error: "Error deleting item. Please try again.",
          }
        );
  
        setCartItem(null);
        setIsAdded(false);
        setQuantity(1);
        context?.getCartItems();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };
  
  const addQty = async () => {
    if (!cartItem?._id) {
      console.error("Error: Missing cart item ID");
      return;
    }
  
    const updatedQty = quantity + 1;
    setQuantity(updatedQty);
  
    const obj = { id: cartItem._id, qty: updatedQty, subTotal: props?.product?.price * updatedQty, subTotalOldPrice: props?.product?.oldPrice * updatedQty };
  
    try {
      await toast.promise(
        editData(`/api/cart/update-product-qty-in-cart`, obj),
        {
          loading: "Updating quantity...",
          success: "Quantity increased!",
          error: "Error updating quantity. Please try again.",
        }
      );
      context?.getCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  

  return (
    <div className="transition-all duration-300 hover:shadow-xl rounded-md">
      <div className="productItem rounded-md overflow-hidden  border border-[rgba(80,80,80,0.07)]">
        <div className="group imgWrapper w-[100%] h-[250px] overflow-hidden  relative bg-gray-100">

          <Link to={props?.product?._id ? `/product/${props.product._id}` : '#'}>


            {/* <ProductImageFlipChange firstImg={"https://prestashop.coderplace.com/PRS02/PRS02042/demo/320-large_default/hummingbird-printed-t-shirt.jpg"} SecondImg={"https://prestashop.coderplace.com/PRS02/PRS02042/demo/318-large_default/hummingbird-printed-t-shirt.jpg"} /> */}
            <ProductImageOpacityChange firstImg={props?.product?.images?.[0]} SecondImg={props?.product?.images?.[1]} />

          </Link>
          <span className="discount flex items-center absolute top-[10px] left-[10px] z-50 bg-[var(--bg-primary)] text-white rounded-md p-1 text-[12px] font-medium">
            -{props?.product?.discount}%
          </span>

          <span className=" px-1 flex items-center gap-1 absolute bottom-2 right-2 z-50 border rounded-sm text-[12px] bg-[rgba(255,255,255,0.8)]">
            <span className="flex items-center gap-1 font-semibold">{props?.product?.rating}<Rating name="" defaultValue={1} max={1} readOnly className="!text-sm !text-[var(--rating-star-color)]" /></span>
            <span className="line !h-[10px] mx-0.5 !bg-[var(--text-light)]"></span>
            <span className="flex items-center gap-1 font-semibold">{new Intl.NumberFormat("en", { notation: "compact" }).format(500000).toLowerCase()}</span>
          </span>


          <div className="actions absolute top-[-200px] right-[0px] z-50 flex items-center gap-2 flex-col w-[80px] transition-all duration-500 group-hover:top-[15px] opacity-0 group-hover:opacity-100">

            <Tooltip
              title="View Product details"
              placement="right"
              arrow
            >
              <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.7)] !text-gray-700 hover:!bg-[var(--bg-primary)] hover:!text-white group" onClick={() => context.handleOpenProductDetailsModal(true, props?.product)}>
                <BsArrowsFullscreen className="text-[18px] !text-gray-700 group-hover:text-white" />
              </Button>
            </Tooltip>

            <Tooltip
              title="Add to Compare"
              placement="right"
              arrow
            >
              <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.7)] !text-gray-700 hover:!bg-[var(--bg-primary)] hover:!text-white group" >
                <IoGitCompareOutline className="text-[35px] !text-gray-700 group-hover:text-white " />
              </Button>
            </Tooltip>

            <Tooltip
              title="Add to Wishlist"
              placement="right"
              arrow
            >
              <Button className="heartBtn !w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.7)] text-gray-700 hover:!bg-[var(--bg-primary)] group">
                {/* <IoMdHeartEmpty className="text-[35px] !text-gray-700 group-hover:text-white  " /> */}
                <Checkbox {...label} icon={<IoMdHeartEmpty className="text-[25px] !text-gray-700 group-hover:text-white" />} checkedIcon={<IoMdHeart className="text-[25px]" />} disableRipple />
              </Button>
            </Tooltip>

          </div>
        </div>


        <div className="info px-3 py-1 border-t h-[100px]">
          <h6 className="text-[16px] font-bold text-[var(--text-dark)]">
            <Link to="/" className="link transition-all line-clamp-1">
              {props?.product?.brand}
            </Link>
          </h6>
          <h3 className="text-[14px] title mt-1 mb-1 text-[var(--text-light)]">
            <Link to={`/product/${props?.product?._id}`} className="link transition-all line-clamp-2">
              {props?.product?.name?.length > 30 ? `${props?.product?.name.substring(0, 70)}...` : props?.product?.name}
            </Link>
          </h3>


          <div className="flex items-center gap-2">
            <span className="price text-black text-[14px] font-bold flex items-center">
              ₹<span>{new Intl.NumberFormat('en-IN').format(`${props?.product?.price}`)}</span>
            </span>
            <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[12px] font-normal flex items-center">
              ₹<span>{new Intl.NumberFormat('en-IN').format(`${props?.product?.oldPrice}`)}</span>
            </span>
            <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">({props?.product?.discount}% OFF)</span>
          </div>
        </div>
        <div className="w-full h-[40px] px-3 mb-3">
          {
            isAdded === false ?
              <Button className="buttonPrimaryWhite w-full flex items-center justify-center shadow-md" onClick={() => addToCart(props?.product, context?.userData?._id, quantity)}><MdOutlineShoppingCart className="text-[16px]" />Add To Cart</Button>
              :
              <div className="flex items-center justify-between w-full h-full border border-red-400 rounded-md">
                <Button className="buttonPrimaryBlack !rounded-r-none !w-[40px] !min-w-[50px] !h-full flex items-center justify-center shadow-md" onClick={removeQty}><FiMinus className="text-[16px]" /></Button>
                <span className="w-full h-full flex items-center justify-center font-medium">{quantity}</span>
                <Button className="buttonPrimaryBlack !rounded-l-none !w-[40px] !min-w-[50px] !h-full flex items-center justify-center shadow-md" onClick={addQty}><FiPlus className="text-[16px]" /></Button>
              </div>
          }
        </div>

      </div>
    </div>
  );
};

ProductItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    brand: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    oldPrice: PropTypes.number,
    discount: PropTypes.number,
    rating: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default ProductItem;