import React, { useContext, useEffect, useState } from 'react'
import { Divider } from '@mui/material'
import { MyContext } from '../../App'
import WishlistItems from './wishlistItems'
import AccountSidebar from '../../components/AccountSidebar'
import ProductItem from '../../components/ProductItem'
import toast from 'react-hot-toast'
import { deleteData } from '../../utils/api'

const Wishlist = () => {

    const context = useContext(MyContext);
    

    return (
        <section className="py-10 w-full">
            <div className="container flex gap-4">
                <AccountSidebar />
                <div className="rightPart w-[80%]">
                    <div className="shadow-md rounded-md bg-white flex flex-col gap-2 min-h-[474px]">
                        <div className="py-2 px-3">
                            <h2 className="font-bold">My Wishlist</h2>
                            <p className="mt-0">There are <span className="font-bold text-[var(--bg-primary)]">{context.wishlistData.length}</span> product{context.wishlistData.length <= 1 ? ("") : ("s")} in your wishlist.</p>
                        </div>
                        <Divider />
                        {context.wishlistData?.length !== 0 ?
                            <div className="flex items-center flex-col p-3 gap-4">
                                {/* <div className={`grid grid-cols-5 md:grid-cols-5 gap-3 p-3`}> */}
                                {
                                    context.wishlistData.map((item, index) => {
                                        return <WishlistItems key={index} item={item} />
                                        // return <ProductItem
                                        //     product={{
                                        //         ...item,
                                        //         name: item?.productTitle,
                                        //         images: Array.isArray(item?.images) ? item?.images : [item?.image],
                                        //         _id: item?.productId
                                        //     }}
                                        //     key={index}
                                        //     fromWishlist={true} // Pass flag to indicate it's from wishlist
                                        // />
                                    })
                                }
                            </div>
                            :
                            <>
                                <img src="../empty-wishlist.png" className='w-[200px] mx-auto mt-[30px]' />
                                <span className='mx-auto mt-5 text-[20px] font-bold'>Empty Wishlist</span>
                                <span className='mx-auto text-[14px]'>You have no items in your wishlist. Start adding!</span>
                            </>

                        }
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Wishlist
