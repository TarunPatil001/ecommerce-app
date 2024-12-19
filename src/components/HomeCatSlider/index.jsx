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
    <div className="homeCatSlider py-4">
      <div className="container">
        <Swiper
          slidesPerView={8}
          spaceBetween={10}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseonmouseenter: true,
          }}
          loop={true}
          navigation={true}
          modules={[Autoplay, Navigation]}
          className="mySwiper"
        >
          <SwiperSlide>
            <Link to="/">
              <div className="item p-3 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col ">
                <div className="img-box  rounded-lg w-full">
                  <img
                    src="https://img.freepik.com/free-photo/3d-cartoon-beauty-products_23-2151503319.jpg"
                    alt="categoryImage"
                    className="!w-full !h-[150px] !object-cover rounded-lg transition-all"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3">T-Shirts</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-3 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col ">
                <div className="img-box  rounded-lg w-full">
                  <img
                    src="https://images.yourstory.com/cs/4/211ccaf00e6d11e997fe8f165dce9bb1/Imageifxu-1596799036123-1601633425902.jpg?mode=crop&crop=faces&ar=2%3A1&format=auto&w=1920&q=75"
                    alt="categoryImage"
                    className="!w-full !h-[150px] !object-cover rounded-lg transition-all"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3">T-Shirts</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-3 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col ">
                <div className="img-box  rounded-lg w-full">
                  <img
                    src="https://d1rbiogke1jwo5.cloudfront.net/wp-content/uploads/2021/03/Aluminium-Billets-1-scaled.jpg"
                    alt="categoryImage"
                    className="!w-full !h-[150px] !object-cover rounded-lg transition-all"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3">T-Shirts</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-3 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col ">
                <div className="img-box  rounded-lg w-full">
                  <img
                    src="https://www.indiafoodnetwork.in/h-upload/2023/08/10/1040215-kombucha-1.webp"
                    alt="categoryImage"
                    className="!w-full !h-[150px] !object-cover rounded-lg transition-all"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3">T-Shirts</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-3 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col ">
                <div className="img-box  rounded-lg w-full">
                  <img
                    src="https://www.anikdairy.com/images/products/powder/ANIK-MADHUR-DAIRYMILK.webp"
                    alt="categoryImage"
                    className="!w-full !h-[150px] !object-cover rounded-lg transition-all"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3">T-Shirts</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-3 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col ">
                <div className="img-box  rounded-lg w-full">
                  <img
                    src="https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?cs=srgb&dl=pexels-madebymath-90946.jpg&fm=jpg"
                    alt="categoryImage"
                    className="!w-full !h-[150px] !object-cover rounded-lg transition-all"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3">T-Shirts</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-3 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col ">
                <div className="img-box  rounded-lg w-full">
                  <img
                    src="https://png.pngtree.com/background/20230414/original/pngtree-the-cosmetics-are-disorganized-beneath-seawater-and-sand-picture-image_2423767.jpg"
                    alt="categoryImage"
                    className="!w-full !h-[150px] !object-cover rounded-lg transition-all"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3">T-Shirts</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-3 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col ">
                <div className="img-box  rounded-lg w-full">
                  <img
                    src="https://m.media-amazon.com/images/I/61Vm8nTBdoL._AC_UF894,1000_QL80_.jpg"
                    alt="categoryImage"
                    className="!w-full !h-[150px] !object-cover rounded-lg transition-all"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3">T-Shirts</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-3 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col ">
                <div className="img-box  rounded-lg w-full">
                  <img
                    src="https://img.freepik.com/premium-vector/landscape-product-catalogue-landscape-product-catalog-design_284754-1188.jpg"
                    alt="categoryImage"
                    className="!w-full !h-[150px] !object-cover rounded-lg transition-all"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3">T-Shirts</h3>
              </div>
            </Link>
          </SwiperSlide>
          <SwiperSlide>
            <Link to="/">
              <div className="item p-3 bg-white rounded-lg shadow-sm text-center flex items-center justify-center flex-col ">
                <div className="img-box  rounded-lg w-full">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=1778&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="categoryImage"
                    className="!w-full !h-[150px] !object-cover rounded-lg transition-all"
                  /> 
                </div>
                <h3 className="text-[15px] font-[500] mt-3">T-Shirts</h3>
              </div>
            </Link>
          </SwiperSlide>
          
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;
