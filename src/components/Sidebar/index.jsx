import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import "./styles.css"
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Collapse } from 'react-collapse';
import Button from '@mui/material/Button';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Rating from '@mui/material/Rating';

const Sidebar = () => {
    const [isOpenCategoryFilter1, setIsOpenCategoryFilter1] = useState(true);
    const [isOpenInnerCategoryFilter1, setIsOpenInnerCategoryFilter1] = useState(false);
    const [isOpenCategoryFilter2, setIsOpenCategoryFilter2] = useState(true);
    const [isOpenCategoryFilter3, setIsOpenCategoryFilter3] = useState(true);
    const [isOpenCategoryFilter4, setIsOpenCategoryFilter4] = useState(true);
    const [isOpenCategoryFilter5, setIsOpenCategoryFilter5] = useState(true);

    return (
        <aside className="sidebar">
            <div className="p-1 border-x border-t rounded-t-md">
                <h3 className="p-2 px-4 text-[18px] font-semibold uppercase">Filters</h3>
            </div>

            <div className="box border">
                <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
                    Categories
                    <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter1(!isOpenCategoryFilter1) }}> {isOpenCategoryFilter1 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter1}>
                    <div className="scroll relative flex flex-col w-full mb-1">

                        <div className="px-4 flex flex-col w-full mb-2 capitalize">
                            <FormControlLabel control={<Checkbox size="small" />} label="Fashion" className="link w-full" />
                            <FormControlLabel control={<Checkbox size="small" />} label="Electronics" className="link w-full" />
                            <FormControlLabel control={<Checkbox size="small" />} label="Bags" className="link w-full" />
                            <FormControlLabel control={<Checkbox size="small" />} label="Footwear" className="link w-full" />
                            <FormControlLabel control={<Checkbox size="small" />} label="Groceries" className="link w-full" />
                            <Collapse isOpened={isOpenInnerCategoryFilter1}>
                                <div className="flex flex-col w-full">
                                    <FormControlLabel control={<Checkbox size="small" />} label="Beauty" className="link w-full" />
                                    <FormControlLabel control={<Checkbox size="small" />} label="Wellness" className="link w-full" />
                                    <FormControlLabel control={<Checkbox size="small" />} label="Jewellery" className="link w-full" />
                                </div>
                            </Collapse>
                            <button className="flex items-center justify-center link blink-button mt-2" onClick={() => { setIsOpenInnerCategoryFilter1(!isOpenInnerCategoryFilter1) }}> {isOpenInnerCategoryFilter1 ? (<><IoIosArrowUp />Show Less</>) : (<><IoIosArrowDown />Show More</>)}</button>
                        </div>
                    </div>
                </Collapse>

            </div>

            <div className="box border-x border-b">
                <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
                    Availability
                    <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter2(!isOpenCategoryFilter2) }}> {isOpenCategoryFilter2 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter2}>
                    <div className="scroll relative flex flex-col mb-1">

                        <div className="px-5  flex flex-col w-full mb-2 capitalize">
                            <div className="flex items-center justify-between">
                                <FormControlLabel control={<Checkbox size="small" />} label="Available" className="link w-full" />
                                (17)
                            </div>
                            <div className="flex items-center justify-between">
                                <FormControlLabel control={<Checkbox size="small" />} label="In Stock" className="link w-full" />
                                (19)
                            </div>
                            <div className="flex items-center justify-between">
                                <FormControlLabel control={<Checkbox size="small" />} label="Not Available" className="link w-full" />
                                (1)
                            </div>

                        </div>
                    </div>
                </Collapse>
            </div>

            <div className="box border-x border-b">
                <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
                    Size
                    <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter3(!isOpenCategoryFilter3) }}> {isOpenCategoryFilter3 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter3}>
                    <div className="scroll relative flex flex-col mb-1">

                        <div className="px-5  flex flex-col w-full mb-2 capitalize">
                            <div className="flex items-center justify-between">
                                <FormControlLabel control={<Checkbox size="small" />} label="Small" className="link w-full" />
                                (17)
                            </div>
                            <div className="flex items-center justify-between">
                                <FormControlLabel control={<Checkbox size="small" />} label="Medium" className="link w-full" />
                                (19)
                            </div>
                            <div className="flex items-center justify-between">
                                <FormControlLabel control={<Checkbox size="small" />} label="Large" className="link w-full" />
                                (1)
                            </div>
                            <div className="flex items-center justify-between">
                                <FormControlLabel control={<Checkbox size="small" />} label="XL" className="link w-full" />
                                (1)
                            </div>
                            <div className="flex items-center justify-between">
                                <FormControlLabel control={<Checkbox size="small" />} label="XXL" className="link w-full" />
                                (1)
                            </div>

                        </div>
                    </div>
                </Collapse>
            </div>

            <div className="box border-x border-b">
                <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
                    Price
                    <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter4(!isOpenCategoryFilter4) }}> {isOpenCategoryFilter4 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter4}>
                    <div className="p-5  flex flex-col w-full capitalize">
                        <RangeSlider />
                        <div className="py-4 px-0 text-[12px] flex items-center justify-between priceRange">
                            <span>low: <span className="rupee">₹</span><span className="font-semibold text-[13px]">{new Intl.NumberFormat('en-IN').format(500)}</span></span>
                            <span>high: <span className="rupee">₹</span><span className="font-semibold text-[13px]">{new Intl.NumberFormat('en-IN').format(1000)}</span></span>
                        </div>
                    </div>
                </Collapse>
            </div>

            <div className="box border-x border-b rounded-b-md ">
                <h3 className=" text-[16px] font-semibold uppercase px-4 py-3 flex items-center">
                    Rating
                    <Button className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[rgba(0,0,0,0.8)]" onClick={() => { setIsOpenCategoryFilter5(!isOpenCategoryFilter5) }}> {isOpenCategoryFilter5 ? (<><IoIosArrowUp /></>) : (<><IoIosArrowDown /></>)}</Button>
                </h3>
                <Collapse isOpened={isOpenCategoryFilter5}>
                    <div className="p-5 pt-0  flex flex-col w-full lowercase">
                        <div className="flex items-center">
                            <FormControlLabel control={<><Checkbox size="small" /><Rating name="half-rating" defaultValue={5} precision={0.5} size="small" readOnly /></>} label="&nbsp;& above" className="link w-full " />
                        </div>
                        <div className="flex items-center justify-between">
                            <FormControlLabel control={<><Checkbox size="small" /><Rating name="half-rating" defaultValue={4} precision={0.5} size="small" readOnly /></>} label="&nbsp;& above" className="link w-full" />
                        </div>
                        <div className="flex items-center justify-between">
                            <FormControlLabel control={<><Checkbox size="small" /><Rating name="half-rating" defaultValue={3} precision={0.5} size="small" readOnly /></>} label="&nbsp;& above" className="link w-full" />
                        </div>
                        <div className="flex items-center justify-between">
                            <FormControlLabel control={<><Checkbox size="small" /><Rating name="half-rating" defaultValue={2} precision={0.5} size="small" readOnly /></>} label="&nbsp;& above" className="link w-full" />
                        </div>
                        <div className="flex items-center justify-between">
                            <FormControlLabel control={<><Checkbox size="small" /><Rating name="half-rating" defaultValue={1} precision={0.5} size="small" readOnly /></>} label="&nbsp;& above" className="link w-full" />
                        </div>
                    </div>
                </Collapse>
            </div>

        </aside >
    );
};

export default Sidebar;
