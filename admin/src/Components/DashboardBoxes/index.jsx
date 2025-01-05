import React from 'react'
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

const DashboardBoxes = () => {
    return (
        <>
            <Swiper slidesPerView={4} spaceBetween={10} navigation={true} modules={[Navigation]} className="dashboardBoxesSlider !pr-0.5">

                <SwiperSlide>
                    <div className='box bg-white rounded-md p-4 border border-[rgba(0,0,0,0.1)] hover:bg-[var(--bg-hover-primary)] flex flex-col items-center gap-4'>
                        <div className='flex items-center gap-5 w-full'>
                            <ImGift className='text-[40px] text-[var(--text-active)]' />
                            <div className='info w-[70%]'>
                                <h3 className='font-medium text-[14px] text-[rgba(0,0,0,0.5)]'>New Orders</h3>
                                <h2 className='font-bold text-[24px]'>1,390</h2>
                            </div>
                            <IoStatsChart className='text-[60px] text-[var(--text-active)]' />
                        </div>

                        <div className='border-t border-dashed flex gap-3 pt-2 w-full'>
                            <div className='flex gap-1 text-green-500'>
                                <MdOutlineKeyboardDoubleArrowUp />
                                <h3 className='text-[14px] font-medium'>+32.40%</h3>
                            </div>
                            <h3 className='text-[14px] text-[rgba(0,0,0,0.5)] font-medium'>Increased last month</h3>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className='box bg-white p-4 rounded-md border border-[rgba(0,0,0,0.1)] hover:bg-[var(--bg-hover-primary)] flex flex-col items-center gap-4'>
                        <div className='flex items-center gap-5 w-full'>
                            <FaChartPie className='text-[40px] text-[#15b682]' />
                            <div className='info w-[70%]'>
                                <h3 className='font-medium text-[14px] text-[rgba(0,0,0,0.5)]'>Sales</h3>
                                <h2 className='font-bold text-[24px]'>₹5,390</h2>
                            </div>
                            <IoStatsChart className='text-[60px] text-[#15b682]' />
                        </div>

                        <div className='border-t border-dashed flex gap-3 pt-2 w-full'>
                            <div className='flex gap-1 text-red-500'>
                                <MdOutlineKeyboardDoubleArrowDown />
                                <h3 className='text-[14px] font-medium'>-4.40%</h3>
                            </div>
                            <h3 className='text-[14px] text-[rgba(0,0,0,0.5)] font-medium'>Decreased last month</h3>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className='box bg-white p-4 rounded-md border border-[rgba(0,0,0,0.1)] hover:bg-[var(--bg-hover-primary)] flex flex-col items-center gap-4'>
                        <div className='flex items-center gap-5 w-full'>
                            <ImLibrary className='text-[40px] text-[#7928c9]' />
                            <div className='info w-[70%]'>
                                <h3 className='font-medium text-[14px] text-[rgba(0,0,0,0.5)]'>Revenue</h3>
                                <h2 className='font-bold text-[24px]'>₹1,390</h2>
                            </div>
                            <IoStatsChart className='text-[60px] text-[#7928c9]' />
                        </div>

                        <div className='border-t border-dashed flex gap-3 pt-2 w-full'>
                            <div className='flex gap-1 text-green-500'>
                                <MdOutlineKeyboardDoubleArrowUp />
                                <h3 className='text-[14px] font-medium text-green-500'>+32.40%</h3>
                            </div>
                            <h3 className='text-[14px] text-[rgba(0,0,0,0.5)] font-medium'>Increased last month</h3>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className='box bg-white p-4 rounded-md border border-[rgba(0,0,0,0.1)] hover:bg-[var(--bg-hover-primary)] flex flex-col items-center gap-4'>
                        <div className='flex items-center gap-5 w-full'>
                            <GiShoppingBag className='text-[40px] text-[#2670d8]' />
                            <div className='info w-[70%]'>
                                <h3 className='font-medium text-[14px] text-[rgba(0,0,0,0.5)]'>Total Products</h3>
                                <h2 className='font-bold text-[24px]'>10,390</h2>
                            </div>
                            <IoStatsChart className='text-[60px] text-[#28c9a3]' />
                        </div>

                        <div className='border-t border-dashed flex gap-3 pt-2 w-full'>
                            <div className='flex gap-1 text-red-500'>
                                <MdOutlineKeyboardDoubleArrowDown />
                                <h3 className='text-[14px] font-medium text-red-500'>+32.40%</h3>
                            </div>
                            <h3 className='text-[14px] text-[rgba(0,0,0,0.5)] font-medium'>Increased last month</h3>
                        </div>
                    </div>
                </SwiperSlide>

            </Swiper>
        </>
    )
}

export default DashboardBoxes
