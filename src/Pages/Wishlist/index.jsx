import React, { useContext } from 'react'
import { Divider } from '@mui/material'
import { MyContext } from '../../App'
import WishlistItems from './wishlistItems'
import AccountSidebar from '../../components/AccountSidebar'

const Wishlist = () => {

    const context = useContext(MyContext);

    return (
        <section className="py-10 w-full">
            <div className="container flex gap-4">
                <AccountSidebar />
                <div className="leftPart w-[70%]">
                    <div className="shadow-md rounded-md bg-white flex flex-col gap-2">
                        <div className="py-2 px-3">
                            <h2 className="font-bold">My Wishlist</h2>
                            <p className="mt-0">There are <span className="font-bold text-[var(--bg-primary)]">{context.cartItemsQty}</span> product{context.cartItemsQty <= 1 ? ("") : ("s")} in your wishlist.</p>
                        </div>
                        <Divider />
                        <div className="flex items-center flex-col p-3 gap-4">
                            <WishlistItems />
                            <WishlistItems />
                            <WishlistItems />
                            <WishlistItems />
                            <WishlistItems />
                            <WishlistItems />
                            <WishlistItems />
                            <WishlistItems />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Wishlist
