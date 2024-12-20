// import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import BannerBox from "../BannerBox";
import PropTypes from "prop-types";

const AdsBannerSlider = (props) => {
  return (
    <div className="py-5 w-full">
      <Swiper
        slidesPerView={props.items}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="smallBtn"
      >
        <SwiperSlide>
            <BannerBox img={'/banner1.jpg'} link={'/b1'}/>
        </SwiperSlide>
        <SwiperSlide>
            <BannerBox img={'/banner2.jpg'} link={'/b2'}/>
        </SwiperSlide>
        <SwiperSlide>
            <BannerBox img={'/banner3.jpg'} link={'/'}/>
        </SwiperSlide>
        <SwiperSlide>
            <BannerBox img={'/banner4.jpg'} link={'/'}/>
        </SwiperSlide>
        <SwiperSlide>
            <BannerBox img={'/banner4.jpg'} link={'/'}/>
        </SwiperSlide>
           
      </Swiper>
    </div>
  );
};

AdsBannerSlider.propTypes = {
    items: PropTypes.number.isRequired
}

export default AdsBannerSlider;
