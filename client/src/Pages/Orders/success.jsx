
import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(7); // Initial countdown value

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        // Redirect after 5 seconds
        const redirectTimer = setTimeout(() => {
            navigate('/');
        }, 7000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimer);
        };
    }, [navigate]);

    return (
        <section className="w-full p-10 flex items-center justify-center flex-col bg-white">

            <DotLottieReact
                src="https://lottie.host/aac97f52-7dc7-44d9-ad25-feb5c6ef89aa/yMgPeIP69n.lottie"
                loop
                autoplay
                style={{ width: "600px" }} // Adjust size as needed
            />

            <h3 className="text-[20px] font-bold">
                Your order is placed <span className="text-[20px] text-green-500">&#10004;</span>
            </h3>
            <p className="text-[18px] font-normal">Thank you for shopping with us!</p>
            <p className="text-[14px] text-gray-500">Redirecting in {countdown} seconds...</p>
            
        </section>
    );
};

export default OrderSuccess;

