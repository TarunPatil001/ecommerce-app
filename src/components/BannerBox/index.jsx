// import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const BannerBox = (props) => {
  return (
    <div className="box bannerBox img-box rounded-lg w-full">
      <Link to={props.link}>
        <img src={props.img} alt="banner" className="scalable-image" />
      </Link>
    </div>
  );
};

// Props validation
BannerBox.propTypes = {
    link: PropTypes.string.isRequired, // Ensures 'link' is required and should be a string
    img: PropTypes.string.isRequired, // Ensures 'img' is required and should be a string
};

export default BannerBox;
