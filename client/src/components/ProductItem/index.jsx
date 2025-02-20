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
import { deleteData, editData, fetchDataFromApi, postData } from "../../utils/api";
import toast from "react-hot-toast";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ProductItem = (props) => {

  const context = useContext(MyContext);
  const [isAddedWishlist, setIsAddedWishlist] = useState(false);


  useEffect(() => {
    if (context?.userData !== null && Array.isArray(context?.wishlistData)) {
      const isWishlistItem = context.wishlistData.filter((item) => 
        item?.productId?.includes(props?.product._id)
      );
  
      setIsAddedWishlist(isWishlistItem.length > 0); // Set to true if the item exists in the wishlist
    } else {
      setIsAddedWishlist(false); 
    }
  }, [context?.wishlistData, props.product._id, context?.userData]);
  

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
    <div className="transition-all duration-300 hover:shadow-xl rounded-md">
      <div className="productItem rounded-md overflow-hidden  border border-[rgba(80,80,80,0.07)]">
        <div className="group imgWrapper w-[100%] h-[250px] overflow-hidden  relative bg-gray-100">

          <Link to={props?.product?._id ? `/product/${props.product._id}` : '#'} className="cursor-default">


            {/* <ProductImageFlipChange firstImg={"https://prestashop.coderplace.com/PRS02/PRS02042/demo/320-large_default/hummingbird-printed-t-shirt.jpg"} SecondImg={"https://prestashop.coderplace.com/PRS02/PRS02042/demo/318-large_default/hummingbird-printed-t-shirt.jpg"} /> */}
            <ProductImageOpacityChange firstImg={props?.product?.images?.[0]} SecondImg={props?.product?.images?.[1]} />

          </Link>
          {/* -{props?.product?.discount}% */}

          <span className="flex items-center absolute top-[0px] left-[0px] z-50 rounded-md">
            {/* <Tooltip
              title="Add to Wishlist"
              placement="right"
              arrow
            > */}
              <Checkbox
                icon={
                  <div className="relative">
                    <IoMdHeart className="text-[35px] text-[rgba(0,0,0,0.3)]" />
                    <IoMdHeartEmpty className="text-[35px] text-white absolute inset-0 transition-opacity duration-300" />
                  </div>
                }
                checkedIcon={
                  <div className="relative">
                    <IoMdHeart className="text-[35px] text-red-500" />
                    <IoMdHeartEmpty className="text-[35px] text-white absolute inset-0 transition-opacity duration-300" />
                  </div>
                }
                checked={isAddedWishlist}
                onChange={() => handleAddToMyList(props?.product)}
                disableRipple
              />

            {/* </Tooltip> */}

          </span>

          <span className=" px-1 flex items-center gap-1 absolute bottom-2 right-2 z-50 border rounded-sm text-[12px] bg-[rgba(255,255,255,0.8)]">
            <span className="flex items-center gap-1 font-semibold">{props?.product?.rating}<Rating name="" defaultValue={1} max={1} readOnly className="!text-sm !text-[var(--rating-star-color)]" /></span>
            <span className="line !h-[10px] mx-0.5 !bg-[var(--text-light)]"></span>
            <span className="flex items-center gap-1 font-semibold">{new Intl.NumberFormat("en", { notation: "compact" }).format(500000).toLowerCase()}</span>
          </span>

          {!props?.fromWishlist && (
          <div className="actions absolute top-[-200px] right-[0px] z-50 flex items-center gap-2 flex-col w-[80px] transition-all duration-500 group-hover:top-[15px] opacity-0 group-hover:opacity-100">

            <Tooltip
              title="View Product details"
              placement="right"
              arrow
            >
              <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.9)] !text-gray-700 hover:!bg-[var(--bg-primary)] hover:!text-white group" onClick={() => context.handleOpenProductDetailsModal(true, props?.product)}>
                <BsArrowsFullscreen className="text-[18px] !text-gray-700 group-hover:text-white" />
              </Button>
            </Tooltip>

            <Tooltip
              title="Add to Compare"
              placement="right"
              arrow
            >
              <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.9)] !text-gray-700 hover:!bg-[var(--bg-primary)] hover:!text-white group" >
                <IoGitCompareOutline className="text-[35px] !text-gray-700 group-hover:text-white " />
              </Button>
            </Tooltip>
          </div>
          )}
        </div>


        <div className="info px-3 py-1 border-t h-[100px]">
          <h6 className="text-[16px] font-bold text-[var(--text-dark)]">
            <Link to="#" className="link transition-all line-clamp-1">
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
        {/* <div className="w-full h-[40px] px-3 mb-3">
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
        </div> */}

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