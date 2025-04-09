// import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Navigation } from "swiper/modules";
import PropTypes from "prop-types";
import BannerBoxV2 from "../bannerBoxV2";
import { useContext } from "react";
import { MyContext } from "../../App";

// const AdsBannerSliderV2 = (props) => {
//   return (
//     <div className="py-5 w-full">
//       <Swiper
//         slidesPerView={props.items}
//         spaceBetween={10}
//         autoplay={{
//           delay: props.timedelay,
//           // disableOnInteraction: false,
//         }}
//         loop={true}
//         // navigation={true}
//         modules={[Autoplay, Navigation]}
//         className="smallBtn"
//       >

//         {
//           props?.data?.map((item, index) => (
//             <SwiperSlide key={index}>
//               <BannerBoxV2 info={item.alignInfo} image={item?.images[0]} heading={item?.bannerTitle} price={item.price} height={props.height} items={item} link={'/'} />
//             </SwiperSlide>
//           ))
//         }

//       </Swiper>
//     </div>
//   );
// };

const AdsBannerSliderV2 = (props) => {

  const context = useContext(MyContext);

  // Handle responsive items prop (can be number or object)
  const getSlidesPerView = () => {
    if (typeof props.items === 'object') {
      return {
        default: props.items.default || 1,
        640: props.items.sm || 2,
        768: props.items.md || 3,
        1024: props.items.lg || 4,
        // 1280: props.items.xl || 5
      };
    }
    return props.items;
  };

  // Handle responsive height
  const getHeight = () => {
    if (typeof props.height === 'object') {
      return props.height;
    }
    return props.height || 200;
  };

  return (
    <div className="py-3 md:py-4 lg:py-5 w-full">
      <Swiper
        slidesPerView={getSlidesPerView()}
        spaceBetween={10}
        autoplay={{
          delay: props.timedelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        navigation={context?.windowWidth > 768}
        modules={[Autoplay, Navigation]}
        breakpoints={
          typeof props.items === 'object' ? {
            0: { slidesPerView: props.items.default || 1 },
            640: { slidesPerView: props.items.sm || 2 },
            768: { slidesPerView: props.items.md || 3 },
            1024: { slidesPerView: props.items.lg || 4 },
            // 1280: { slidesPerView: props.items.xl || 5 }
          } : null
        }
        className="adsBannerSliderV2"
      >
        {props?.data?.map((item, index) => (
          <SwiperSlide key={index}>
            <BannerBoxV2
              info={item.alignInfo}
              image={item?.images[0]}
              heading={item?.bannerTitle}
              price={item.price}
              height={getHeight()}
              items={item}
              link={'/'}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

AdsBannerSliderV2.propTypes = {
  items: PropTypes.number.isRequired,
  timedelay: PropTypes.number.isRequired,
  height: PropTypes.number,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      alignInfo: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      bannerTitle: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired, // Make sure 'data' is required and follows this structure
};


export default AdsBannerSliderV2;
