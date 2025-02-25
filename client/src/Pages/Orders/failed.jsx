
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const OrderFailed = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(7); // Initial countdown value

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        // Redirect after 5 seconds
        const redirectTimer = setTimeout(() => {
            navigate('/checkout');
        }, 7000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimer);
        };
    }, [navigate]);

    return (
        <section className="w-full h-[500px] p-10 flex items-center justify-center flex-col bg-white">

            <DotLottieReact
                src="https://lottie.host/de911eaa-dcc8-4b05-9f54-6237f91b39d8/1LO7tnLvc9.lottie"
                loop
                autoplay
                style={{ width: "200px", height: "auto" }} // Adjust size as needed
            />

            <h3 className="text-[20px] font-bold mt-4">
            Oops! Order Not Placed!...
            </h3>
            <p className="text-[18px] font-normal">Please try again or contact support.</p>
            <p className="text-[14px] text-gray-500">Redirecting in {countdown} seconds...</p>

        </section>
    );
};

export default OrderFailed;

