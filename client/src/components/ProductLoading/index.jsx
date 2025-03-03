import PropTypes from "prop-types";

const ProductLoading = (props) => {
    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 animate-pulse pt-10 pb-12">
                {Array.from({ length: props?.size }).map((_, index) => (
                    <div className="col w-full h-[338px] flex flex-col gap-2" key={index}>
                        <div className="flex items-center justify-center w-full h-[250px] bg-gray-300 rounded-md">
                            <svg className="w-10 h-10 text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                            </svg>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-sm w-[70%]"></div>
                        <div className="h-2 bg-gray-200 rounded-sm w-[100%]"></div>
                        <div className="h-2 bg-gray-200 rounded-sm w-[100%]"></div>
                        <div className="flex items-center gap-3">
                            <div className="h-3.5 bg-gray-200 rounded-sm w-[20%]"></div>
                            <div className="h-3.5 bg-gray-200 rounded-sm w-[20%]"></div>
                            <div className="h-3.5 bg-gray-200 rounded-sm w-[20%]"></div>
                        </div>
                    </div>
                ))}
            </div>
        </>

    )
}

ProductLoading.propTypes = {
    size: PropTypes.number.isRequired, // Ensures size is a number
};

export default ProductLoading
