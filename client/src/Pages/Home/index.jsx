import { useContext } from "react";

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
import { Autoplay, Navigation } from "swiper/modules";
import BlogItem from "../../components/BlogItem";
import HomeBannerV2 from "../../components/HomeSliderV2";
import BannerBoxV2 from "../../components/bannerBoxV2";
import AdsBannerSliderV2 from "../../components/AdsBannerSliderV2";
import { useState } from "react";
import { useEffect } from "react";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import ProductLoading from "../../components/ProductLoading";
import { IoImagesSharp } from "react-icons/io5";

const Home = () => {

  const context = useContext(MyContext);
  const [value, setValue] = useState(0);
  const [homeSlideData, setHomeSlideData] = useState([]);
  const [popularProductData, setPopularProductData] = useState([]);
  const [allProductsData, setAllProductsData] = useState([]);
  const [allFeaturedProductsData, setAllFeaturedProductsData] = useState([]);
  const [bannerV1Data, setBannerV1Data] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ New state for tracking API request
  const [blogData, setBlogData] = useState([]);



  useEffect(() => {

    window.scrollTo(0, 0);

    const fetchHomeData = async () => {
      try {
        const homeSlides = await fetchDataFromApi('/api/homeSlides');
        const allProducts = await fetchDataFromApi('/api/product/get-all-products');
        const featuredProducts = await fetchDataFromApi('/api/product/get-all-featuredProducts');
        const bannerV1 = await fetchDataFromApi('/api/bannersV1');
        const blogData = await fetchDataFromApi('/api/blog');

        setHomeSlideData(homeSlides?.data?.length ? homeSlides.data : []);
        setAllProductsData(allProducts?.data?.length ? allProducts.data : []);
        setAllFeaturedProductsData(featuredProducts?.data?.length ? featuredProducts.data : []);
        setBannerV1Data(bannerV1?.data?.length ? bannerV1.data : []);
        setBlogData(blogData?.data?.length ? blogData.data : []);
      } catch (error) {
        console.error("Error fetching home data:", error);
        setHomeSlideData([]);
        setAllProductsData([]);
        setAllFeaturedProductsData([]);
        setBannerV1Data([]);
        setBlogData([]);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    if (context?.catData?.length > 0) {
      setValue(0);
      filterByCatId(context.catData[0]._id);
    }
  }, [context?.catData]);

  useEffect(() => {
    if (!context?.catData?._id) return;

    const fetchProducts = async () => {
      setLoading(true);

      try {
        const res = await fetchDataFromApi(`/api/product/get-all-products-byCategoryId/${context?.catData?._id}`);

        setPopularProductData(res?.error === false && Array.isArray(res?.data) && res.data.length ? res.data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setPopularProductData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [context?.catData?._id, context?.isReducer]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    filterByCatId(newValue);
  };

  const filterByCatId = async (id) => {
    setLoading(true);
    setPopularProductData([]);

    try {
      const res = await fetchDataFromApi(`/api/product/get-all-products-byCategoryId/${id}`);
      setPopularProductData(res?.error === false && Array.isArray(res?.data) && res.data.length ? res.data : []);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      setPopularProductData([]);
    } finally {
      setLoading(false);
    }
  };





  return (
    <>

      {
        homeSlideData.length !== 0 && <HomeSlider data={homeSlideData} />
      }


      {/* <section className="py-6">
        <div className="container flex">
          <div className="part1 w-[66%] lg:w-[66%] ">

            {allProductsData.length > 0 ? (
              <HomeBannerV2 data={allProductsData} /> 
            ) : (
              <div className="flex flex-col items-center justify-center font-bold italic w-full h-full border shadow rounded-md">
                <IoImagesSharp className="text-[50px] opacity-50" />
                <p className="text-gray-500">No banner image available.</p>
              </div>
            )}


          </div>
          <div className="part2 w-[34%] pl-10 flex items-center justify-between flex-col gap-5">
            <BannerBoxV2 info="left" image={"https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-1.jpg"} heading={"Samsung Gear VR Camera"} price={7999} />
            <BannerBoxV2 info="right" image={"https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-2.jpg"} heading={"Marcel Dining Room Chair"} price={9999} />
          </div>
        </div>
      </section> */}

      <section className="py-3 md:py-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-0">
            <div className="part1 w-full lg:w-[66%]">
              {allProductsData.length > 0 ? (
                <HomeBannerV2 data={allProductsData} />
              ) : (
                <div className="flex flex-col items-center justify-center font-bold italic w-full h-full min-h-[200px] md:min-h-[300px] border shadow rounded-md">
                  <IoImagesSharp className="text-[50px] opacity-50" />
                  <p className="text-gray-500">No banner image available.</p>
                </div>
              )}
            </div>
            <div className="part2 w-full lg:w-[34%] lg:pl-5 xl:pl-10 flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-5">
              <BannerBoxV2 info="left" image={"https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-1.jpg"} heading={"Samsung Gear VR Camera"} price={7999} />
              <BannerBoxV2 info="right" image={"https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/cms/sub-banner-2.jpg"} heading={"Marcel Dining Room Chair"} price={9999} />
            </div>
          </div>
        </div>
      </section>

      {
        context?.catData.length !== 0 && <HomeCatSlider data={context?.catData} />
      }


      {/* <section className="bg-white py-5">
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
                {context?.catData.length > 0 &&
                  context.catData.map((cat, index) => (
                    <Tab
                      label={cat?.name}
                      key={index}
                      onClick={() => {
                        setValue(index); // Update selected tab
                        filterByCatId(cat?._id); // Fetch products for the clicked category
                      }}
                    />
                  ))}
              </Tabs>

            </div>
          </div>

          {popularProductData?.length === 0 && loading ? (
            <ProductLoading size={6} />
          ) : popularProductData?.length > 0 ? (
            <ProductSlider items={6} data={popularProductData} />
          ) : (
            <p className="text-center text-gray-500 w-full h-[330px] flex items-center justify-center">
              No products found
            </p>
          )}

        </div>
      </section> */}

      <section className="bg-white py-4 md:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
            <div className="leftSec">
              <h2 className="text-xl sm:text-2xl font-semibold">Popular Products</h2>
              <p className="text-xs sm:text-sm font-normal text-gray-600 mt-1">
                Do not miss the current offer until end of January.
              </p>
            </div>

            <div className="rightSec w-full md:w-[65%] lg:w-[70%]">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="scrollable tabs"
                sx={{
                  '& .MuiTabScrollButton-root': {
                    width: '24px',
                    minWidth: '24px'
                  }
                }}
              >
                {context?.catData.length > 0 &&
                  context.catData.map((cat, index) => (
                    <Tab
                      label={cat?.name}
                      key={index}
                      onClick={() => {
                        setValue(index);
                        filterByCatId(cat?._id);
                      }}
                      sx={{
                        minWidth: 'unset',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        '@media (min-width: 600px)': {
                          fontSize: '0.875rem',
                          padding: '6px 16px'
                        }
                      }}
                    />
                  ))}
              </Tabs>
            </div>
          </div>

          {popularProductData?.length === 0 && loading ? (
            <ProductLoading size={6} />
          ) : popularProductData?.length > 0 ? (
            <div className="px-0 sm:px-2">
              <ProductSlider items={window.innerWidth < 640 ? 2 : window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 4 : window.innerWidth < 1280 ? 5 : 6} data={popularProductData} />
            </div>
          ) : (
            <div className="text-center text-gray-500 w-full h-[200px] sm:h-[250px] md:h-[300px] flex items-center justify-center">
              <p>No products found</p>
            </div>
          )}
        </div>
      </section>

      {/* <section className="py-4 pt-2 bg-white">
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
          </div> */}

      {/* <AdsBannerSlider items={4} timedelay={7000} /> */}
      {/* {
            bannerV1Data?.length !== 0 && <AdsBannerSliderV2 items={4} timedelay={3000} height={200} data={bannerV1Data} />
          }
        </div>
      </section> */}

      <section className="py-3 md:py-4 lg:py-5 bg-white">
        <div className="container mx-auto">
          {/* Free Shipping Banner */}
          {/* <div className="freeShipping w-full md:w-[90%] lg:w-[80%] mx-auto py-2 md:py-3 px-3 sm:px-4 border-2 border-[var(--bg-primary)] rounded-md flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-5 md:mb-7">
            <div className="col1 flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto justify-center">
              <FaShippingFast className="text-3xl sm:text-4xl md:text-5xl rotate-180 -scale-y-100 min-w-[40px]" />
              <span className="text-lg sm:text-xl md:text-2xl font-semibold sm:font-[600] uppercase whitespace-nowrap">
                Free Shipping
              </span>
            </div>

            <span className="line hidden sm:block w-px h-8 bg-gray-300 mx-2"></span>

            <div className="col2 w-full sm:w-auto text-center sm:text-left">
              <p className="mb-0 text-sm sm:text-base font-medium whitespace-nowrap">
                Free Delivery Now On Your First Order and over ₹500
              </p>
            </div>

            <span className="line hidden sm:block w-px h-8 bg-gray-300 mx-2"></span>

            <p className="font-bold text-xl sm:text-2xl whitespace-nowrap">
              - Only ₹500*
            </p>
          </div> */}

          <div className="freeShipping w-full max-w-[1300px] mx-auto py-2 md:py-3 px-3 sm:px-4 border-2 border-[var(--bg-primary)] rounded-md flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4 mb-5 md:mb-7">
            {/* Left Icon + Label */}
            <div className="col1 flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-[180px] justify-center sm:justify-start">
              <FaShippingFast className="text-3xl sm:text-4xl md:text-5xl rotate-180 -scale-y-100 min-w-[40px]" />
              <span className="text-lg sm:text-xl md:text-2xl font-semibold uppercase whitespace-nowrap">
                Free Shipping
              </span>
            </div>

            {/* Divider */}
            <span className="line hidden sm:block w-px h-6 bg-gray-300 mx-2"></span>

            {/* Middle Message */}
            <div className="col2 text-sm sm:text-base font-medium text-center sm:text-left flex-1 min-w-[220px]">
              Free Delivery Now On Your First Order and over ₹500
            </div>

            {/* Divider */}
            <span className="line hidden sm:block w-px h-6 bg-gray-300 mx-2"></span>

            {/* Price Tag */}
            <p className="font-bold text-lg sm:text-xl md:text-2xl whitespace-nowrap text-center flex-1 min-w-[120px]">
              - Only ₹500*
            </p>
          </div>

          {/* Banner Slider */}
          {bannerV1Data?.length !== 0 ? (
            <AdsBannerSliderV2
              items={{ default: 1, sm: 2, md: 3, lg: 4 }}
              timedelay={3000}
              height={{ default: 150, sm: 180, md: 200 }}
              data={bannerV1Data}
            />
          ) : null}
        </div>
      </section>







      <section className="bg-white py-4 md:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
            <div className="leftSec">
              <h2 className="text-xl sm:text-2xl font-semibold">Latest Products</h2>
              <p className="text-xs sm:text-sm font-normal text-gray-600 mt-1">
                New release for winter.
              </p>
            </div>
          </div>

          {allProductsData?.length === 0 && loading ? (
            <ProductLoading size={6} />
          ) : allProductsData?.length > 0 ? (
            <div className="px-0 sm:px-2">
              <ProductSlider items={window.innerWidth < 640 ? 2 : window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 4 : window.innerWidth < 1280 ? 5 : 6} data={allProductsData} />
            </div>
          ) : (
            <div className="text-center text-gray-500 w-full h-[200px] sm:h-[250px] md:h-[300px] flex items-center justify-center">
              <p>No products found</p>
            </div>
          )}

          <AdsBannerSlider
            //  items={2} timedelay={5000}
            items={
              // { default: 1, sm: 2, md: 3, lg: 4 }
              2
            }
            timedelay={5000}
            height={{ default: 150, sm: 180, md: 200 }}
          // data={bannerV1Data}
          />
          {/* <AdsBannerSliderV2
            // items={2} timedelay={3000} height={200}
            items={{ default: 1, sm: 2, md: 3, lg: 4 }}
            timedelay={3000}
            height={{ default: 150, sm: 180, md: 200 }}
            // data={bannerV1Data}
          /> */}
        </div>
      </section>


      {/* <section className="py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="text-2xl font-semibold">Latest Products</h2>
          <p className="text-sm font-normal">New release for winter.</p>

          {allProductsData?.length === 0 && loading ? (
            <ProductLoading size={6} />
          ) : allProductsData?.length > 0 ? (
            <ProductSlider items={6} data={allProductsData} />
          ) : (
            <p className="text-center text-gray-500 w-full h-[330px] flex items-center justify-center">
              No products found
            </p>
          )}

          <AdsBannerSlider items={2} timedelay={5000} />
          <AdsBannerSliderV2 items={2} timedelay={3000} height={200} />
        </div>
      </section> */}


      <section className="bg-white py-4 md:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
            <div className="leftSec">
              <h2 className="text-xl sm:text-2xl font-semibold">Feature Products</h2>
              <p className="text-xs sm:text-sm font-normal text-gray-600 mt-1">
                Everything you need—on a budget.
              </p>
            </div>
          </div>

          {/* {
            allFeaturedProductsData?.length === 0 && loading ? (
              <ProductLoading size={6} />
            ) : allFeaturedProductsData?.length > 0 ? (
              <ProductSlider items={6} data={allFeaturedProductsData} />
            ) : (
              <p className="text-center text-gray-500 w-full h-[330px] flex items-center justify-center">
                No products found
              </p>
            )
          } */}

          {allFeaturedProductsData?.length === 0 && loading ? (
            <ProductLoading size={6} />
          ) : allFeaturedProductsData?.length > 0 ? (
            <div className="px-0 sm:px-2">
              <ProductSlider items={window.innerWidth < 640 ? 2 : window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 4 : window.innerWidth < 1280 ? 5 : 6} data={allFeaturedProductsData} />
            </div>
          ) : (
            <div className="text-center text-gray-500 w-full h-[200px] sm:h-[250px] md:h-[300px] flex items-center justify-center">
              <p>No products found</p>
            </div>
          )}

          <AdsBannerSlider
            //  items={2} timedelay={5000}
            items={
              // { default: 1, sm: 2, md: 3, lg: 4 }
              3
            }
            timedelay={5000}
            height={{ default: 150, sm: 180, md: 200 }}
          // data={bannerV1Data}
          />
          {/* <AdsBannerSliderV2
            // items={3} timedelay={3000} height={200}
            items={{ default: 1, sm: 2, md: 3, lg: 4 }}
            timedelay={3000}
            height={{ default: 150, sm: 180, md: 200 }}
            // data={bannerV1Data}
          /> */}
        </div>
      </section>

      {/* <section className="py-5 pt-0 bg-white">
        <div className="container">
          <h2 className="text-2xl font-semibold">Feature Products</h2>
          <p className="text-sm font-normal">
            Everything you need—on a budget.
          </p>

          {
            allFeaturedProductsData?.length === 0 && loading ? (
              <ProductLoading size={6} />
            ) : allFeaturedProductsData?.length > 0 ? (
              <ProductSlider items={6} data={allFeaturedProductsData} />
            ) : (
              <p className="text-center text-gray-500 w-full h-[330px] flex items-center justify-center">
                No products found
              </p>
            )
          }

          <AdsBannerSlider items={2} timedelay={5000} />
          <AdsBannerSliderV2 items={3} timedelay={3000} height={200} />
        </div>
      </section> */}



      {/* {
        blogData?.length !== 0 &&

        <section className="py-5 pb-8 pt-0 bg-white blogSection">
          <div className="container py-5">
            <h2 className="text-2xl font-semibold mb-4">From The Blog</h2>
            <Swiper
              slidesPerView={4}
              spaceBetween={30}
              autoplay={{
                delay: 1500, // Continuous autoplay
                disableOnInteraction: false, // Continue autoplay even after interaction
                pauseOnMouseEnter: true,
              }}
              // speed={5000} // Smooth continuous scrolling
              loop={true} // Infinite loop
              navigation={true} // Enable navigation
              allowTouchMove={true} // Allow swiping
              modules={[Autoplay, Navigation]}
              className="blogSlider"
            >
              {blogData.map((item, index) => (
                <SwiperSlide key={index}>
                  <BlogItem item={item} />
                </SwiperSlide>
              ))}

            </Swiper>
          </div>
        </section>
      } */}


      {
        blogData?.length !== 0 && (
          <section className="py-4 sm:py-6 md:py-8 bg-white blogSection px-4 sm:px-6">
            <div className="container mx-auto py-3 md:py-5">
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">From The Blog</h2>
              <Swiper
                slidesPerView={1}
                spaceBetween={20}
                breakpoints={{
                  480: {
                    slidesPerView: 2,
                    spaceBetween: 20
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 25
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 30
                  }
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={true}
                navigation={{
                  nextEl: '.blog-swiper-button-next',
                  prevEl: '.blog-swiper-button-prev',
                }}
                modules={[Autoplay, Navigation]}
                className="blogSlider relative"
              >
                {blogData.map((item, index) => (
                  <SwiperSlide key={index}>
                    <BlogItem item={item} />
                  </SwiperSlide>
                ))}

                {/* Custom Navigation Buttons */}
                <div className="blog-swiper-button-next hidden md:flex"></div>
                <div className="blog-swiper-button-prev hidden md:flex"></div>
              </Swiper>
            </div>
          </section>
        )
      }
      
    </>
  );
};

export default Home;
