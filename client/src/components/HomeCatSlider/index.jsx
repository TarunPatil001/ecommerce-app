// import React, { useRef, useState } from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";


// import required modules
import { Autoplay, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const HomeCatSlider = (props) => {
  return (
    <div className="homeCatSlider pt-4 py-8">
      <div className="container">
        <Swiper
          slidesPerView={7}
          spaceBetween={10}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseonmouseenter: true,
          }}
          // loop={true}
          navigation={true}
          modules={[Autoplay, Navigation]}
          className="mySwiper"
        >
          {
            props?.data?.map((item, index) => (
              <SwiperSlide key={index}>
                <Link to="/">
                  <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
                    <div className="img-box !w-full !h-[150px] rounded-lg">
                      <img
                        src={item?.images[0]}
                        alt="categoryImage"
                        className="scalable-image rounded-lg"
                      />
                    </div>
                    <h3 className="text-[15px] font-[500] mt-3 truncate w-40">Tablets</h3>
                  </div>
                </Link>
              </SwiperSlide>
            ))
          }


        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;
