import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

const HomeBannerV2 = (props) => {
    // Filter the products that have the banner visible
    const filteredItems = props?.data?.filter(item => item?.isBannerVisible === true);

    // If no banners are found, show the "No banner image found" message
    if (filteredItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center font-bold italic w-full h-full border shadow rounded-md">
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
            {
                filteredItems.map((item, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <div className="item w-full rounded-md overflow-hidden relative">
                                {/* Banner Image */}
                                <div className="h-[500px] w-full">
                                    <img
                                        src={item?.bannerImages?.[0] || "/placeholder.jpg"}
                                        alt={item?.bannerTitleName || "Banner Image"}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {/* Banner Info with Animation - Only Visible on Active Slide */}
                                <div className="info absolute top-0 -right-[100%] opacity-0 w-[50%] h-[100%] z-50 p-8 flex flex-col items-start justify-center gap-4 transition-all duration-700 bg-[rgba(0,0,0,0.2)]">
                                    <h4 className="text-[20px] font-medium w-full relative -right-[100%] opacity-0">Big Saving Days Sale</h4>
                                    <h2 className="text-[35px] font-bold w-full relative -right-[100%] opacity-0 line-clamp-4">{item?.bannerTitleName}</h2>
                                    <h3 className="text-[20px] font-medium w-full flex items-center gap-2 relative -right-[100%] opacity-0">Starting At Only <span className="!text-[var(--bg-primary)] text-[30px] font-bold"><span className="rupee">₹</span>{new Intl.NumberFormat('en-IN').format(`${item?.price}`)}</span></h3>
                                    <div className="w-full relative -right-[100%] opacity-0 btn_">
                                        <Link to="/">
                                            <Button className="!text-white !bg-[var(--bg-primary)] hover:!bg-[#000] !text-lg !px-5 !py-3 top-5" size="large">Shop Now</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    )
                })
            }
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
