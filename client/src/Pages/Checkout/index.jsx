import React, { useContext } from 'react'
import { MyContext } from '../../App';
import { Button, Divider } from '@mui/material';
import TextField from '@mui/material/TextField';
import CartTotal from '../Cart/cartTotal';
import { Link } from 'react-router-dom';
import { IoBagCheck } from 'react-icons/io5';

const Checkout = () => {

    const context = useContext(MyContext);

    return (
        <form action="#">
            <section className="section py-5 pb-10">
                <div className="container checkoutPage w-[80%] max-w-[80%] flex gap-4">
                    <div className="leftPart w-[70%]">
                        <div className="shadow-md rounded-md bg-white flex flex-col gap-2">

                            <div className="pt-10 pb-2 px-5">
                                <h2 className="text-[var(--text-light)] font-bold uppercase">Billing Details</h2>
                            </div>
                            <Divider />
                            <div className="py-2 px-5">
                                <h4 className="text-[var(--text-light)] font-bold uppercase text-[12px]">Contact Details*</h4>
                            </div>
                            <div className="flex items-center flex-col py-2 px-5 gap-4">
                                <TextField id="cname" label="Full Name" name="cname" required variant="outlined" className="custom-textfield w-full mb-5" size="small" />
                                <TextField type="tel" id="mobileno" label="Mobile No." name="mobileno" required variant="outlined" inputProps={{ maxLength: 10, inputMode: 'numeric' }} className="custom-textfield w-full mb-5" size="small" />
                            </div>
                            <Divider />
                            <div className="py-2 px-5">
                                <h4 className="text-[var(--text-light)] font-bold uppercase text-[12px]">Address*</h4>
                            </div>
                            <div className="flex items-center flex-col py-2 px-5 gap-4">
                                <TextField id="address" label="Address (House No, Building, Street, Area)" name="address" required variant="outlined" className="custom-textfield w-full mb-5" size="small" />
                                <TextField id="locality" label="Locality / Town" name="locality" required variant="outlined" className="custom-textfield w-full mb-5" size="small" />
                                <div className="w-full flex justify-between gap-5">
                                    <TextField id="city" label="City / District" name="city" required variant="outlined" className="custom-textfield w-full mb-5" size="small" />
                                    <TextField id="state" label="State" name="state" required variant="outlined" className="custom-textfield w-full mb-5" size="small" />
                                </div>
                            </div>
                            <Divider />
                            <div className="py-2 px-5">
                                <h4 className="text-[var(--text-light)] font-bold uppercase text-[12px]">Pincode/Zip*</h4>
                            </div>
                            <div className="flex items-center flex-col py-2 pb-10 px-5 gap-4">
                                <div className="w-full flex justify-between gap-5">
                                    <TextField id="pincode" label="Pin Code" name="pincode" required variant="outlined" inputProps={{ maxLength: 6, inputMode: 'numeric' }} className="custom-textfield w-full mb-5" size="small" />
                                    <TextField id="state" label="State" name="state" required variant="outlined" className="custom-textfield w-full mb-5" size="small" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rightPart w-[30%]">
                        <div className="shadow-md rounded-md bg-white flex flex-col">
                            <CartTotal />
                            <Divider />
                            <div className="w-[100%] flex items-center justify-between bg-gray-100 p-4 ">
                                <Link to="/checkout" className="w-full"><Button className="buttonPrimaryBlack w-full flex items-center gap-1" onClick={context.toggleCartPanel(false)}><IoBagCheck />Checkout</Button></Link>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </form>
    )
}

export default Checkout
