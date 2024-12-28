// import React from 'react'

const ProductImageFlipChange = () => {
  return (
    <div className="flip-container w-full h-full relative">
      {/* Front Image */}
      <img
        src="https://prestashop.coderplace.com/PRS02/PRS02042/demo/320-large_default/hummingbird-printed-t-shirt.jpg"
        alt="product image"
        className="w-full h-full object-cover absolute front-image backface-hidden"
      />

      {/* Back Image */}
      <img
        src="https://prestashop.coderplace.com/PRS02/PRS02042/demo/318-large_default/hummingbird-printed-t-shirt.jpg"
        alt="product image"
        className="w-full h-full object-cover absolute back-image rotate-y-180 backface-hidden"
      />
    </div>
  )
}

export default ProductImageFlipChange
