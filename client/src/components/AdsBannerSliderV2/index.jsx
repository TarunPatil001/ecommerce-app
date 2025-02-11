// import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Navigation } from "swiper/modules";
import PropTypes from "prop-types";
import BannerBoxV2 from "../bannerBoxV2";

const AdsBannerSliderV2 = (props) => {
  return (
    <div className="py-5 w-full">
      <Swiper
        slidesPerView={props.items}
        spaceBetween={10}
        autoplay={{
          delay: props.timedelay,
          // disableOnInteraction: false,
        }}
        loop={true}
        // navigation={true}
        modules={[Autoplay, Navigation]}
        className="smallBtn"
      >

        {
          props?.data?.map((item, index) => (
            <SwiperSlide key={index}>
              <BannerBoxV2 info={item.alignInfo} image={item?.images[0]} heading={item?.bannerTitle} price={item.price} height={props.height} items={item} link={'/'} />
            </SwiperSlide>
          ))
        }

      </Swiper>
    </div>
  );
};

AdsBannerSliderV2.propTypes = {
  items: PropTypes.number.isRequired,
  timedelay: PropTypes.number.isRequired,
  height: PropTypes.number
}

export default AdsBannerSliderV2;
