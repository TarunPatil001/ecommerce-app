import PropTypes from 'prop-types';
import { useContext, useState } from 'react'
import { MyContext } from '../../App';

const OtpBox = ({ length, onChange }) => {

    const context = useContext(MyContext);
    const [otp, setOtp] = useState(new Array(length).fill(""));

    const handleChange = (element, index) => {
        const value = element.value;
        if (isNaN(value)) return; // only numbers allowed

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        onChange(newOtp.join(""));

        if (value && index < length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    };

    return (
        <>
            {/* <div className="otpBox flex justify-center gap-2">
                {
                    otp.map((item, index) => (
                        <input key={index} id={`otp-input-${index}`} type="text" maxLength="1" value={otp[index]} onChange={(e) => handleChange(e.target, index)} onKeyDown={(e) => handleChange(e, index)} className="w-[45px] h-[45px] text-center text-[17px]" />
                    ))
                }
            </div> */}
            <div className="otpBox flex justify-center gap-2 flex-wrap">
                {otp.map((item, index) => (
                    <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        maxLength="1"
                        value={otp[index]}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleChange(e, index)}
                        className={`${context?.windowWidth < 380 ? "w-8 h-8" : "w-10 h-10"} sm:w-11 sm:h-11 md:w-[45px] md:h-[45px] text-center text-[17px] border border-gray-300 rounded-md focus:outline-none focus:border-black`}
                    />
                ))}
            </div>

        </>
    )
}


OtpBox.propTypes = {
    length: PropTypes.number.isRequired, // Ensures length is a number
    onChange: PropTypes.func.isRequired, // Ensures onChange is a function
};

export default OtpBox
