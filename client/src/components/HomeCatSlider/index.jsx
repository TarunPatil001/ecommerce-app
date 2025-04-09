// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";


// import required modules
import { Autoplay, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext } from "react";
import { MyContext } from "../../App";

// const HomeCatSlider = (props) => {
//   const context = useContext(MyContext);

//   return (
//     <div className="homeCatSlider pt-4 py-8 px-8 overflow-hidden">
//       <div className="container">
//         <Swiper
//           slidesPerView={`${props?.data?.length > 7 ?  8 : 3}`}
//           spaceBetween={10}
//           autoplay={{
//             delay: 5000,
//             disableOnInteraction: false,
//             pauseonmouseenter: true,
//           }}
//           // loop={true}
//           navigation={context?.windowWidth > 768}
//           modules={[Autoplay, Navigation]}
//           className="mySwiper"
//         >
//           {
//             props?.data?.map((item, index) => (

//               <SwiperSlide key={index}>
//                 <Link to="/">
//                   <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
//                     <div className="img-box !w-full !h-[150px] rounded-lg">
//                       <img
//                         src={item?.images[0]}
//                         alt="categoryImage"
//                         className="scalable-image rounded-lg"
//                       />
//                     </div>
//                     <h3 className="text-[15px] font-[500] mt-3 truncate w-40">{item?.name}</h3>
//                   </div>
//                 </Link>
//               </SwiperSlide>

//             ))
//           }
//         </Swiper>
//       </div>
//     </div>
//   );
// };

const HomeCatSlider = (props) => {
  const context = useContext(MyContext);

  return (
    <div className="homeCatSlider !pt-2 py-4 md:py-8 px-4 sm:px-6 md:px-8 overflow-hidden">
      <div className="container mx-auto">
        <Swiper
          slidesPerView={2}
          breakpoints={{
            400: {
              slidesPerView: 3,
            },
            576: {
              slidesPerView: 4,
            },
            768: {
              slidesPerView: 5,
            },
            992: {
              slidesPerView: 6,
            },
            1200: {
              slidesPerView: props?.data?.length > 7 ? 8 : 7,
            }
          }}
          spaceBetween={10}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={context?.windowWidth > 768}
          modules={[Autoplay, Navigation]}
          className="mySwiper"
        >
          {props?.data?.map((item, index) => (
            <SwiperSlide key={index}>
              <Link to="/">
                <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
                  <div className="img-box !w-full !h-[150px] rounded-lg">
                    <img
                      src={item?.images[0]}
                      alt="categoryImage"
                      className="scalable-image rounded-lg"
                    />
                  </div>
                  <h3 className="text-[15px] font-[500] mt-3 truncate w-40">{item?.name}</h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

HomeCatSlider.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired
};

export default HomeCatSlider;
