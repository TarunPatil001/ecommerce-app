// import React from 'react'

const ProductImageOpacityChange = (props) => {
    return (
        <div className="h-full w-full flex items-center justify-center overflow-hidden relative">
            <img
                src={props?.firstImg}
                className="w-auto h-full"
            />
            <img
                src={props?.SecondImg}
                alt="product image"
                className="w-auto h-full absolute top-0 left-0 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
            />
        </div>
    )
}

export default ProductImageOpacityChange
