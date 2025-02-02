import React, { useContext } from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { IoGitCompareOutline } from "react-icons/io5";
import { BsArrowsFullscreen } from "react-icons/bs";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { Checkbox, Tooltip } from "@mui/material";
import ProductImageFlipChange from "./ImageChanger/ProductImageFlip";
import ProductImageOpacityChange from "./ImageChanger/ProductImageOpacity";
import { MyContext } from "../../App";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ProductItem = () => {

  const context = useContext(MyContext);

  return (
    <div className="transition-all duration-300 hover:shadow-xl rounded-md">
      <div className="productItem rounded-md overflow-hidden  border border-[rgba(80,80,80,0.07)]">
        <div className="group imgWrapper w-[100%] h-[250px] overflow-hidden  relative">

          <Link to="/productDetails/:id">

            {/* <ProductImageFlipChange firstImg={"https://prestashop.coderplace.com/PRS02/PRS02042/demo/320-large_default/hummingbird-printed-t-shirt.jpg"} SecondImg={"https://prestashop.coderplace.com/PRS02/PRS02042/demo/318-large_default/hummingbird-printed-t-shirt.jpg"} /> */}
            <ProductImageOpacityChange firstImg={"https://api.spicezgold.com/download/file_1734529474612_gespo-peach-solid-mandarin-collar-half-sleeve-casual-t-shirt-product-images-rvrtzhyumb-0-202304080900.webp"} SecondImg={"https://api.spicezgold.com/download/file_1734529474613_gespo-peach-solid-mandarin-collar-half-sleeve-casual-t-shirt-product-images-rvrtzhyumb-1-202304080900.jpg"} />

          </Link>
          <span className="discount flex items-center absolute top-[10px] left-[10px] z-50 bg-[var(--bg-primary)] text-white rounded-md p-1 text-[12px] font-medium">
            -10%
          </span>

          <span className=" px-1 flex items-center gap-1 absolute bottom-2 right-2 z-50 border rounded-sm text-[12px] bg-[rgba(255,255,255,0.8)]">
            <span className="flex items-center gap-1 font-semibold">4.1<Rating name="" defaultValue={1} max={1} readOnly className="!text-sm !text-[var(--rating-star-color)]" /></span>
            <span className="line !h-[10px] mx-0.5 !bg-[var(--text-light)]"></span>
            <span className="flex items-center gap-1 font-semibold">{new Intl.NumberFormat("en", { notation: "compact" }).format(500000).toLowerCase()}</span>
          </span>


          <div className="actions absolute top-[-200px] right-[0px] z-50 flex items-center gap-2 flex-col w-[80px] transition-all duration-500 group-hover:top-[15px] opacity-0 group-hover:opacity-100">
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
              title="View Product details"
              placement="right"
              arrow
            >
              <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.7)] !text-gray-700 hover:!bg-[var(--bg-primary)] hover:!text-white group"  onClick={()=>context.setOpenProductDetailsModal(true)}>
                <BsArrowsFullscreen className="text-[18px] !text-gray-700 group-hover:text-white" />
              </Button>
            </Tooltip>
            <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.7)] !text-gray-700 hover:!bg-[var(--bg-primary)] hover:!text-white group">
              <LiaExternalLinkAltSolid className="text-[35px] !text-gray-700 group-hover:text-white " />
            </Button>
          </div>
        </div>



        <div className="info px-3 py-1 border-t">
          <h6 className="text-[16px] font-bold text-[var(--text-dark)]">
            <Link to="/" className="link transition-all line-clamp-1">
              RARE RABBIT
            </Link>
          </h6>
          <h3 className="text-[14px] title mt-1 mb-1 text-[var(--text-light)]">
            <Link to="/" className="link transition-all line-clamp-1">
              Men Layer Regular Fit Spread Collar Cotton Shirt
            </Link>
          </h3>

          <div className="flex items-center gap-2">
            <span className="price text-black text-[14px] font-bold flex items-center">
              ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
            </span>
            <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[12px] font-normal flex items-center">
              ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
            </span>
            <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
