import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { IoImagesSharp } from "react-icons/io5";

// const HomeBannerV2 = (props) => {
//     // Filter the products that have the banner visible
//     const filteredItems = props?.data?.filter(item => item?.isBannerVisible === true);

//     // If no banners are found, show the "No banner image found" message
//     if (filteredItems.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center font-bold italic w-full h-full border shadow rounded-md">
//                 <IoImagesSharp className="text-[50px] opacity-50" />
//                 <p className="text-gray-500">No banner image available.</p>
//             </div>
//         );
//     }

//     return (
//         <Swiper
//             spaceBetween={30}
//             effect={"fade"}
//             loop={true}
//             autoplay={{
//                 delay: 2500,
//                 disableOnInteraction: false,
//                 pauseOnMouseEnter: true,
//             }}
//             navigation={true}
//             pagination={{
//                 clickable: true,
//                 dynamicBullets: true,
//             }}
//             modules={[EffectFade, Autoplay, Navigation, Pagination]}
//             className="homeSliderV2"
//         >
//             {
//                 filteredItems.map((item, index) => {
//                     return (
//                         <SwiperSlide key={index}>
//                             <div className="item w-full rounded-md overflow-hidden relative">
//                                 {/* Banner Image */}
//                                 <div className="w-auto h-auto lg:h-[500px] lg:w-full">
//                                     <img
//                                         src={item?.bannerImages?.[0] || "/placeholder.jpg"}
//                                         alt={item?.bannerTitleName || "Banner Image"}
//                                         className="h-full w-full object-fill lg:object-cover"
//                                     />
//                                 </div>

//                                 {/* Banner Info with Animation - Only Visible on Active Slide */}
//                                 <div className="info absolute top-0 -right-[100%] opacity-0 w-[50%] h-[100%] z-50 p-8 flex flex-col items-start justify-center gap-4 transition-all duration-700 bg-[rgba(0,0,0,0.2)]">
//                                     <h4 className="text-[14px] lg:text-[20px] font-medium w-full relative -right-[100%] opacity-0 text-white">Big Saving Days Sale</h4>
//                                     <h2 className="text-[14px] lg:text-[35px] font-bold w-full relative -right-[100%] opacity-0 line-clamp-4 text-white">{item?.bannerTitleName}</h2>
//                                     <h3 className="text-[14px] lg:text-[20px] font-medium w-full flex items-center gap-2 relative -right-[100%] opacity-0 text-white">Starting At Only <span className="!text-[var(--bg-primary)] text-[20px] lg:text-[30px] font-extrabold"><span className="rupee">₹</span>{new Intl.NumberFormat('en-IN').format(`${item?.price}`)}</span></h3>
//                                     <div className="w-full relative -right-[100%] opacity-0 btn_">
//                                         <Link to="/">
//                                             <Button className="!text-white !bg-[var(--bg-primary)] hover:!bg-[#000] !text-lg !px-5 !py-3 top-5" size="large">Shop Now</Button>
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </SwiperSlide>
//                     )
//                 })
//             }
//         </Swiper>
//     );
// };

const HomeBannerV2 = (props) => {
    const filteredItems = props?.data?.filter(item => item?.isBannerVisible === true);

    if (filteredItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center font-bold italic w-full h-full min-h-[200px] md:min-h-[300px] border shadow rounded-md">
                <IoImagesSharp className="text-[50px] opacity-50" />
                <p className="text-gray-500">No banner image available.</p>
            </div>
        );
    }

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
            {filteredItems.map((item, index) => (
                <SwiperSlide key={index}>
                    <div className="item w-full rounded-md overflow-hidden relative">
                        {/* Banner Image */}
                        <div className="w-full h-[200px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[500px]">
                            <img
                                src={item?.bannerImages?.[0] || "/placeholder.jpg"}
                                alt={item?.bannerTitleName || "Banner Image"}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Banner Info with Animation */}
                        <div className="info absolute top-0 -right-full lg:-right-[100%] opacity-0 w-[50%] lg:w-[50%] h-full z-50 p-4 md:p-6 lg:p-8 flex flex-col items-start justify-center gap-2 md:gap-3 lg:gap-4 transition-all duration-700 bg-[rgba(0,0,0,0.2)]">
                            <h4 className="text-xs sm:text-sm md:text-base lg:text-[20px] font-medium w-full relative -right-full lg:-right-[100%] opacity-0 text-white">Big Saving Days Sale</h4>
                            <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-[35px] font-bold w-full relative -right-full lg:-right-[100%] opacity-0 line-clamp-2 md:line-clamp-3 lg:line-clamp-4 text-white">
                                {item?.bannerTitleName}
                            </h2>
                            <h3 className="text-xs sm:text-sm md:text-base lg:text-[20px] font-medium w-full flex flex-col sm:flex-row sm:items-center gap-1 md:gap-2 relative -right-full lg:-right-[100%] opacity-0 text-white">
                                Starting At Only <span className="!text-[var(--bg-primary)] text-base sm:text-lg md:text-xl lg:text-[30px] font-extrabold">
                                    <span className="rupee">₹</span>{new Intl.NumberFormat('en-IN').format(`${item?.price}`)}
                                </span>
                            </h3>
                            <div className="w-full relative -right-full lg:-right-[100%] opacity-0 btn_">
                                <Link to="/">
                                    <Button className="!text-white !bg-[var(--bg-primary)] hover:!bg-[#000] !text-sm sm:!text-base !px-3 !py-2 sm:!px-4 sm:!py-2 md:!px-5 md:!py-3 top-0" size="large">
                                        Shop Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

// Prop validation
HomeBannerV2.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            isBannerVisible: PropTypes.bool,
            bannerImages: PropTypes.arrayOf(PropTypes.string),
            bannerTitleName: PropTypes.string,
            price: PropTypes.number,
        })
    ).isRequired,
};

export default HomeBannerV2;
