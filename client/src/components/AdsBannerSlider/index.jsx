// import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Navigation } from "swiper/modules";
import BannerBox from "../BannerBox";
import PropTypes from "prop-types";

const AdsBannerSlider = ({ items, timedelay, images, showNavigation = false }) => {
  return (
    <div className="py-5 w-full">
      <Swiper
        slidesPerView={items}
        spaceBetween={10}
        autoplay={{
          delay: timedelay,
          disableOnInteraction: false,
        }}
        loop={true}
        navigation={showNavigation}
        modules={[Autoplay, Navigation]}
        className="smallBtn"
      >
        <SwiperSlide>
            <BannerBox img={'https://i.ytimg.com/vi/RF2ywPBi4RM/maxresdefault.jpg'} link={'/'}/>
        </SwiperSlide>
        
        <SwiperSlide>
            <BannerBox img={'https://styleoutwatches.com/cdn/shop/articles/The_Future_of_Luxury_Watches-_Trends_for_2025_and_Beyond_1024x1024.jpg?v=1725268526'} link={'/'}/>
        </SwiperSlide>
        
        <SwiperSlide>
            <BannerBox img={'https://cdn.wccftech.com/wp-content/uploads/2023/12/First-18-inch-mini-LED-1.png'} link={'/'}/>
        </SwiperSlide>
        
        <SwiperSlide>
            <BannerBox img={'https://www.yatra.com/ythomepagecms/media/todayspick/2024/Aug/9c12339dd9b60b390524ffc7957636cc.jpg'} link={'/'}/>
        </SwiperSlide>

        <SwiperSlide>
            <BannerBox img={'https://i.ytimg.com/vi/RF2ywPBi4RM/maxresdefault.jpg'} link={'/'}/>
        </SwiperSlide>
        
        <SwiperSlide>
            <BannerBox img={'https://styleoutwatches.com/cdn/shop/articles/The_Future_of_Luxury_Watches-_Trends_for_2025_and_Beyond_1024x1024.jpg?v=1725268526'} link={'/'}/>
        </SwiperSlide>
        
        <SwiperSlide>
            <BannerBox img={'https://cdn.wccftech.com/wp-content/uploads/2023/12/First-18-inch-mini-LED-1.png'} link={'/'}/>
        </SwiperSlide>
        
        <SwiperSlide>
            <BannerBox img={'https://www.yatra.com/ythomepagecms/media/todayspick/2024/Aug/9c12339dd9b60b390524ffc7957636cc.jpg'} link={'/'}/>
        </SwiperSlide>
        
      </Swiper>
    </div>
  );
};

AdsBannerSlider.propTypes = {
  items: PropTypes.number.isRequired,
  timedelay: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  showNavigation: PropTypes.bool,
};

export default AdsBannerSlider;