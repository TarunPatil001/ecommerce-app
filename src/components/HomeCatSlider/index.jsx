// import React, { useRef, useState } from 'react';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";


// import required modules
import { Autoplay, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const HomeCatSlider = () => {
  return (
    <div className="homeCatSlider pt-4 py-8">
      <div className="container">
        <Swiper
          slidesPerView={8}
          spaceBetween={10}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseonmouseenter: true,
          }}
          // loop={true}
          navigation={true}
          modules={[Autoplay, Navigation]}
          className="mySwiper"
        >
          <SwiperSlide>
            <Link to="/">
              <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
                <div className="img-box !w-full !h-[150px] rounded-lg">
                  <img
                    src="https://api.technopolis.bg/medias/577330.jpg-Product-details-main?context=bWFzdGVyfHJvb3R8NTg0NzN8aW1hZ2UvanBlZ3xhR0l6TDJnd055OHlPRE00TkRRNE1qTTVOREUwTWk1cWNHY3w5ZmE5NDRkZjg1NWRmNjY5MzBjMzhjODZiM2YzMDMzM2ZjY2QzZGFlYjUwYThhYmE3MzI2MDU0ZDMyODlmZDhm"
                    alt="categoryImage"
                    className="scalable-image rounded-lg"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3 truncate w-40">Tablets</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
              <div className="img-box !w-full !h-[150px] rounded-lg">
                  <img
                    src="https://whirlpoolindia.vtexassets.com/arquivos/ids/168238/Xpert-care_Ozone_9kg-12.jpg?v=638465221533800000"
                    alt="categoryImage"
                    className="scalable-image rounded-lg"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3 truncate w-40">Washing Machines</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
              <div className="img-box !w-full !h-[150px] rounded-lg">
                  <img
                    src="https://cellbell.in/cdn/shop/files/Zenith-C107-Medium-Back-Mesh-Office-Study-Chair-_13.png?v=1715002253&width=1946"
                    alt="categoryImage"
                    className="scalable-image rounded-lg"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3 truncate w-40">Office Study Chairs</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
              <div className="img-box !w-full !h-[150px] rounded-lg">
                  <img
                    src="https://rukminim2.flixcart.com/image/850/1000/xif0q/sofa-sectional/j/d/y/symmetrical-88-9-green-215-9-polyester-no-60-alston-fabric-5-original-imah4d5kc3t7qfj7.jpeg?q=90&crop=false"
                    alt="categoryImage"
                    className="scalable-image rounded-lg"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3 truncate w-40">Sofa and Sectionals</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
              <div className="img-box !w-full !h-[150px] rounded-lg">
                  <img
                    src="https://s.yimg.com/ny/api/res/1.2/HODbjlldOOeCHco_UeI2Nw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQyNw--/https://o.aolcdn.com/images/dims?crop=1600%2C1067%2C0%2C0&quality=85&format=jpg&resize=1600%2C1067&image_uri=https://s.yimg.com/os/creatr-uploaded-images/2020-01/506bbdf0-30ba-11ea-b6d6-162ad1e97745&client=a1acac3e1b3290917d92&signature=1bd9e3238c9d26b02126c5a0108e70a9fa1fd1ab"
                    alt="categoryImage"
                    className="scalable-image rounded-lg"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3 truncate w-40">Televisions</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
              <div className="img-box !w-full !h-[150px] rounded-lg">
                  <img
                    src="https://imagecdn.99acres.com//microsite/wp-content/blogs.dir/6161/files/2023/06/Upholstered-Bed-Design.jpg"
                    alt="categoryImage"
                    className="scalable-image rounded-lg"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3 truncate w-40">Beds</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
              <div className="img-box !w-full !h-[150px] rounded-lg">
                  <img
                    src="https://m.media-amazon.com/images/I/51waTS44GqL._AC_UY1100_.jpg"
                    alt="categoryImage"
                    className="scalable-image rounded-lg"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3 truncate w-40">Mens Mufflers</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
              <div className="img-box !w-full !h-[150px] rounded-lg">
                  <img
                    src="https://learn.sensibo.com/hubfs/image_2023-11-20_10-40-17%20%281%29.png"
                    alt="categoryImage"
                    className="scalable-image rounded-lg"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3 truncate w-40">Air Conditioners</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
              <div className="img-box !w-full !h-[150px] rounded-lg">
                  <img
                    src="https://learn.sensibo.com/hubfs/image_2023-11-20_10-40-17%20%281%29.png"
                    alt="categoryImage"
                    className="scalable-image rounded-lg"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3 truncate w-40">Air Conditioners</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
              <div className="img-box !w-full !h-[150px] rounded-lg">
                  <img
                    src="https://learn.sensibo.com/hubfs/image_2023-11-20_10-40-17%20%281%29.png"
                    alt="categoryImage"
                    className="scalable-image rounded-lg"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3 truncate w-40">Air Conditioners</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-2 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col transition-all link">
              <div className="img-box !w-full !h-[150px] rounded-lg">
                  <img
                    src="https://learn.sensibo.com/hubfs/image_2023-11-20_10-40-17%20%281%29.png"
                    alt="categoryImage"
                    className="scalable-image rounded-lg"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3 truncate w-40">Air Conditioners</h3>
              </div>
            </Link>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;
