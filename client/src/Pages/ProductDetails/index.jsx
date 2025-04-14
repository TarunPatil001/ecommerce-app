// import React from 'react'

import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, useParams } from 'react-router-dom';
import ProductZoom from '../../components/ProductZoom';

import ProductSlider from '../../components/ProductSlider';
import ProductDetailsContent from '../../components/ProductDetailsContent';
import { CircularProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import Reviews from './reviews';


function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

const ProductDetails = () => {

    // const context = useContext(MyContext);
    // const [activeTab, setActiveTab] = useState(0);
    const [productData, setProductData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [reviewsCount, setReviewsCount] = useState(0);
    const [relatedProductData, setRelatedProductData] = useState([]);


    // Ref for scrolling to reviews
    const reviewsRef = useRef(null);

    const { id } = useParams();

    useEffect(() => {
        setIsLoading(true);

        fetchDataFromApi(`/api/product/${id}`).then((res) => {
            if (res?.error === false && res?.data) {
                setProductData(res.data);

                fetchDataFromApi(`/api/product/get-all-products-bySubCategoryId/${res?.data?.subCategoryId}`).then((res) => {
                    if (res?.error === false && res?.data) {
                        // Filter out the current product from the related products
                        const filteredProducts = res.data.filter(product => product._id !== id);
                        setRelatedProductData(filteredProducts);
                        console.log(filteredProducts);
                    }
                });
            } else {
                setProductData([]); // Ensuring productData is always an array
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 700);
        });


        fetchDataFromApi(`/api/user/getReviews?productId=${id}`).then((res) => {
            if (res?.error === false && res?.data) {
                setReviewsCount(res.data.length);
            } else {
                setReviewsCount(0); // Ensuring reviewsCount is always a number
            }
        });


        window.scrollTo(0, 0);
    }, [id]);

    const gotoReviews = () => {
        reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
    };



    return (

        <>
            {/* <div className="bg-white  pb-2 py-5">
                <div className="container px-5 flex items-center bg-white">
                    <Breadcrumbs separator={"/"} aria-label="breadcrumb" className="!text-[var(--text-dark)]">
                        <Link
                            underline="hover"
                            key="1" color="inherit"
                            href="/"
                            onClick={handleClick}
                            className="link transition capitalize text-[14px] hover:underline underline-offset-4">
                            Home
                        </Link>
                        <Link
                            underline="hover"
                            key="2"
                            color="inherit"
                            href="/material-ui/getting-started/installation/"
                            onClick={handleClick}
                            className="link transition capitalize text-[14px] hover:underline underline-offset-4"
                        >
                            Fashion
                        </Link>
                        <Link
                            underline="hover"
                            key="3"
                            color="inherit"
                            href="/material-ui/getting-started/installation/"
                            onClick={handleClick}
                            className="link transition capitalize text-[14px] hover:underline underline-offset-4"
                        >
                            Men
                        </Link>
                        <Link
                            underline="hover"
                            key="4"
                            color="inherit"
                            href="/material-ui/getting-started/installation/"
                            onClick={handleClick}
                            className="link transition capitalize text-[14px] font-bold text-[var(--text-dark)] hover:underline underline-offset-4"
                        >
                            T-Shirt
                        </Link>

                    </Breadcrumbs>
                </div>
            </div> */}


            {/* <section className="bg-white py-5">
                <div className="container flex gap-4">

                    {
                        isLoading === true ?
                            <div className='flex items-center justify-center w-full h-[50vh]'>
                                <CircularProgress sx={{ color: 'var(--bg-primary)' }} />
                            </div>
                            :
                            <>
                                <div className="productZoomContainer w-[40%] p-3">
                                    <ProductZoom images={productData?.images} />
                                </div>

                                <div className="productContent w-[60%] p-3">
                                    <ProductDetailsContent product={productData} reviewsCount={reviewsCount} gotoReviews={gotoReviews} />
                                    <div className="tabPanel pt-6">
                                        
                                        
                                        <div className="shadow-sm w-full px-8 py-5 border rounded-md mb-5">
                                            <h2 className="text-[18px] font-bold text-[var(--text-dark)] mb-3">Seller Details</h2>
                                            <p className="text-[16px]">
                                                Seller: {productData?.seller?.sellerName || "No description available."}
                                            </p>
                                        </div>

                                       
                                        <div className="shadow-sm w-full px-8 py-5 border rounded-md" ref={reviewsRef}>
                                            <h2 className="text-[18px] font-bold text-[var(--text-dark)] mb-3">
                                                Review{reviewsCount >= 2 ? "s" : ""} ({reviewsCount})
                                            </h2>

                                            {productData && productData.length !== 0 ? (
                                                <Reviews productId={productData?._id} setReviewsCount={setReviewsCount} />
                                            ) : (
                                                <p className="text-[16px]">No reviews available.</p>
                                            )}
                                        </div>


                                    </div>
                                </div>
                            </>
                    }

                </div>


                {
                    relatedProductData.length !== 0 &&
                    <div className="container">
                        <div className="py-5">
                            <h2 className="text-2xl font-semibold">Related Products</h2>
                            <ProductSlider items={6} data={relatedProductData} />
                        </div>
                    </div>
                }
            </section > */}

<div className="bg-white pb-2 py-5">
    <div className="container px-4 sm:px-5 flex items-center bg-white">
        <Breadcrumbs separator="/" aria-label="breadcrumb" className="!text-[var(--text-dark)] text-sm">
            <Link
                underline="hover"
                key="1"
                color="inherit"
                href="/"
                onClick={handleClick}
                className="link transition capitalize text-sm hover:underline underline-offset-4"
            >
                Home
            </Link>
            <Link
                underline="hover"
                key="2"
                color="inherit"
                href="/material-ui/getting-started/installation/"
                onClick={handleClick}
                className="link transition capitalize text-sm hover:underline underline-offset-4"
            >
                Fashion
            </Link>
            <Link
                underline="hover"
                key="3"
                color="inherit"
                href="/material-ui/getting-started/installation/"
                onClick={handleClick}
                className="link transition capitalize text-sm hover:underline underline-offset-4"
            >
                Men
            </Link>
            <Link
                underline="hover"
                key="4"
                color="inherit"
                href="/material-ui/getting-started/installation/"
                onClick={handleClick}
                className="link transition capitalize text-sm font-bold text-[var(--text-dark)] hover:underline underline-offset-4"
            >
                T-Shirt
            </Link>
        </Breadcrumbs>
    </div>
</div>

<section className="bg-white py-5">
    <div className="container flex flex-col lg:flex-row gap-6">
        {isLoading ? (
            <div className="flex items-center justify-center w-full h-[50vh]">
                <CircularProgress sx={{ color: 'var(--bg-primary)' }} />
            </div>
        ) : (
            <>
                {/* Product Image Section */}
                <div className="productZoomContainer w-full lg:w-[40%] p-3">
                    <ProductZoom images={productData?.images} />
                </div>

                {/* Product Details Section */}
                <div className="productContent w-full lg:w-[60%] p-3">
                    <ProductDetailsContent
                        product={productData}
                        reviewsCount={reviewsCount}
                        gotoReviews={gotoReviews}
                    />

                    <div className="tabPanel pt-6 space-y-5">
                        {/* Seller Details */}
                        <div className="shadow-sm w-full px-4 md:px-8 py-4 md:py-5 border rounded-md">
                            <h2 className="text-[18px] font-bold text-[var(--text-dark)] mb-3">Seller Details</h2>
                            <p className="text-[16px]">
                                Seller: {productData?.seller?.sellerName || "No description available."}
                            </p>
                        </div>

                        {/* Reviews */}
                        <div className="shadow-sm w-full px-4 md:px-8 py-4 md:py-5 border rounded-md" ref={reviewsRef}>
                            <h2 className="text-[18px] font-bold text-[var(--text-dark)] mb-3">
                                Review{reviewsCount >= 2 ? "s" : ""} ({reviewsCount})
                            </h2>

                            {productData && productData.length !== 0 ? (
                                <Reviews productId={productData?._id} setReviewsCount={setReviewsCount} />
                            ) : (
                                <p className="text-[16px]">No reviews available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )}
    </div>

    {/* Related Products */}
    {relatedProductData.length !== 0 && (
        <div className="container px-4 sm:px-5">
            <div className="py-5">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Related Products</h2>
                <ProductSlider items={window.innerWidth < 640 ? 2 : window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 4 : window.innerWidth < 1280 ? 5 : 6} data={relatedProductData} />
            </div>
        </div>
    )}
</section>

        </>
    )
}

export default ProductDetails
