// import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation, EffectFlip } from "swiper/modules";
import PropTypes from "prop-types";
import { useContext } from "react";
import { MyContext } from "../../App";

// const HomeSlider = (props) => {

//   const context = useContext(MyContext);

//   return (
//     <div className="homeSlider py-4">
//       <div className="container">
//         <Swiper
//           slidesPerView={1}
//           centeredSlides={true}
//           spaceBetween={10}
//           autoplay={{
//             delay: 2500,
//             disableOnInteraction: false,
//           }}
//           loop={true}
//           pagination={{
//             clickable: true,
//             dynamicBullets: true,
//           }}

//           navigation={context?.windowWidth > 992}
//           modules={[Autoplay, Pagination, Navigation, EffectFlip]}
//           className={`sliderHome ${context?.windowWidth < 992 ? "rounded-md" : "rounded-2xl"}`}
//         >

//           {
//             props?.data?.length !== 0 && props?.data?.map((item, index) => {
//               return (
//                 <SwiperSlide key={index}>

//                   <div className={`w-full h-[115px] lg:h-[450px] item ${context?.windowWidth < 992 ? "rounded-md" : "rounded-2xl"} overflow-hidden shadow-md`}>

//                     <img
//                       src={item?.images[0]}
//                       alt="Banner slide"
//                       className="w-full h-full object-cover overflow-hidden"
//                     />
//                   </div>
//                 </SwiperSlide>

//               )
//             })
//           }

//         </Swiper>
//       </div>
//     </div>
//   );
// };


const HomeSlider = (props) => {
  const context = useContext(MyContext);

  return (
    <div className="homeSlider py-4 pb-2">
      <div className="container ">
        <Swiper
          slidesPerView={1}
          centeredSlides={true}
          spaceBetween={10}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={context?.windowWidth > 768} // Changed to show navigation on tablets and up
          modules={[Autoplay, Pagination, Navigation, EffectFlip]}
          className={`sliderHome rounded-md md:rounded-lg lg:rounded-xl xl:rounded-2xl`}
        >
          {props?.data?.length !== 0 ? (
            props?.data?.map((item, index) => (
              <SwiperSlide key={index}>
                <div className={`w-full h-[150px] xs:h-[180px] sm:h-[220px] md:h-[300px] lg:h-[380px] xl:h-[450px] item rounded-md md:rounded-lg lg:rounded-xl xl:rounded-2xl overflow-hidden shadow-sm md:shadow-md`}>
                  <img
                    src={item?.images[0]}
                    alt="Banner slide"
                    className="w-full h-full object-cover"
                    loading="lazy" // Added lazy loading
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="w-full h-[150px] xs:h-[180px] sm:h-[220px] md:h-[300px] lg:h-[380px] xl:h-[450px] bg-gray-100 flex items-center justify-center rounded-md md:rounded-lg lg:rounded-xl xl:rounded-2xl">
                <p className="text-gray-500">No slides available</p>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};


HomeSlider.propTypes = {
  data: PropTypes.arrayOf(
      PropTypes.shape({
          images: PropTypes.arrayOf(PropTypes.string).isRequired
      })
  ).isRequired
};


export default HomeSlider;
