// import React from 'react'

import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import ProductZoom from '../../components/ProductZoom';

import ProductSlider from '../../components/ProductSlider';
import ProductDetailsContent from '../../components/ProductDetailsContent';


function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

const ProductDetails = () => {

    
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

                    <div className="productZoomContainer w-[40%] p-3">
                        <ProductZoom />
                    </div>

                    <div className="productContent w-[60%] p-3">
                        <ProductDetailsContent />

                    </div>
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
