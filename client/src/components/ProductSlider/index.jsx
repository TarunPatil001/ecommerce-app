// import React from 'react'

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Navigation } from "swiper/modules";
import PropTypes from "prop-types";
import ProductItem from "../ProductItem";
import { useContext } from "react";
import { MyContext } from "../../App";

const ProductSlider = (props) => {
  const context = useContext(MyContext);

  return (
    <section className="productSlider py-3 pt-1">
      {/* <div className="container"> */}
      <Swiper
        slidesPerView={props.items}
        spaceBetween={5}
        navigation={context?.windowWidth > 768}
        modules={[Navigation]}
        className="mySwiper h-full w-full"
      >
        {props?.data?.map((product, index) => (
          <SwiperSlide key={index}>
            {/* <div className="h-full w-full flex"> */}
              <ProductItem product={product} />
            {/* </div> */}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* </div> */}
    </section>
  );
};

ProductSlider.propTypes = {
  items: PropTypes.number.isRequired, // Number of slides per view
  data: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of product objects
};


export default ProductSlider;
