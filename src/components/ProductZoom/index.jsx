// import React from 'react'
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import { useRef, useState } from 'react';
// import { Link } from "react-router-dom";


const ProductZoom = () => {

    const [sildeIndex, setSlideIndex] = useState(0);
    const zoomSlideBig = useRef();
    const zoomSlideSml = useRef();

    const goto = (index) => {
        setSlideIndex(index);
        zoomSlideSml.current.swiper.slideTo(index);
        zoomSlideBig.current.swiper.slideTo(index);
    }

    return (
        <>
            <div className="flex gap-3 sticky top-20 z-[99] stickyZoom">
                <div className="slider w-[15%] productDetailImageOptions">
                    <Swiper
                        ref={zoomSlideSml}
                        slidesPerView={5}
                        // centeredSlides={true}
                        spaceBetween={10}
                        direction={"vertical"}
                        navigation={true}
                        modules={[Navigation]}
                        className="zoomProductSliderThumbs h-[600px] overflow-hidden"
                    >
                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group ${sildeIndex === 0 ? "opacity-1" : "opacity-30"}`} onClick={() => goto(0)}>
                                <img src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/z3UAG5L0_e6cd3d86e0ec4ecfbd0d275b4651a52d.jpg" alt="img" className="w-full transition-all group-hover:scale-105" />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group ${sildeIndex === 1 ? "opacity-1" : "opacity-30"}`} onClick={() => goto(1)}>
                                <img src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/oVVmjA9k_c2cbde379fee4d2a8df7ba5b2675c151.jpg" alt="img" className="w-full transition-all group-hover:scale-105" />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group ${sildeIndex === 2 ? "opacity-1" : "opacity-30"}`} onClick={() => goto(2)}>
                                <img src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/Ll9f5oK5_cb9b052d790544db81169ff1f74e2858.jpg" alt="img" className="w-full transition-all group-hover:scale-105" />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group ${sildeIndex === 3 ? "opacity-1" : "opacity-30"}`} onClick={() => goto(3)}>
                                <img src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/Pr3HFMT1_fc5b89183e554cf4af0755a87b0ac8d4.jpg" alt="img" className="w-full transition-all group-hover:scale-105" />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group ${sildeIndex === 4 ? "opacity-1" : "opacity-30"}`} onClick={() => goto(4)}>
                                <img src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/28044696/2024/7/19/4014fe66-c567-4adc-b965-081fb17dbdb41721374973991-Libas-Floral-Printed-Mandarin-Collar-A-Line-Kurti-4817213749-7.jpg" alt="img" className="w-full transition-all group-hover:scale-105" />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={`item rounded-md overflow-hidden cursor-pointer group ${sildeIndex === 5 ? "opacity-1" : "opacity-30"}`} onClick={() => goto(5)}>
                                <img src="https://rukminim1.flixcart.com/image/1664/1664/xif0q/kurta/8/u/0/s-sa19kr1353m-surhi-original-imah78urfwrvcsta.jpeg" alt="img" className="w-full transition-all group-hover:scale-105" />
                            </div>
                        </SwiperSlide>

                    </Swiper>
                </div>

                <div className="zoomContainer w-full h-[600px] max-w-[85%] mx-auto relative">
                    {/* <div className="w-full h-full border-red-400"> */}
                        <Swiper
                            ref={zoomSlideBig}
                            slidesPerView={1}
                            spaceBetween={0}
                            className="productZoomSwiper w-full h-full rounded-md"
                        >
                            <SwiperSlide>
                                {/* <div className="w-full h-full "> */}
                                    <InnerImageZoom
                                        zoomType="hover"
                                        zoomPreload={true}
                                        hideCloseButton={true}
                                        fullscreenOnMobile={false}
                                        zoomScale={1}
                                        src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/z3UAG5L0_e6cd3d86e0ec4ecfbd0d275b4651a52d.jpg"
                                        className="w-full h-full object-cover" // Ensure image covers the container while maintaining aspect ratio
                                    />
                                {/* </div> */}
                            </SwiperSlide>

                            <SwiperSlide>
                                {/* <div className="w-full h-full relative"> */}
                                    <InnerImageZoom
                                        zoomType="hover"
                                        zoomPreload={true}
                                        hideCloseButton={true}
                                        fullscreenOnMobile={false}
                                        zoomScale={1}
                                        src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/oVVmjA9k_c2cbde379fee4d2a8df7ba5b2675c151.jpg"
                                        className="w-full h-full object-cover"
                                    />
                                {/* </div> */}
                            </SwiperSlide>

                            <SwiperSlide>
                                {/* <div className="w-full h-full relative"> */}
                                    <InnerImageZoom
                                        zoomType="hover"
                                        zoomPreload={true}
                                        hideCloseButton={true}
                                        fullscreenOnMobile={false}
                                        zoomScale={1}
                                        src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/Ll9f5oK5_cb9b052d790544db81169ff1f74e2858.jpg"
                                        className="w-full h-full object-cover"
                                    />
                                {/* </div> */}
                            </SwiperSlide>

                            <SwiperSlide>
                                {/* <div className="w-full h-full relative"> */}
                                    <InnerImageZoom
                                        zoomType="hover"
                                        zoomPreload={true}
                                        hideCloseButton={true}
                                        fullscreenOnMobile={false}
                                        zoomScale={1}
                                        src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/Pr3HFMT1_fc5b89183e554cf4af0755a87b0ac8d4.jpg"
                                        className="w-full h-full object-cover"
                                    />
                                {/* </div> */}
                            </SwiperSlide>
                            <SwiperSlide>
                                {/* <div className="w-full h-full relative"> */}
                                    <InnerImageZoom
                                        zoomType="hover"
                                        zoomPreload={true}
                                        hideCloseButton={true}
                                        fullscreenOnMobile={false}
                                        zoomScale={1}
                                        src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/28044696/2024/7/19/4014fe66-c567-4adc-b965-081fb17dbdb41721374973991-Libas-Floral-Printed-Mandarin-Collar-A-Line-Kurti-4817213749-7.jpg"
                                        className="w-full h-full object-cover"
                                    />
                                {/* </div> */}
                            </SwiperSlide>
                            <SwiperSlide>
                                {/* <div className="w-full h-full relative"> */}
                                    <InnerImageZoom
                                        zoomType="hover"
                                        zoomPreload={true}
                                        hideCloseButton={true}
                                        fullscreenOnMobile={false}
                                        zoomScale={1}
                                        src="https://rukminim1.flixcart.com/image/1664/1664/xif0q/kurta/8/u/0/s-sa19kr1353m-surhi-original-imah78urfwrvcsta.jpeg"
                                        className="w-full h-full object-cover"
                                    />
                                {/* </div> */}
                            </SwiperSlide>
                        </Swiper>
                    {/* </div> */}
                </div>
            </div>
        </>
    );
}

export default ProductZoom
