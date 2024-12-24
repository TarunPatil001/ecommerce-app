import React from 'react'

const ProductImageOpacityChange = () => {
    return (
        <div className="h-[250px] overflow-hidden">
            <img
                src="https://api.spicezgold.com/download/file_1734529474612_gespo-peach-solid-mandarin-collar-half-sleeve-casual-t-shirt-product-images-rvrtzhyumb-0-202304080900.webp"
                alt="product image"
                className="w-full"
            />
            <img
                src="https://api.spicezgold.com/download/file_1734529474613_gespo-peach-solid-mandarin-collar-half-sleeve-casual-t-shirt-product-images-rvrtzhyumb-1-202304080900.jpg"
                alt="product image"
                className="w-full absolute top-0 left-0 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
            />
        </div>
    )
}

export default ProductImageOpacityChange
