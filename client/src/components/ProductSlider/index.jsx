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

const ProductSlider = (props) => {
  return (
    <section className="productSlider py-3">
      {/* <div className="container"> */}
      <Swiper
        slidesPerView={props.items}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper h-full"
      >
        {props?.data?.map((product, index) => (
          <SwiperSlide key={index} className="!h-full">
            <div className="h-full flex">
              <ProductItem product={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* </div> */}
    </section>
  );
};

ProductSlider.propTypes = {
  items: PropTypes.number.isRequired,
};

export default ProductSlider;
