// import React from "react";
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
import { TbRosetteDiscountFilled } from "react-icons/tb";
import { BiSolidDiscount } from "react-icons/bi";


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ProductItemListView = () => {
  return (
    <div className="transition-all duration-300 hover:shadow-xl rounded-md">
      <div className="productItemListView rounded-md overflow-hidden  border border-[rgba(80,80,80,0.07)] flex items-center h-[230px]">
        <div className="group imgWrapper w-[25%] h-[230px] overflow-hidden relative">
          <Link to="/">

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
              <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.7)] !text-gray-700 hover:!bg-[var(--bg-primary)] hover:!text-white group">
                <IoGitCompareOutline className="text-[35px] !text-gray-700 group-hover:text-white " />
              </Button>
            </Tooltip>
            <Tooltip
              title="View Product details"
              placement="right"
              arrow
            >
              <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.7)] !text-gray-700 hover:!bg-[var(--bg-primary)] hover:!text-white group">
                <BsArrowsFullscreen className="text-[18px] !text-gray-700 group-hover:text-white" />
              </Button>
            </Tooltip>
            <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.7)] !text-gray-700 hover:!bg-[var(--bg-primary)] hover:!text-white group">
              <LiaExternalLinkAltSolid className="text-[35px] !text-gray-700 group-hover:text-white " />
            </Button>
          </div>
        </div>
        <div className="info px-7 py-7 w-[75%] flex flex-col gap-2">
          <h6 className="text-[20px] font-bold">
            <Link to="/" className="link transition-all line-clamp-1">
              RARE RABBIT
            </Link>
          </h6>
          <h3 className="text-[20px] font-normal text-[#000] line-clamp-1">
            <Link to="/" className="link transition-all">
              Men Layer Regular Fit Spread Collar Cotton Shirt
            </Link>
          </h3>
          <p className="text-[16px] line-clamp-3">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae, architecto, repudiandae rerum facere neque Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex quae nobis error, esse sed obcaecati voluptates consequatur qui nostrum sint. ullam quis eius facilis quas Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, odio tempore? Velit consectetur iste expedita debitis odit ipsa culpa alias! libero obcaecati explicabo nam officiis veniam! Distinctio minus quod animi sapiente!</p>
          <div className="flex items-center gap-3 justify-between">
            <span className="flex items-center gap-3">
              <span className="price text-[var(--bg-dark)] text-[20px] font-bold">
                <span className="rupee">₹</span>{new Intl.NumberFormat('en-IN').format(499)}
              </span>
              <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[18px] font-medium">
                ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
              </span>
              <span className="uppercase text-[16px] text-[var(--off-color)] font-medium flex items-center gap-1">(17% OFF)</span>
            </span>
            <Button className="buttonPrimaryBlack !text-[16px] flex items-center gap-1 !p-1.78"><MdOutlineShoppingCart className="text-[20px]" />Add to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItemListView;
