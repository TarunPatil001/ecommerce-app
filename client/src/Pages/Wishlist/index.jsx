import { useContext, useEffect, useState } from 'react'
import { CircularProgress, Divider } from '@mui/material'
import { MyContext } from '../../App'
import WishlistItems from './wishlistItems'
import AccountSidebar from '../../components/AccountSidebar'
import { fetchDataFromApi } from '../../utils/api'

const Wishlist = () => {

    const context = useContext(MyContext);
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(null);


    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setIsLoading(true);
                const res = await fetchDataFromApi('/api/wishlist/get-wishlist');

                if (res?.error === false) {
                    console.log(res.data);
                    setWishlist(res.data);
                } else {
                    console.error('Failed to fetch wishlist:', res?.message || 'Unknown error');
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, []);



    return (
        <section className="py-10 w-full">
            <div className="container flex w-full flex-col sm:flex-row gap-4">
                {
                    context?.windowWidth > 992 &&
                    <AccountSidebar />
                }
                <div className="w-full">
                    <div className="shadow-md rounded-md bg-white flex flex-col gap-2 md:min-h-[474px]">
                        <div className="p-5 pb-2">
                            <h2 className="font-bold">My Wishlist</h2>
                            <p className="mt-0">There are <span className="font-bold text-[var(--bg-primary)]">{wishlist.length}</span> product{wishlist.length <= 1 ? ("") : ("s")} in your wishlist.</p>
                        </div>
                        <Divider />
                        {isLoading ? (
                            <div className="w-full h-[200px] flex items-center justify-center">
                                <CircularProgress sx={{ color: 'var(--bg-primary)' }} />
                            </div>
                        ) :
                            wishlist?.length !== 0 ? (
                                <div className="flex items-center flex-col p-3 gap-4">
                                    {/* <div className={`grid grid-cols-5 md:grid-cols-5 gap-3 p-3`}> */}
                                    {
                                        wishlist?.map((item, index) => {
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
                            ) : (

                                <>
                                    <img src="../empty-wishlist.png" className='w-[200px] mx-auto mt-[30px]' />
                                    <span className='mx-auto mt-5 text-[20px] font-bold'>Empty Wishlist</span>
                                    <span className='mx-auto text-[14px] pb-5'>You have no items in your wishlist. Start adding!</span>
                                </>
                            )
                        }
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Wishlist
