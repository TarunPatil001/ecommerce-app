import { useContext, useEffect, useState } from 'react'
import { Button, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { MyContext } from '../../App'
import CartItems from './cartItems'

const CartPage = () => {

    const context = useContext(MyContext);

    const [totalMRP, setTotalMRP] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);



    useEffect(() => {
        if (context?.cartData?.length !== 0) {
            const calculatedTotalMRP = context?.cartData?.reduce((total, item) => total + (item?.subTotalOldPrice || 0), 0);
            const calculatedDiscount = context?.cartData?.reduce((total, item) => total + ((item?.subTotalOldPrice || 0) - (item?.subTotal || 0)), 0);
            const calculatedTotalAmount = calculatedTotalMRP - calculatedDiscount;

            setTotalMRP(calculatedTotalMRP);
            setDiscount(calculatedDiscount);
            setTotalAmount(calculatedTotalAmount);

        } else {
            setTotalMRP(0);
            setDiscount(0);
            setTotalAmount(0);
        }
    }, [context?.cartData]);


    return (


        <section className="section py-5 pb-10">
            <div className={`container w-full ${window.innerWidth < 992 ? "max-w-[100%]" : "max-w-[80%]"} ${context?.cartData?.length === 0 ? "flex items-center justify-center" : ""} flex gap-4 flex-col lg:flex-row`}>

                {/* Cart Items */}
                <div className={`rightPart w-full lg:w-[70%] flex flex-col gap-2 rounded-md shadow`}>

                    <div className="h-[100%] shadow-sm rounded-md bg-white flex flex-col gap-2">
                        <div className="py-2 px-3">
                            <h2 className="font-bold text-[14px]">Your Cart</h2>
                            <p className="mt-0 text-[14px]">There {context?.cartData?.length <= 1 ? ("is") : ("are")} <span className="font-bold text-[var(--bg-primary)]">{context?.cartData?.length}</span> product{context?.cartData?.length <= 1 ? ("") : ("s")} in your cart</p>
                        </div>
                        <Divider />
                        <div className="flex items-center flex-col p-3 gap-4 w-full h-auto min-h-[50vh]">
                            {
                                context?.cartData?.length === 0 ?
                                    <div className='w-full h-[50vh] flex flex-col items-center justify-center gap-2'>
                                        <span className="flex items-center justify-center">
                                            <img src="../empty-cart.png" alt="empty-cart-img" className="w-[200px]" />
                                        </span>
                                        <span className="text-[18px] mt-4">Your cart is empty!</span>
                                        <span className="text-[12px]">Add items to it now.</span>
                                        <Link
                                            to="/"
                                            className="w-[80%] sm:w-[30%] max-w-sm flex items-center justify-center mt-4"
                                        >
                                            <Button
                                                className="buttonPrimaryBlack !normal-case w-full"
                                                onClick={() => context.toggleCartPanel(false)}
                                            >
                                                Shop now
                                            </Button>
                                        </Link>

                                    </div>
                                    :
                                    context?.cartData?.map((item, index) => {
                                        return (
                                            <CartItems size="S" quantity={item?.quantity} key={index} item={item} />
                                        )
                                    })
                            }
                        </div>
                    </div>
                </div>

                {/* Price Details */}
                <div className={`rightPart ${context?.cartData?.length === 0 ? "hidden" : "w-full lg:w-[30%]"}`}>
                    <div className="shadow-md rounded-md bg-white flex flex-col gap-2 sticky top-[150px] z-50">
                        <div className="cartTotals">
                            <div className="py-2">
                                <h2 className="uppercase px-4 py-1 text-[16px] font-bold text-[var(--text-light)] pb-2">Price Details <span className="capitalize">({context?.cartData?.length} Item{context?.cartData?.length <= 1 ? ("") : ("s")})</span></h2>
                            </div>
                            <Divider />
                            <div className="flex items-center justify-between px-4 py-1 mt-1">
                                <span className="text-[14px]">Total MRP</span>
                                <span className="price text-black text-[14px] flex items-center">₹{new Intl.NumberFormat('en-IN').format(totalMRP)}</span>
                            </div>
                            <div className="flex items-center justify-between px-4 py-1">
                                <span className="text-[14px]">Discount on MRP</span>
                                <span className="price text-green-600 text-[14px] flex items-center gap-1">- ₹{new Intl.NumberFormat('en-IN').format(discount)}</span>
                            </div>
                            <Divider />
                            <div className="flex items-center justify-between px-4 py-4 font-bold text-[18px]">
                                <span>Total Amount:</span>
                                <span>₹{new Intl.NumberFormat('en-IN').format(totalAmount)}</span>
                            </div>
                            <Divider />
                            <div className="w-[100%] flex items-center justify-between bg-gray-100 p-4 ">
                                <Link to="/checkout" className="w-full"><Button className="buttonPrimaryBlack w-full flex items-center gap-1" onClick={context.toggleCartPanel(false)}>Place Order</Button></Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>


    )
}

export default CartPage
