import React from "react";

import { FaShippingFast } from "react-icons/fa";
import HomeCatSlider from "../../components/HomeCatSlider";
import HomeSlider from "../../components/HomeSilder";
import AdsBannerSlider from "../../components/AdsBannerSlider";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ProductSlider from "../../components/ProductSlider";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import BlogItem from "../../components/BlogItem";
import Footer from "../../components/Footer";

const Home = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <HomeSlider />
      <HomeCatSlider />

      <section className="bg-white py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="leftSec">
              <h2 className="text-2xl font-semibold">Popular Products</h2>
              <p className="text-sm font-normal">
                Do not miss the current offer until end of January.
              </p>
            </div>
            <div className="rightSec w-[60%]">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab label="Fashion" />
                <Tab label="Electronics" />
                <Tab label="Bags" />
                <Tab label="Footwear" />
                <Tab label="Groceries" />
                <Tab label="Beauty" />
                <Tab label="Wellness" />
                <Tab label="Jewellery" />
              </Tabs>
            </div>
          </div>

          <ProductSlider items={6} />
        </div>
      </section>

      <section className="py-4 pt-2 bg-white">
        <div className="container">
          <div className="freeShipping w-[80%] m-auto py-3 p-4 border-2 border-[var(--bg-primary)] rounded-md flex items-center justify-between mb-7">
            <div className="col1 flex items-center justify-between gap-4">
              <FaShippingFast className="text-5xl rotate-180 -scale-y-100" />
              <span className="text-2xl font-[600] uppercase">
                Free Shipping
              </span>
            </div>
            <span className="line"></span>
            <div className="col2">
              <p className="mb-0 font-medium">
                Free Delivery Now On Your First Order and over ₹500
              </p>
            </div>
            <span className="line"></span>
            <p className="font-bold text-2xl">- Only ₹500*</p>
          </div>
          <AdsBannerSlider items={4} timedelay={7000} />
        </div>
      </section>

      <section className="py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="text-2xl font-semibold">Latest Products</h2>
          <p className="text-sm font-normal">New release for winter.</p>
          <ProductSlider items={5} />
          <AdsBannerSlider items={2} timedelay={5000} />
        </div>
      </section>

      <section className="py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="text-2xl font-semibold">Feature Products</h2>
          <p className="text-sm font-normal">
            Everything you need—on a budget.
          </p>
          <ProductSlider items={5} />
          <AdsBannerSlider items={3} timedelay={3000} />
        </div>
      </section>

      <section className="py-5 pb-8 pt-0 bg-white blogSection">
        <div className="container py-5">
          <h2 className="text-2xl font-semibold mb-4">From The Blog</h2>
          <Swiper
            slidesPerView={4}
            spaceBetween={30}
            autoplay={{
              delay: 1000, // Continuous autoplay
              disableOnInteraction: false, // Continue autoplay even after interaction
              pauseOnMouseEnter:true,
            }}
            // speed={5000} // Smooth continuous scrolling
            loop={true} // Infinite loop
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true} // Enable navigation
            allowTouchMove={true} // Allow swiping
            modules={[Autoplay, Pagination, Navigation]}
            className="blogSlider"
          >
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
      
      <Footer />


    </>
  );
};

export default Home;
