import React, { useContext, useEffect, useRef, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { fetchDataFromApi } from "../../utils/api";
import { Link, useParams } from "react-router-dom";
import { RiStarSFill } from "react-icons/ri";
import { Button, Rating } from "@mui/material";
import { MyContext } from "../../App";


const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000); // Convert milliseconds to seconds

    if (diff < 0) return "Just now"; // Prevents negative time differences
    if (diff < 60) return `${diff} sec${diff !== 1 ? 's' : ''} ago`;

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
};



const ProductDetails = () => {

    const context = useContext(MyContext);
    const [slideIndex, setSlideIndex] = useState(0);
    const [product, setProduct] = useState();
    const zoomSlideBig = useRef(null);
    const zoomSlideSml = useRef(null);

    const { id } = useParams();


    useEffect(() => {
        fetchDataFromApi(`/api/product/${id}`).then((response) => {
            if (response.error === false) {
                setProduct(response?.data);
            }
        })
    }, [id]); // Runs whenever productId changes

    const reviewDate = new Date().toISOString();
    const [time, setTime] = useState(timeAgo(reviewDate));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(timeAgo("2025-02-01T01:44:00")); // Update time continuously
        }, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, [reviewDate]);


    // Function to manually set the slide index when clicking on thumbnails
    const goto = (index) => {
        setSlideIndex(index);
        zoomSlideSml.current.swiper.slideTo(index);
        zoomSlideBig.current.swiper.slideTo(index);
    };

    // Function to sync small slider when the big slider is manually moved
    const onSlideChange = () => {
        if (zoomSlideBig.current && zoomSlideSml.current) {
            const currentIndex = zoomSlideBig.current.swiper.realIndex;
            setSlideIndex(currentIndex);
            zoomSlideSml.current.swiper.slideTo(currentIndex);
        }
    };



    return (
        <>
            <div className="flex items-center justify-between pt-3 ">
                <h1 className="text-[20px] font-bold">Products Details</h1>
            </div>

            <div className={`productDetails flex gap-5 mt-2 ${context.isSidebarOpen === true ? 'max-h-[85%]' : 'max-h-[60%]'} `}>
                <div className="w-[40%]">
                    <div className="flex gap-3 h-[95%] max-w-[600px]">
                        {/* Small Image Slider */}
                        <div className="slider w-[15%] productDetailImageOptions">
                            {product?.images?.length !== 0 &&
                                <Swiper
                                    ref={zoomSlideSml}
                                    slidesPerView={`${context.isSidebarOpen === true ? 8 : 6}`}
                                    centeredSlides={true} // Ensures the active slide is centered
                                    centeredSlidesBounds={true}
                                    spaceBetween={0}
                                    direction={"vertical"}
                                    navigation={false}
                                    modules={[Navigation]}
                                    className="zoomProductSliderThumbs h-full" // Make height responsive
                                >
                                    {product?.images?.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <div
                                                className={`item rounded-md overflow-hidden cursor-pointer p-2 py-1 group ${slideIndex === index ? "opacity-1 border-2 border-blue-700" : "opacity-80"
                                                    }`}
                                                onClick={() => goto(index)} onMouseEnter={() => goto(index)}
                                            >
                                                <img
                                                    src={image}
                                                    alt="img"
                                                    className="w-full rounded-md transition-all object-cover"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            }
                        </div>

                        {/* Big Image Slider */}
                        <div className="zoomContainer w-full h-full max-w-[85%] mx-auto relative shadow-lg rounded-md">
                            <Swiper
                                ref={zoomSlideBig}
                                slidesPerView={1}
                                spaceBetween={0}
                                className="productZoomSwiper w-full h-full rounded-md"
                                onSlideChange={onSlideChange} // Sync small slider when big slider moves
                            >
                                {product?.images?.map((image, index) => (
                                    <SwiperSlide key={index} className="!w-full !h-full">
                                        <InnerImageZoom
                                            zoomType="hover"
                                            zoomPreload={true}
                                            hideCloseButton={true}
                                            fullscreenOnMobile={true}
                                            zoomScale={1}
                                            src={image}
                                            className="!w-full !h-full rounded-md !object-cover" // Ensures image is contained within the div
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>

                <div className="w-[60%] bg-white p-5 rounded-md">

                    <span className="text-[16px] font-bold text-gray-500">{product?.brand}</span>
                    <h1 className="text-[20px]">{product?.name}</h1>
                    <div className="flex items-center mt-2">
                        <span className="bg-green-600 h-[20px] rounded-full px-2 flex items-center justify-center gap-[2px] font-medium text-[14px] text-white">{product?.rating} <RiStarSFill className="text-[14px]" /></span>
                        <span className="separator text-lg"></span>
                        <span>{product?.rating > 0 ? product?.rating : 0} rating{product?.rating >= 2 ? 's' : ''} & {product?.reviews?.length > 0 ? product?.reviews?.length : 0} review{product?.reviews?.length >= 2 ? 's' : ''}</span>
                    </div>

                    <hr className="my-4 h-[1px] rounded-md" />

                    <div className="flex items-center my-2">
                        <span className="flex items-center gap-3">
                            <span className="price text-[28px] font-medium flex items-center">
                                ₹<span>{new Intl.NumberFormat('en-IN').format(product?.price)}</span>
                            </span>
                            <span className="oldPrice line-through text-[var(--text-light)] text-[16px] font-medium flex items-center">
                                ₹<span>{new Intl.NumberFormat('en-IN').format(product?.oldPrice)}</span>
                            </span>
                            <span className="text-[16px] text-green-600 font-medium text">({product?.discount}% off)</span>
                        </span>
                        <span className="separator text-xl"></span>
                        <span className="flex items-center gap-2">Available in stocks: {
                            product?.countInStock > 0 ? product?.countInStock : <><span className="text-red-600 bg border border-red-600 px-2 py-1 capitalize text-[12px]">Out of stock</span></>
                        }</span>
                    </div>

                    <span className="text-[16px] border p-2 rounded-md">{product?.categoryName}<span className="separator text-lg"></span>{product?.subCategoryName}<span className="separator text-lg"></span>{product?.thirdSubCategoryName}</span>

                    <div className=" mt-5">
                        {
                            product?.productRam.length > 0 &&

                            <span className="text-[16px] flex gap-2 items-center">
                                Ram :
                                {
                                    product?.productRam.map((ram, index) => {
                                        return (

                                            <span className="border-2 rounded-md p-2 h-[35px] w-[50px] text-[14px] flex items-center justify-center" key={index}>{ram}</span>

                                        )
                                    })
                                }
                            </span>
                        }
                    </div>

                    <div className=" mt-2">
                        <span className="text-[16px] flex gap-2 items-center">
                            <span>Size :</span>
                            {
                                product?.size.map((psize, index) => {
                                    return (
                                        <>
                                            <span className="border-2 rounded-md p-2 h-[35px] w-[50px] text-[14px] flex items-center justify-center" key={index}>{psize}</span>
                                        </>
                                    )
                                })
                            }
                        </span>
                    </div>

                    <div className=" mt-5">
                        <span className="text-[16px] flex gap-2 items-center">
                            <span>Published At :</span>
                            {
                                (new Date(product?.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }))

                            }
                        </span>
                    </div>

                    <h2 className="text-[16px] mt-2">Product Description : </h2>
                    {
                        product?.description && <p className="text-[14px] text-gray-500 text-justify mt-1">{product?.description}</p>
                    }
                </div>
            </div>

            <hr className="my-4 h-[1px] rounded-md bg-gray-300" />

            <div className="flex flex-col justify-center pt-3 ">
                <h1 className="text-[20px] font-bold">Customer Reviews</h1>
                <div className="gap-2 mt-2 bg-white rounded-md p-5 grid grid-cols-1">

                    <div className="review flex items-center p-5 border rounded-md">
                        <div className="info flex items-start gap-3 w-full">
                            <div className="img w-[50px] min-w-[50px] h-[50px] overflow-hidden rounded-full relative">
                                <img src={context?.userData?.avatar !== "" ? `${context?.userData?.avatar}` : `https://ui-avatars.com/api/?name=${context?.userData?.name?.replace(/ /g, "+")}`} alt="user image" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="flex items-center gap-5 w-full">
                                    <span className="flex items-center gap-2">
                                        <span className="text-[16px] font-bold">{"Karan Aujhla"}</span>
                                        <span className="text-gray-500 text-[12px]">{time}</span>
                                    </span>
                                    <Rating name="size-medium" defaultValue={5} readOnly />
                                </div>
                                <p className="text-sm text-gray-700 mt-2 text-justify">Lpsum dolor sit amet.</p>
                            </div>
                        </div>
                    </div>
                    

                </div>
            </div>
        </>
    );
};

export default ProductDetails;
