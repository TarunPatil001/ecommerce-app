// import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { IoGitCompareOutline } from "react-icons/io5";
import { BsArrowsFullscreen } from "react-icons/bs";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { IoMdHeartEmpty } from "react-icons/io";
import { Tooltip } from "@mui/material";

const ProductItem = () => {
  return (
    <div className="productItem rounded-md shadow-lg overflow-hidden border border-1 border-[rgba(0,0,0,0.1)]">
      <div className="group imgWrapper w-[100%] h-[250px] overflow-hidden rounded-md relative">
        <Link to="/">
          <div className="h-[250px] overflow-hidden">
            <img
              src="https://api.spicezgold.com/download/file_1734529474612_gespo-peach-solid-mandarin-collar-half-sleeve-casual-t-shirt-product-images-rvrtzhyumb-0-202304080900.webp"
              alt="product image"
              className="w-full"
            />
            <img
              src="https://api.spicezgold.com/download/file_1734529474613_gespo-peach-solid-mandarin-collar-half-sleeve-casual-t-shirt-product-images-rvrtzhyumb-1-202304080900.jpg"
              alt="product image"
              className="w-full absolute top-0 left-0 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
            />
          </div>
        </Link>
        <span className="discount flex items-center absolute top-[10px] left-[10px] z-50 bg-primary text-white rounded-md p-1 text-[12px] font-medium">
          -10%
        </span>

        <div className="actions absolute top-[-200px] right-[0px] z-50 flex items-center gap-2 flex-col w-[80px] transition-all duration-500 group-hover:top-[15px] opacity-0 group-hover:opacity-100">
          <Tooltip
            title="Add to Wishlist"
            placement="right"
            arrow
            enterDelay={3000}
          >
            <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-white text-black hover:!bg-primary hover:!text-white group">
              <IoMdHeartEmpty className="text-[35px] !text-black group-hover:text-white " />
            </Button>
          </Tooltip>
          <Tooltip
            title="Add to Compare"
            placement="right"
            arrow
            enterDelay={3000}
          >
            <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.9)] !text-black hover:!bg-primary hover:!text-white group">
              <IoGitCompareOutline className="text-[35px] !text-black group-hover:text-white " />
            </Button>
          </Tooltip>
          <Tooltip
            title="View Product details"
            placement="right"
            arrow
            enterDelay={3000}
          >
            <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.9)] !text-black hover:!bg-primary hover:!text-white group">
              <BsArrowsFullscreen className="text-[18px] !text-black group-hover:text-white" />
            </Button>
          </Tooltip>
          <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.9)] !text-black hover:!bg-primary hover:!text-white group">
            <LiaExternalLinkAltSolid className="text-[35px] !text-black group-hover:text-white " />
          </Button>
        </div>
      </div>
      <div className="info p-3 py-5">
        <h6 className="text-[13px]">
          <Link to="/" className="link transition-all">
            RARE RABBIT
          </Link>
        </h6>
        <h3 className="text-[13px] title mt-1 font-medium mb-1 text-[#000]">
          <Link to="/" className="link transition-all">
            Men Layer Regular Fit Spread Collar Cotton Shirt
          </Link>
        </h3>
        <Rating name="size-small" defaultValue={2.5} precision={0.5} readOnly />
        <div className="flex items-center gap-3">
          <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[14px] font-medium">
            ₹58.00
          </span>
          <span className="price text-primary text-[17px] font-semibold">
            ₹58.00
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
