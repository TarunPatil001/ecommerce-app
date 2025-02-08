// import React from 'react'
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { useRef, useState } from 'react';
// import { Link } from "react-router-dom";


const ProductZoom = (props) => {

    const [slideIndex, setSlideIndex] = useState(0);
    const zoomSlideBig = useRef(null);
    const zoomSlideSml = useRef(null);

    // Function to manually set the slide index when clicking on thumbnails
    const goto = (index) => {
        setSlideIndex(index);
        zoomSlideSml.current.swiper.slideTo(index);
        zoomSlideBig.current.swiper.slideTo(index);
    };

    const onSlideChange = () => {
        if (!zoomSlideBig.current?.swiper || !zoomSlideSml.current?.swiper) return; // 🔥 Prevent null access

        const currentIndex = zoomSlideBig.current.swiper.realIndex;
        setSlideIndex(currentIndex);
        zoomSlideSml.current.swiper.slideTo(currentIndex);
    };


    return (
        <>
            <div className="flex gap-3 sticky top-20 z-[99] stickyZoom h-[500px] w-auto">
                <div className="slider w-[10%] productDetailImageOptions flex flex-col items-center justify-center relative py-9">
                    <Swiper
                        ref={zoomSlideSml}
                        centeredSlides={"true"}
                        centeredSlidesBounds={"true"}
                        slidesPerView={"auto"}
                        spaceBetween={10}
                        direction={"vertical"}
                        navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }} // 👈 Define navigation elements
                        modules={[Navigation, Autoplay]}
                        className="zoomProductSliderThumbs absolute h-full overflow-hidden"
                    >
                        {props?.images?.map((image, index) => (
                            <SwiperSlide key={index} className='!w-[40px] !h-[40px]'>
                                <div
                                    className={`item !w-[40px] !h-[40px] p-0.5 border border-black rounded-md overflow-hidden cursor-pointer group ${slideIndex === index ? "opacity-1 border-2 !border-blue-600" : "opacity-30"}`}
                                    onClick={() => goto(index)} onMouseEnter={() => goto(index)}
                                >
                                    <img src={image} alt="img" className="w-full h-full object-cover transition-all rounded-md" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Swiper Navigation Buttons (Must be outside Swiper but inside the container) */}
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-button-next"></div>
                </div>


                <div className="zoomContainer w-full h-full max-w-[90%] mx-auto relative shadow rounded-md">
                    <div className="w-full h-full border-red-400">
                        <Swiper
                            ref={zoomSlideBig}
                            slidesPerView={1}
                            spaceBetween={0}
                            onSlideChange={onSlideChange}
                            className="productZoomSwiper w-full h-full rounded-md"
                        >


                            {
                                props?.images?.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <InnerImageZoom
                                            zoomType="hover"
                                            zoomPreload={true}
                                            hideCloseButton={true}
                                            fullscreenOnMobile={false}
                                            zoomScale={1}
                                            src={image}
                                            className="w-full h-full object-cover" // Ensure image covers the container while maintaining aspect ratio
                                        />
                                    </SwiperSlide>

                                ))}

                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductZoom