import React, { useContext, useEffect, useState } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { IoGitCompareOutline } from "react-icons/io5";
import { BsArrowsFullscreen } from "react-icons/bs";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { Checkbox, Tooltip } from "@mui/material";
import ProductImageOpacityChange from "./ImageChanger/ProductImageOpacity";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MyContext } from "../../App";
import { deleteData, postData } from "../../utils/api";
import toast from "react-hot-toast";


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ProductItemListView = (props) => {

  const context = useContext(MyContext);
  const [isAddedWishlist, setIsAddedWishlist] = useState(false);


  useEffect(() => {
    if (context?.userData !== null) {
      const isWishlistItem = context?.wishlistData?.filter((item) => item?.productId.includes(props?.product._id));
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
    <div className="transition-all duration-300 hover:shadow-xl rounded-md ">
      <div className="productItemListView rounded-md overflow-hidden  border border-[rgba(80,80,80,0.07)] flex items-center h-[230px]">
        <div className="group imgWrapper w-[25%] h-[230px] bg-gray-100 overflow-hidden relative">

          <Link to={`/product/${props?.product?._id}`} className="group">
            {/* <ProductImageFlipChange firstImg={"https://prestashop.coderplace.com/PRS02/PRS02042/demo/320-large_default/hummingbird-printed-t-shirt.jpg"} SecondImg={"https://prestashop.coderplace.com/PRS02/PRS02042/demo/318-large_default/hummingbird-printed-t-shirt.jpg"} /> */}
            <ProductImageOpacityChange firstImg={props?.product?.images?.[0]} SecondImg={props?.product?.images?.[1]} />
          </Link>


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
              <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.7)] !text-gray-700 hover:!bg-[var(--bg-primary)] hover:!text-white group">
                <IoGitCompareOutline className="text-[35px] !text-gray-700 group-hover:text-white " />
              </Button>
            </Tooltip>
          </div>

        </div>
          <Link to={`/product/${props?.product?._id}`} className="w-[75%]">
        <div className="info px-7 py-7  flex flex-col gap-2 group">
            <h6 className="text-[20px] font-bold">
              {props?.product?.brand}
            </h6>
            <h3 className="text-[20px] font-normal text-[#000] line-clamp-1 group-hover:text-[var(--bg-primary)] transition-all">
              {props?.product?.name?.length > 30 ? `${props?.product?.name.substring(0, 70)}...` : props?.product?.name}
            </h3>
            <p className="text-[16px] line-clamp-3">{props?.product?.description?.length > 30 ? `${props?.product?.description.substring(0, 150)}...` : props?.product?.description}</p>
            <div className="flex items-center gap-3 justify-between">
              <span className="flex items-center gap-3">
                <span className="price text-[var(--bg-dark)] text-[20px] font-bold">
                  <span className="rupee">₹</span>{new Intl.NumberFormat('en-IN').format(`${props?.product?.price}`)}
                </span>
                <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[18px] font-medium">
                  ₹<span>{new Intl.NumberFormat('en-IN').format(`${props?.product?.oldPrice}`)}</span>
                </span>
                <span className="uppercase text-[16px] text-[var(--off-color)] font-medium flex items-center gap-1">({props?.product?.discount}% OFF)</span>
              </span>
            </div>
        </div>
          </Link>
      </div>
    </div>
  );
};

export default ProductItemListView;
