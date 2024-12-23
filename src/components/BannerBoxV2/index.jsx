// import React from 'react'
import { Link } from "react-router-dom"
import "./styles.css"
import PropTypes from "prop-types";

const BannerBoxV2 = (props) => {
  return (
    <div className={`bannerBoxV2 ${props.height ? `!h-[${props.height}px]` : "!h-[240px]"} !w-full img-box overflow-hidden rounded-md group relative`}>
      <img src={props.image} alt="side banner"  className="scalable-image"/>

      <div className={`info absolute top-0 ${props.info==="left"?'left-0 pl-8 pr-2':'right-0 pl-4 p-4'} ${props.items <= 2 ? "!pl-14" : "!pl-8"} w-[50%] h-[100%] z-50 flex flex-col justify-center`}>
      <h2 className={`${props.items >= 4 ? "text-[17px]" : "text-[24px]"} font-medium line-clamp-2`}>{props.heading}</h2>
        <span className={`!text-[var(--bg-primary)]  font-bold ${props.items <= 3 ? "text-[22px]" : "text-[20px]"}`}><span className="rupee">₹</span>{new Intl.NumberFormat('en-IN').format(props.price)}</span>
        <Link to="/" className={`underline hover:no-underline font-medium ${props.items <= 3 ? "text-[18px]" : "text-[16px]"}`}>
            Shop Now
        </Link>
      </div>
    </div>
  )
}

// PropTypes definition
BannerBoxV2.propTypes = {
    image: PropTypes.string.isRequired, // image is required and should be a string
    info: PropTypes.string.isRequired, // info is required and should be a string
    heading: PropTypes.string.isRequired, // heading is required and should be a string
    price: PropTypes.number.isRequired, // heading is required and should be a string
    height: PropTypes.number, // height is optional and should be a number
    items: PropTypes.number // height is optional and should be a number
  };

export default BannerBoxV2
