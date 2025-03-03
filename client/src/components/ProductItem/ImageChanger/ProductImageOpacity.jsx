// import React from 'react'

import PropTypes from "prop-types";

const ProductImageOpacityChange = (props) => {
    return (
        <div className="h-full w-full flex items-center justify-center overflow-hidden relative">
            <img
                src={props?.firstImg}
                className="w-auto h-full"
            />
            <img
                src={props?.SecondImg}
                className="w-auto h-full absolute group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
            />
        </div>
    )
}

ProductImageOpacityChange.propTypes = {
    firstImg: PropTypes.string.isRequired,
    SecondImg: PropTypes.string.isRequired,
};

export default ProductImageOpacityChange
