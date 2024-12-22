// import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';

const HomeBannerV2 = () => {
    return (
        <Swiper
            spaceBetween={30}
            effect={"fade"}
            loop={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }}
            navigation={true}
            pagination={{
                clickable: true,
                dynamicBullets: true,
            }}
            modules={[EffectFade, Autoplay, Navigation, Pagination]}
            className="homeSliderV2"
        >
            <SwiperSlide>
                <div className="item w-full rounded-md overflow-hidden relative">
                    <div className="h-[500px]">
                        <img src="https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_imageslider/views/img/sample-1.jpg" className="h-[500px] object-cover" />
                    </div>

                    <div className="info absolute top-0 -right-[100%] opacity-0 w-[50%] h-[100%] z-50 p-8 flex flex-col items-start justify-center gap-4 transition-all duration-700">
                        <h4 className="text-[20px] font-medium w-full mb-3 relative -right-[100%] opacity-0">Big Saving Days Sale</h4>
                        <h2 className="text-[35px] font-semibold w-full relative -right-[100%] opacity-0 line-clamp-2">Women Solid Round Green T-Shirt</h2>
                        <h3 className="text-[20px] font-medium w-full flex items-center gap-2 relative -right-[100%] opacity-0">Starting At Only <span className="!text-[var(--bg-primary)] text-[30px] font-bold"><span className="rupee">₹</span>{new Intl.NumberFormat('en-IN').format(499)}</span></h3>
                        <div className="w-full relative -right-[100%] opacity-0 btn_">
                            <Link to="/">
                                <Button className="!text-white !bg-[var(--bg-primary)] hover:!bg-[#000] !text-lg !px-5 !py-3 top-5" size="large">Shop Now</Button>
                            </Link>
                        </div>
                    </div>

                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="item w-full rounded-md overflow-hidden relative">
                    <div className="h-[500px]">
                        <img src="https://demos.codezeel.com/prestashop/PRS21/PRS210502/modules/cz_imageslider/views/img/sample-2.jpg" className="h-[500px] object-cover" />
                    </div>
                    <div className="info absolute top-0 -right-[100%] opacity-0 w-[50%] h-[100%] z-50 p-8 flex flex-col items-start justify-center gap-4 transition-all duration-700">
                        <h4 className="text-[20px] font-medium w-full mb-3 relative -right-[100%] opacity-0">Big Saving Days Sale</h4>
                        <h2 className="text-[35px] font-semibold w-full relative -right-[100%] opacity-0">Buy Modern Chair In Black Color</h2>
                        <h3 className="text-[20px] font-medium w-full flex items-center gap-2 relative -right-[100%] opacity-0">Starting At Only <span className="!text-[var(--bg-primary)] text-[30px] font-bold"><span className="rupee">₹</span>{new Intl.NumberFormat('en-IN').format(1499)}</span></h3>
                        <div className="w-full relative -right-[100%] opacity-0 btn_">
                            <Link to="/">
                                <Button className="!text-white !bg-[var(--bg-primary)] hover:!bg-[#000] !text-lg !px-5 !py-3 top-5" size="large">Shop Now</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    );
};

export default HomeBannerV2;
