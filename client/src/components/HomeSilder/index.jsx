// import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation, EffectFlip } from "swiper/modules";

const HomeSlider = (props) => {
  return (
    <div className="homeSlider py-4">
      <div className="container">
        <Swiper
          slidesPerView={1}
          centeredSlides={true}
          spaceBetween={10}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}

          navigation={true}
          modules={[Autoplay, Pagination, Navigation, EffectFlip]}
          className="sliderHome"
        >

          {
            props?.data?.length !== 0 && props?.data?.map((item, index) => {
              return (
                <SwiperSlide key={index}>

                  <div className="w-full h-[450px] item rounded-2xl overflow-hidden">

                    <img
                      src={item?.images[0]}
                      alt="Banner slide"
                      className="w-full h-full object-cover overflow-hidden"
                    />
                  </div>
                </SwiperSlide>

              )
            })
          }

        </Swiper>
      </div>
    </div>
  );
};

export default HomeSlider;
