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
import ProductImageFlipChange from "./ImageChanger/ProductImageFlip";
import ProductImageOpacityChange from "./ImageChanger/ProductImageOpacity";
import { MdOutlineShoppingCart } from "react-icons/md";


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ProductItemListView = () => {
  return (
    <div className="transition-all duration-300 hover:shadow-l">
      <div className="productItemListView rounded-md shadow-lg overflow-hidden border border-[rgba(0,0,0,0.05)] flex items-center">
        <div className="group imgWrapper w-[25%] h-[270px] overflow-hidden rounded-md relative">
          <Link to="/">

            {/* <ProductImageFlipChange firstImg={"https://prestashop.coderplace.com/PRS02/PRS02042/demo/320-large_default/hummingbird-printed-t-shirt.jpg"} SecondImg={"https://prestashop.coderplace.com/PRS02/PRS02042/demo/318-large_default/hummingbird-printed-t-shirt.jpg"} /> */}
            <ProductImageOpacityChange firstImg={"https://api.spicezgold.com/download/file_1734529474612_gespo-peach-solid-mandarin-collar-half-sleeve-casual-t-shirt-product-images-rvrtzhyumb-0-202304080900.webp"} SecondImg={"https://api.spicezgold.com/download/file_1734529474613_gespo-peach-solid-mandarin-collar-half-sleeve-casual-t-shirt-product-images-rvrtzhyumb-1-202304080900.jpg"} />

          </Link>
          <span className="discount flex items-center absolute top-[10px] left-[10px] z-50 bg-[var(--bg-primary)] text-white rounded-md p-1 text-[12px] font-medium">
            -10%
          </span>

          <div className="actions absolute top-[-200px] right-[0px] z-50 flex items-center gap-2 flex-col w-[80px] transition-all duration-500 group-hover:top-[15px] opacity-0 group-hover:opacity-100">
            <Tooltip
              title="Add to Wishlist"
              placement="right"
              arrow
              enterDelay={3000}
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
              enterDelay={3000}
            >
              <Button className="!w-[38px] !h-[38px] !min-w-[38px] !rounded-full !bg-[rgba(255,255,255,0.7)] !text-gray-700 hover:!bg-[var(--bg-primary)] hover:!text-white group">
                <IoGitCompareOutline className="text-[35px] !text-gray-700 group-hover:text-white " />
              </Button>
            </Tooltip>
            <Tooltip
              title="View Product details"
              placement="right"
              arrow
              enterDelay={3000}
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
        <div className="info px-7 py-7 w-[75%]">
          <h6 className="text-[15px]">
            <Link to="/" className="link transition-all line-clamp-1">
              RARE RABBIT
            </Link>
          </h6>
          <h3 className="text-[20px] title my-1  font-medium text-[#000]">
            <Link to="/" className="link transition-all py-2  line-clamp-2">
              Men Layer Regular Fit Spread Collar Cotton Shirt
            </Link>
          </h3>
          <p className="text-[14px] line-clamp-3 mb-3">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae, architecto, repudiandae rerum facere neque ullam quis eius facilis quas Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, odio tempore? Velit consectetur iste expedita debitis odit ipsa culpa alias! libero obcaecati explicabo nam officiis veniam! Distinctio minus quod animi sapiente!</p>
          <Rating className="mb-2" name="productRating" size="medium" defaultValue={2.5} precision={0.5} readOnly />
          <div className="flex items-center gap-3 justify-between">
            <span className="flex items-center gap-3">
              <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[16px] font-medium">
                <span className="rupee">₹</span>{new Intl.NumberFormat('en-IN').format(599)}
              </span>
              <span className="price text-[var(--bg-primary)] text-[20px] font-semibold">
                <span className="rupee">₹</span>{new Intl.NumberFormat('en-IN').format(499)}
              </span>
            </span>
            <Button className="buttonPrimaryBlack !text-[16px] flex items-center gap-1 !p-1.78"><MdOutlineShoppingCart className="text-[20px]"/>Add to Cart</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItemListView;
