// import React from 'react'

import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, useParams } from 'react-router-dom';
import ProductZoom from '../../components/ProductZoom';

import ProductSlider from '../../components/ProductSlider';
import ProductDetailsContent from '../../components/ProductDetailsContent';
import { BsPencilSquare } from 'react-icons/bs';
import { Button, CircularProgress, Rating, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchDataFromApi } from '../../utils/api';


function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

const ProductDetails = (props) => {

    const [activeTab, setActiveTab] = useState(0);
    const [productData, setProductData] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        setIsLoading(true);
        fetchDataFromApi(`/api/product/${id}`).then((res) => {
            if (res?.error === false) {
                setProductData(res?.data);
                setTimeout(() => {
                    setIsLoading(false);
                }, 700);
            }
        })
        window.scrollTo(0, 0);
    }, [id])

    return (

        <>
            <div className="bg-white  pb-2 py-5">
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
            </div>


            <section className="bg-white py-5">
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
                                    <ProductDetailsContent product={productData} />
                                    <div className="tabPanel pt-6">
                                        <div className="flex gap-8 mb-5">
                                            <span className={`link text-[20px] cursor-pointer font-bold transition-all duration-300 ${activeTab === 0 ? "text-[var(--bg-primary)] underline underline-offset-8 duration-300" : ""}`} onClick={() => setActiveTab(0)} id="tabDesc">Description</span>
                                            <span className={`link text-[20px] cursor-pointer font-bold transition-all duration-300 ${activeTab === 1 ? "text-[var(--bg-primary)] underline underline-offset-8 duration-300" : ""}`} onClick={() => setActiveTab(1)} id="tabRev">Reviews(5)</span>
                                        </div>

                                        {
                                            activeTab === 0 && (

                                                <div className="shadow-sm w-full px-8 py-5 border rounded-md">
                                                    {
                                                        productData?.description
                                                    }
                                                </div>

                                            )
                                        }

                                        {
                                            activeTab === 1 && (
                                                <div className="shadow-sm w-full px-8 py-5 border rounded-md">
                                                    <div className="w-full productReviewsContainer">
                                                        <h4 className="font-bold text-[18px] mb-2">Customer questions and answers</h4>

                                                        <div className="reviewScroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden customScroll pr-5">
                                                            <div className="review w-full flex items-center justify-between p-5 border-b">
                                                                <div className="info w-[60%] flex items-start gap-3">
                                                                    <div className="img w-[50px] h-[50px] overflow-hidden rounded-full relative">
                                                                        <img src="https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2184585949.jpg?c=16x9&q=h_833,w_1480,c_fill" alt="user_img" className="
                                                            absolute w-full h-full object-cover" onError={(e) => e.target.src = "https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg"} />
                                                                    </div>
                                                                    <div className="w-[80%]">
                                                                        <h4 className="font-semibold text-[16px]">Elon Musk</h4>
                                                                        <h5 className="font-semibold text-[14px] mb-1">2024-12-28</h5>
                                                                        <p className="text-[14px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolores perspiciatis suscipit non laborum adipisci harum similique ad repellendus cupiditate.</p>
                                                                    </div>
                                                                </div>
                                                                <Rating name="size-medium" defaultValue={4} readOnly />
                                                            </div>
                                                            <div className="review w-full flex items-center justify-between p-5 border-b">
                                                                <div className="info w-[60%] flex items-start gap-3">
                                                                    <div className="img w-[50px] h-[50px] overflow-hidden rounded-full relative">
                                                                        <img src="https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2184585949.jpg?c=16x9&q=h_833,w_1480,c_fill" alt="user_img" className="
                                                            absolute w-full h-full object-cover" onError={(e) => e.target.src = "https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg"} />
                                                                    </div>
                                                                    <div className="w-[80%]">
                                                                        <h4 className="font-semibold text-[16px]">Elon Musk</h4>
                                                                        <h5 className="font-semibold text-[14px] mb-1">2024-12-28</h5>
                                                                        <p className="text-[14px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolores perspiciatis suscipit non laborum adipisci harum similique ad repellendus cupiditate.</p>
                                                                    </div>
                                                                </div>
                                                                <Rating name="size-medium" defaultValue={4} readOnly />
                                                            </div>
                                                            <div className="review w-full flex items-center justify-between p-5 border-b">
                                                                <div className="info w-[60%] flex items-start gap-3">
                                                                    <div className="img w-[50px] h-[50px] overflow-hidden rounded-full relative">
                                                                        <img src="https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2184585949.jpg?c=16x9&q=h_833,w_1480,c_fill" alt="user_img" className="
                                                            absolute w-full h-full object-cover" onError={(e) => e.target.src = "https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg"} />
                                                                    </div>
                                                                    <div className="w-[80%]">
                                                                        <h4 className="font-semibold text-[16px]">Elon Musk</h4>
                                                                        <h5 className="font-semibold text-[14px] mb-1">2024-12-28</h5>
                                                                        <p className="text-[14px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolores perspiciatis suscipit non laborum adipisci harum similique ad repellendus cupiditate.</p>
                                                                    </div>
                                                                </div>
                                                                <Rating name="size-medium" defaultValue={4} readOnly />
                                                            </div>
                                                            <div className="review w-full flex items-center justify-between p-5 border-b">
                                                                <div className="info w-[60%] flex items-start gap-3">
                                                                    <div className="img w-[50px] h-[50px] overflow-hidden rounded-full relative">
                                                                        <img src="https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2184585949.jpg?c=16x9&q=h_833,w_1480,c_fill" alt="user_img" className="
                                                            absolute w-full h-full object-cover" onError={(e) => e.target.src = "https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg"} />
                                                                    </div>
                                                                    <div className="w-[80%]">
                                                                        <h4 className="font-semibold text-[16px]">Elon Musk</h4>
                                                                        <h5 className="font-semibold text-[14px] mb-1">2024-12-28</h5>
                                                                        <p className="text-[14px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolores perspiciatis suscipit non laborum adipisci harum similique ad repellendus cupiditate.</p>
                                                                    </div>
                                                                </div>
                                                                <Rating name="size-medium" defaultValue={4} readOnly />
                                                            </div>
                                                            <div className="review w-full flex items-center justify-between p-5 border-b">
                                                                <div className="info w-[60%] flex items-start gap-3">
                                                                    <div className="img w-[50px] h-[50px] overflow-hidden rounded-full relative">
                                                                        <img src="https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2184585949.jpg?c=16x9&q=h_833,w_1480,c_fill" alt="user_img" className="
                                                            absolute w-full h-full object-cover" onError={(e) => e.target.src = "https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg"} />
                                                                    </div>
                                                                    <div className="w-[80%]">
                                                                        <h4 className="font-semibold text-[16px]">Elon Musk</h4>
                                                                        <h5 className="font-semibold text-[14px] mb-1">2024-12-28</h5>
                                                                        <p className="text-[14px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus dolores perspiciatis suscipit non laborum adipisci harum similique ad repellendus cupiditate.</p>
                                                                    </div>
                                                                </div>
                                                                <Rating name="size-medium" defaultValue={4} readOnly />
                                                            </div>
                                                        </div>

                                                        <br />

                                                        <div className="reviewForm bg-[#fafafa] p-4 rounded-md w-full flex flex-col items-start gap-2">
                                                            <form action="" className="w-full flex flex-col gap-5">
                                                                <TextField
                                                                    id="outlined-textarea"
                                                                    label="Add a review"
                                                                    placeholder="Your feedback helps us improve!"
                                                                    multiline
                                                                    className="w-full textfieldReview"
                                                                />
                                                                <div className="flex items-center justify-between gap-1">
                                                                    <Rating name="ratingStar" size="large" defaultValue={0} />
                                                                    <Button
                                                                        className={`!text-white !bg-yellow-400 !h-[40px] w-52 !text-[16px] flex items-center justify-center gap-1`}
                                                                        onClick={() => { }}>
                                                                        <BsPencilSquare className="text-[16px]" />
                                                                        Submit Review
                                                                    </Button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>

                                </div>
                            </>
                    }

                </div>

                <div className="container">
                    <div className="py-5">
                        <h2 className="text-2xl font-semibold">Related Products</h2>
                        <ProductSlider items={6} />
                    </div>
                </div>
            </section >
        </>
    )
}

export default ProductDetails
