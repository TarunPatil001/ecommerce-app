import { Button, Menu, MenuItem } from '@mui/material';
import React, { useContext, useState } from 'react'
import { FaCaretDown } from 'react-icons/fa';
import { RiCloseLargeLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import { GiReturnArrow } from 'react-icons/gi';

const CartItems = (props) => {

    const context = useContext(MyContext);

    const [anchorEl1, setAnchorEl1] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const [selectedSize, setSelectedSize] = useState(props.size);
    const [selectedQty, setSelectedQty] = useState(props.quantity);


    const openSize = Boolean(anchorEl1);
    const handleSizeClick = (event) => {
        setAnchorEl1(event.currentTarget);
    };
    const handleSizeClose = (valueSize) => {
        setAnchorEl1(null);
        if(valueSize!==null){
            setSelectedSize(valueSize);
        }else{
            setSelectedSize(null);
        }
    };
    const openQty = Boolean(anchorEl2);
    const handleQtyClick = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleQtyClose = (valueQty) => {
        setAnchorEl2(null);
        if(valueQty!==null){
            setSelectedQty(valueQty);
        }else{
            setSelectedQty(null);
        }
    };



    return (
        <>
            <div className="cartItem w-full p-3 flex items-start gap-4 border rounded-md">
                <div className="cartItemImg w-[15%] flex items-center justify-center">
                    <div className="w-full h-[150px] rounded-md overflow-hidden">
                        <Link to="/product/47856222442424" onClick={context.toggleCartPanel(false)}>
                            <img src="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/JULY/29/z3UAG5L0_e6cd3d86e0ec4ecfbd0d275b4651a52d.jpg" alt="ProductImg" className="w-full h-full object-cover rounded-md hover:scale-105 transition-all" />
                        </Link>
                    </div>
                </div>
                <div className="cartInfo w-[85%] pr-5 relative">
                    <h5 className="text-[13px] font-bold line-clamp-1">T-Shirt</h5>
                    <h4 className="text-[14px] line-clamp-1 leading-6"><Link to="/product/784585" className="link transition-all" onClick={context.toggleCartPanel(false)}>Nike Air Max Invigor Black Nike Air Max Invigor Black</Link></h4>
                    <h6 className="text-[12px] line-clamp-1 text-[rgba(0,0,0,0.4)]">Sold by: <span className="capitalize">BEST UNITED INDIA COMFORTS PVT LTD</span></h6>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="relative">
                            <span className="bg-gray-100 px-2 border hover:border-black rounded-sm font-bold text-[13px] flex items-center gap-1 cursor-pointer" onClick={handleSizeClick}>Size: <span>{selectedSize}</span><FaCaretDown /></span>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl1}
                                open={openSize}
                                onClose={()=>handleSizeClose(null)}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={()=>handleSizeClose('S')}>S</MenuItem>
                                <MenuItem onClick={()=>handleSizeClose('M')}>M</MenuItem>
                                <MenuItem onClick={()=>handleSizeClose('L')}>L</MenuItem>
                                <MenuItem onClick={()=>handleSizeClose('XL')}>XL</MenuItem>
                                <MenuItem onClick={()=>handleSizeClose('2XL')}>2XL</MenuItem>
                                <MenuItem onClick={()=>handleSizeClose('3XL')}>3XL</MenuItem>
                            </Menu>
                        </div>
                        <div className="relative">
                            <span className="bg-gray-100 px-2 border hover:border-black rounded-sm font-bold text-[13px] flex items-center gap-1 cursor-pointer" onClick={handleQtyClick}>Qty: <span>{selectedQty}</span><FaCaretDown /></span>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl2}
                                open={openQty}
                                onClose={()=>handleQtyClose(null)}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={()=>handleQtyClose(1)}>1</MenuItem>
                                <MenuItem onClick={()=>handleQtyClose(2)}>2</MenuItem>
                                <MenuItem onClick={()=>handleQtyClose(3)}>3</MenuItem>
                                <MenuItem onClick={()=>handleQtyClose(4)}>4</MenuItem>
                                <MenuItem onClick={()=>handleQtyClose(5)}>5</MenuItem>
                                <MenuItem onClick={()=>handleQtyClose(6)}>6</MenuItem>
                                <MenuItem onClick={()=>handleQtyClose(7)}>7</MenuItem>
                                <MenuItem onClick={()=>handleQtyClose(8)}>8</MenuItem>
                                <MenuItem onClick={()=>handleQtyClose(9)}>9</MenuItem>
                                <MenuItem onClick={()=>handleQtyClose(10)}>10</MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="price text-black text-[14px] font-bold flex items-center">
                            ₹{new Intl.NumberFormat('en-IN').format(1499)}
                        </span>
                        <span className="oldPrice line-through text-[rgba(0,0,0,0.4)] text-[14px] font-normal flex items-center">
                            ₹{new Intl.NumberFormat('en-IN').format(2599)}
                        </span>
                        <span className="uppercase text-[14px] text-[var(--off-color)] font-normal">17% OFF</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="flex flex-row items-center gap-1 text-[12px]"><span className="w-[15px] h-[15px] rounded-full border !border-[rgba(0,0,0,0.4)] flex items-center justify-center p-0.5"><GiReturnArrow className="text-[10px]" /></span><span className="font-bold !text-[#000]">10 days</span> return available</span>
                    </div>
                    <Button
                        className="!w-[30px] !h-[30px] !min-w-[30px] !absolute top-0 right-0 !shadow-md !text-gray-800 hover:!bg-gray-500 hover:!text-white !rounded-full flex items-center justify-center"
                        onClick={""}
                    >
                        <RiCloseLargeLine className="!text-[50px]" />
                    </Button>
                </div>
            </div>

        </>
    )
}

export default CartItems
