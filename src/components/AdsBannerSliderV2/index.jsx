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
        <SwiperSlide>
            <BannerBoxV2 info="left" image={"https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-1.jpg"} heading={"Samsung Gear VR Camera"} price={7999} height={props.height} items={props.items} link={'/'}/>
        </SwiperSlide>
        
        <SwiperSlide>
            <BannerBoxV2 info="right" image={"https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-3.jpg"} heading={"Noise Wireless Headphones"} price={1499} height={props.height} items={props.items} link={'/'}/>
        </SwiperSlide>
        
        <SwiperSlide>
            <BannerBoxV2 info="left" image={"https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-4.jpg"} heading={"Armchair Mad By shopstic"} price={5499} height={props.height} items={props.items} link={'/b1'}/>
        </SwiperSlide>
        
        <SwiperSlide>
            <BannerBoxV2 info="right" image={"https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-1.jpg"} heading={"S22 Samsung Smartphone"} price={2499} height={props.height} items={props.items} link={'/b2'}/>
        </SwiperSlide>

        <SwiperSlide>
            <BannerBoxV2 info="left" image={"https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-1.jpg"} heading={"Samsung Gear VR Camera"} price={7999} height={props.height} items={props.items} link={'/'}/>
        </SwiperSlide>
        
        <SwiperSlide>
            <BannerBoxV2 info="right" image={"https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-3.jpg"} heading={"Noise Wireless Headphones"} price={1499} height={props.height} items={props.items} link={'/'}/>
        </SwiperSlide>
        
        <SwiperSlide>
            <BannerBoxV2 info="left" image={"https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-4.jpg"} heading={"Armchair Mad By shopstic"} price={5499} height={props.height} items={props.items} link={'/b1'}/>
        </SwiperSlide>
        
        <SwiperSlide>
            <BannerBoxV2 info="right" image={"https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/cms-banner-1.jpg"} heading={"S22 Samsung Smartphone"} price={2499} height={props.height} items={props.items} link={'/b2'}/>
        </SwiperSlide>

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
