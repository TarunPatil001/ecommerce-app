// import React from 'react'
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
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
            <div className="flex gap-3 sticky top-20 z-[99] stickyZoom">
                <div className="slider w-[15%] productDetailImageOptions">
                    <Swiper
                        ref={zoomSlideSml}
                        slidesPerView={5}
                        centeredSlides={true} // Ensures the active slide is centered
                        centeredSlidesBounds={true}
                        spaceBetween={10}
                        direction={"vertical"}
                        navigation={false}
                        modules={[Navigation]}
                        onSlideChange={onSlideChange}
                        className="zoomProductSliderThumbs h-[600px] overflow-hidden"
                    >

                        {
                            props?.images?.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <div className={`item rounded-md overflow-hidden cursor-pointer group ${slideIndex === index ? "opacity-1" : "opacity-30"}`} onClick={() => goto(index)} onMouseEnter={() => goto(index)}>
                                        <img src={image} alt="img" className="w-full transition-all group-hover:scale-105" />
                                    </div>
                                </SwiperSlide>

                            ))
                        }


                    </Swiper>
                </div>

                <div className="zoomContainer w-full h-[600px] max-w-[85%] mx-auto relative">
                    {/* <div className="w-full h-full border-red-400"> */}
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
        </>
    );
}

export default ProductZoom
