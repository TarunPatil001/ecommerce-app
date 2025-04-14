// import React from 'react'
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useRef, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';

const ProductZoom = (props) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const zoomSlideBig = useRef(null);
    const zoomSlideSml = useRef(null);
    const [bgColor, setBgColor] = useState("#ffffff"); // Default background

    const [swiperInstance, setSwiperInstance] = useState(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    // Function to manually set the slide index when clicking on thumbnails
    const goto = (index) => {
        setSlideIndex(index);
        zoomSlideBig.current.swiper.slideTo(index); // Moves only the main swiper
    };


    const onSlideChange = () => {
        if (!zoomSlideBig.current?.swiper) return;

        const currentIndex = zoomSlideBig.current.swiper.realIndex;
        setSlideIndex(currentIndex);
    };


    // Function to extract the dominant color from the image
    const extractDominantColor = (imageSrc) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Prevent CORS issues for external images
        img.src = imageSrc;

        img.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            let r = 0, g = 0, b = 0, count = 0;
            for (let i = 0; i < pixels.length; i += 40) { // Sampling every 10th pixel for efficiency
                r += pixels[i];
                g += pixels[i + 1];
                b += pixels[i + 2];
                count++;
            }

            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            setBgColor(`rgb(${r}, ${g}, ${b})`);
        };
    };

    // Update background color when the slideIndex changes
    useEffect(() => {
        if (props?.images?.[slideIndex]) {
            extractDominantColor(props.images[slideIndex]);
        }
    }, [slideIndex, props.images]);

    const handleSlideChange = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    useEffect(() => {
        if (swiperInstance) {
            setIsBeginning(swiperInstance.isBeginning);
            setIsEnd(swiperInstance.isEnd);
        }
    }, [swiperInstance]);
    
    useEffect(() => {
        if (zoomSlideSml.current?.swiper && props?.images?.length > 0) {
            zoomSlideSml.current.swiper.slideTo(0, 0); // move thumbnail swiper to first slide
        }
    }, [props.images]);
    

    return (
        <>
            {/* <div className="flex flex-col-reverse lg:flex-row gap-3 "> */}
            <div className="flex flex-col-reverse lg:flex-row gap-3 sticky top-[170px] z-[99] stickyZoom">

                <div className="slider h-auto w-full lg:w-[10%] lg:min-w-[40px] lg:max-w-[80px] max-h-[560px] productDetailImageOptions  flex flex-row lg:flex-col items-center justify-center relative">
                    <Swiper
                        ref={zoomSlideSml}
                        centeredSlides={true}
                        centeredSlidesBounds={true}
                        slidesPerView={"auto"}
                        spaceBetween={6}
                        direction={typeof window !== "undefined" && window.innerWidth < 1024 ? "horizontal" : "vertical"}
                        navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
                        modules={[Navigation]}
                        onSwiper={setSwiperInstance}
                        onSlideChange={handleSlideChange}
                        className="zoomProductSliderThumbs absolute h-full overflow-hidden"
                    >
                        {props?.images?.map((image, index) => (
                            <SwiperSlide key={index} className="!w-[40px] !h-[40px] flex items-center justify-center">
                                <div
                                    className={`item w-[40px] h-[40px] p-0.5 border border-black rounded-md overflow-hidden cursor-pointer group ${slideIndex === index ? "opacity-1 border-4 !border-blue-700" : "opacity-50"}`}
                                    onClick={() => goto(index)}
                                    onMouseEnter={() => goto(index)}
                                >
                                    <img
                                        src={image}
                                        alt="img"
                                        className="w-full h-full object-cover transition-all rounded-md"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Conditionally show buttons */}
                    {props?.images?.length > 1 && (
                        <>
                            <div
                                className={`swiper-button-prev ${isBeginning ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                            ></div>
                            <div
                                className={`swiper-button-next ${isEnd ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                            ></div>

                        </>
                    )}
                </div>

                <div className="zoomContainer w-full h-auto max-w-full lg:max-w-[90%] max-h-[560px] mx-auto relative shadow rounded-md aspect-square">
                    <div className="w-full h-full border-red-400">
                        <Swiper
                            ref={zoomSlideBig}
                            slidesPerView={1}
                            spaceBetween={0}
                            onSlideChange={onSlideChange}
                            className="productZoomSwiper w-full h-full rounded-md"
                            style={{ backgroundColor: bgColor, transition: "background 0.5s ease" }}
                        >
                            {props?.images?.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <InnerImageZoom
                                        zoomType="hover"
                                        zoomPreload={true}
                                        hideCloseButton={true}
                                        fullscreenOnMobile={false}
                                        zoomScale={1}
                                        src={image}
                                        className="w-full h-full object-cover"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>

        </>
    );
};

ProductZoom.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of image URLs (strings)
    bgColor: PropTypes.string, // Background color (optional)
    goto: PropTypes.func.isRequired, // Function to change slide index
    onSlideChange: PropTypes.func, // Optional function for slide change event
    slideIndex: PropTypes.number, // Current slide index (optional)
};


export default ProductZoom;
