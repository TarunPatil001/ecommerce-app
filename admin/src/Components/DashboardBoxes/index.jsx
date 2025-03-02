import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { ImGift } from "react-icons/im";
import { IoStatsChart } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowDown, MdOutlineKeyboardDoubleArrowUp } from 'react-icons/md';
import { ImLibrary } from "react-icons/im";
import { FaChartPie } from 'react-icons/fa';
import { GiShoppingBag } from "react-icons/gi";
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { AiOutlineStock } from "react-icons/ai";
import { FaUserLarge } from 'react-icons/fa6';

const DashboardBoxes = (props) => {
    return (
        <>
            <div className="relative">
                {/* Custom Navigation Buttons */}
                <div className="swiper-button-next !flex !items-center !justify-center absolute right-0 z-10"></div>
                <div className="swiper-button-prev !flex !items-center !justify-center absolute left-0 z-10"></div>

                <Swiper
                    slidesPerView={4}
                    spaceBetween={10}
                    navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }}
                    modules={[Navigation]}
                    className="dashboardBoxesSlider !pr-0.5"
                >


                    <SwiperSlide>
                        <div className="box bg-white p-4 rounded-md border border-[rgba(0,0,0,0.1)] hover:bg-[var(--bg-hover-primary)] flex flex-col items-center gap-4">
                            <div className="flex items-center gap-5 w-full">
                                <BiSolidCategoryAlt className="text-[40px] text-[#db27ff]" />
                                <div className="info w-[70%]">
                                    <h3 className="font-medium text-[14px] text-[rgba(0,0,0,0.5)]">
                                        Total Categories
                                    </h3>
                                    <h2 className="font-bold text-[24px]">{props?.category}</h2>
                                </div>
                                <IoStatsChart className="text-[60px] text-[#db27ff]" />
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="box bg-white p-4 rounded-md border border-[rgba(0,0,0,0.1)] hover:bg-[var(--bg-hover-primary)] flex flex-col items-center gap-4">
                            <div className="flex items-center gap-5 w-full">
                                <GiShoppingBag className="text-[40px] text-[#2670d8]" />
                                <div className="info w-[70%]">
                                    <h3 className="font-medium text-[14px] text-[rgba(0,0,0,0.5)]">
                                        Total Products
                                    </h3>
                                    <h2 className="font-bold text-[24px]">{props?.products}</h2>
                                </div>
                                <IoStatsChart className="text-[60px] text-[#28c9a3]" />
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="box bg-white p-4 rounded-md border border-[rgba(0,0,0,0.1)] hover:bg-[var(--bg-hover-primary)] flex flex-col items-center gap-4">
                            <div className="flex items-center gap-5 w-full">
                                <ImGift className="text-[40px] text-[var(--text-active)]" />
                                <div className="info w-[70%]">
                                    <h3 className="font-medium text-[14px] text-[rgba(0,0,0,0.5)]">
                                        New Orders
                                    </h3>
                                    <h2 className="font-bold text-[24px]">{props?.orders}</h2>
                                </div>
                                <IoStatsChart className="text-[60px] text-[var(--text-active)]" />
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="box bg-white p-4 rounded-md border border-[rgba(0,0,0,0.1)] hover:bg-[var(--bg-hover-primary)] flex flex-col items-center gap-4">
                            <div className="flex items-center gap-5 w-full">
                                <FaUserLarge className="text-[40px] text-[#7928c9]" />
                                <div className="info w-[70%]">
                                    <h3 className="font-medium text-[14px] text-[rgba(0,0,0,0.5)]">
                                        Total Users
                                    </h3>
                                    <h2 className="font-bold text-[24px]">{props?.users}</h2>
                                </div>
                                <IoStatsChart className="text-[60px] text-[#7928c9]" />
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className="box bg-white p-4 rounded-md border border-[rgba(0,0,0,0.1)] hover:bg-[var(--bg-hover-primary)] flex flex-col items-center gap-4">
                            <div className="flex items-center gap-5 w-full">
                                <AiOutlineStock className="text-[40px] text-[#ff3195]" />
                                <div className="info w-[70%]">
                                    <h3 className="font-medium text-[14px] text-[rgba(0,0,0,0.5)]">
                                        Total Sales
                                    </h3>
                                    <h2 className="font-bold text-[24px]">{props?.sales}</h2>
                                </div>
                                <IoStatsChart className="text-[60px] text-[#ff3195]" />
                            </div>
                        </div>
                    </SwiperSlide>

                </Swiper>
            </div>
        </>
    )
}

export default DashboardBoxes
