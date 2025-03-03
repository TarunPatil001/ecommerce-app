import  { useContext } from 'react'
import { MyContext } from '../../App';
import { Divider } from '@mui/material';

const CartTotal = () => {

    const context = useContext(MyContext);

    return (
        <>
            <div className="cartTotals ">
                <div className="py-2">
                    <h2 className="uppercase px-4 py-1 text-[16px] font-bold text-[var(--text-light)] pb-2">Price Details <span className="capitalize">({context.cartItemsQty} Item{context.cartItemsQty <= 1 ? ("") : ("s")})</span></h2>
                </div>
                <Divider />
                <div className="flex items-center justify-between px-4 py-1 mt-1">
                    <span className="text-[14px]">Total MRP</span>
                    <span className="price text-black text-[14px] flex items-center">₹{new Intl.NumberFormat('en-IN').format(1499)}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-1">
                    <span className="text-[14px]">Discount on MRP</span>
                    <span className="price text-green-600 text-[14px] flex items-center gap-1">- ₹{new Intl.NumberFormat('en-IN').format(1499)}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-1">
                    <span className="text-[14px]">Coupon Discount</span>
                    <span className="price text-green-600 text-[14px] flex items-center gap-1">- ₹{new Intl.NumberFormat('en-IN').format(102)}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-1">
                    <span className="text-[14px]">Platform Fee</span>
                    {
                        context.platformFee === 0 ? (
                            <span className="price text-green-600 text-[14px] flex items-center">Free</span>
                        ) : (
                            <span className="price text-black text-[14px] flex items-center">₹{new Intl.NumberFormat('en-IN').format(49)}</span>
                        )
                    }
                </div>
                <div className="flex items-center justify-between px-4">
                    <span className="text-[14px]">Shipping Fee</span>
                    {
                        context.shippingFee === 0 ? (
                            <span className="price text-green-600 text-[14px] flex items-center gap-1"><span className="line-through !text-[var(--text-dark)]"> ₹{new Intl.NumberFormat('en-IN').format(79)}</span>Free</span>
                        ) : (
                            <span className="price text-black text-[14px] flex items-center">₹{new Intl.NumberFormat('en-IN').format(79)}</span>
                        )
                    }
                </div>
                <div className="flex items-center justify-between px-4 py-0 pb-5">
                    {
                        context.shippingFee === 0 ? (
                            <span className="text-[12px]">Free Shipping for you</span>
                        ) : (""
                        )
                    }

                </div>
                <Divider />
                <div className="flex items-center justify-between px-4 py-4 font-bold text-[15px]">
                    <span>Total Amount:</span>
                    <span>₹{new Intl.NumberFormat('en-IN').format(2012)}</span>
                </div>                
            </div>
        </>
    )
}

export default CartTotal
