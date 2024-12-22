// import React from 'react'
import { Link } from "react-router-dom"
import "./styles.css"
import PropTypes from "prop-types";

const BannerBoxV2 = (props) => {
  return (
    <div className="bannerBoxV2 w-[482px] overflow-hidden rounded-md h-[240px] group relative">
      <img src={props.image} alt="side banner"  className="w-[482px] h-[240px] object-cover group-hover:scale-105 transition-all duration-500"/>

      <div className={`info absolute top-0 ${props.info==="left"?'left-0 pl-8':'right-0 '} w-[50%] h-[100%] z-50 flex flex-col justify-center`}>
        <h2 className="text-[24px] font-medium line-clamp-2">{props.heading}</h2>
        <span className="!text-[var(--bg-primary)] text-[20px] font-bold"><span className="rupee">₹</span>{new Intl.NumberFormat('en-IN').format(4999)}</span>
        <Link to="/" className="underline hover:no-underline font-medium">
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
  };

export default BannerBoxV2
