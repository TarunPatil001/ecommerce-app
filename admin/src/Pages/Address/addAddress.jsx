import { Button, CircularProgress, MenuItem, Select } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MyContext } from '../../App';
import { PhoneInput } from 'react-international-phone';
import toast from 'react-hot-toast';
import { fetchDataFromApi, postData } from '../../utils/api';

const AddAddress = () => {

    const context = useContext(MyContext);
    const formRef = useRef(null);
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState("");
    const [status, setStatus] = useState("");

    const [formFields, setFormFields] = useState({
        address_line1: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        mobile: '',
        status: '',
        userId: '',
        selected: false,
    });


    useEffect(() => {
        setFormFields((prevState) => ({
            ...prevState,
            userId: context?.userData?._id,
        }));
    }, [context?.userData]);



    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setFormFields((prevState) => ({
            ...prevState,
            status: event.target.value, // Update only the status field
        }));
    };


    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((formFields) => ({
            ...formFields,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (formFields.address_line1 === "") {
            context.openAlertBox("error", "Please enter address line 1");
            return;
        }
        if (formFields.city === "") {
            context.openAlertBox("error", "Please enter city");
            return;
        }
        if (formFields.state === "") {
            context.openAlertBox("error", "Please enter state");
            return;
        }
        if (formFields.pincode === "") {
            context.openAlertBox("error", "Please enter pincode");
            return;
        }
        if (formFields.country === "") {
            context.openAlertBox("error", "Please enter country");
            return;
        }
        if (phone === "") {
            context.openAlertBox("error", "Please enter mobile");
            return;
        }

        setIsLoading(true);

        try {
            const result = await toast.promise(
                postData("/api/address/add-address", formFields, { withCredentials: true }),
                {
                    loading: "Submitting address... Please wait.",
                    success: (res) => {
                        if (res?.success) {
                            // Handle success logic here
                            // Fetch addresses when the component mounts
                            fetchDataFromApi(`/api/address/get-address?userId=${context?.userData?._id}`).then((res) => {
                                context?.setAddress(res.data); // Store the fetched addresses in state
                                // console.log(res);
                            });
                            return res.message || "Address added successfully!";

                        } else {
                            throw new Error(res?.message || "An unexpected error occurred.");
                        }
                    },
                    error: (err) => {
                        // Check if err.response exists, else fallback to err.message
                        const errorMessage = err?.response?.data?.message || err.message || "Failed to add address. Please try again.";
                        return errorMessage;
                    },
                }
            );
            console.log("Result:", result);
        } catch (err) {
            console.error("Error:", err);
            toast.error(err?.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }

    }


    const handleDiscard = () => {
        // Reset the form state and other variables
        setFormFields({
            address_line1: '',
            city: '',
            state: '',
            pincode: '',
            country: '',
            mobile: '',
            status: '',
            userId: '',
        });
        setPhone(''); // Reset phone separately
        setStatus(''); // Reset status
        if (formRef.current) {
            formRef.current.reset(); // Reset the form elements
        }
        console.log("Form fields have been reset.");
    };



    return (
        <div>
            <section className='p-8'>
                <form
                    action="#"
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className='form py-3'>
                    <h3 className='text-[24px] font-bold mb-2'>Add New Address</h3>
                    <div className="grid grid-cols-2 p-5 pt-1 mb-4 gap-4">
                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Address Line 1</h3>
                            <input type="text" name='address_line1' className='w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm' placeholder='Add address line 1' value={formFields?.address_line1} disabled={isLoading} onChange={onChangeInput} />
                        </div>
                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>City</h3>
                            <input type="text" name='city' className='w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm' placeholder='Add city' value={formFields?.city} disabled={isLoading} onChange={onChangeInput} />
                        </div>
                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>State</h3>
                            <input type="text" name='state' className='w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm' placeholder='Add state' value={formFields?.state} disabled={isLoading} onChange={onChangeInput} />
                        </div>
                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Country</h3>
                            <input type="text" name='country' className='w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm' placeholder='Add country' value={formFields?.country} disabled={isLoading} onChange={onChangeInput} />
                        </div>
                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Pincode</h3>
                            <input type="text" name='pincode' maxLength={6} pattern='\d*' className='w-full h-[40px] border border-[rgba(0,0,0,0.1)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-md p-3 text-sm' placeholder='Add pincode' value={formFields?.pincode} disabled={isLoading} onChange={onChangeInput} />
                        </div>
                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Mobile No.</h3>
                            <PhoneInput defaultCountry="in" preferredCountries={["in"]} value={phone} onChange={(phone) => { setPhone(phone); setFormFields((prevState) => ({ ...prevState, mobile: phone })) }} className={`!w-full h-[40px] flex items-center ${isLoading === true ? "cursor-not-allowed pointer-events-none" : ""}`} disabled={isLoading} />
                        </div>
                        <div className='col'>
                            <h3 className='text-[14px] font-medium mb-1 text-gray-700'>Status</h3>
                            <Select
                                value={status}
                                onChange={handleStatusChange}
                                displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                className={`w-full h-[40px]`}
                            >
                                <MenuItem value="" disabled>
                                    Select Status
                                </MenuItem>
                                <MenuItem value={true}>Active</MenuItem>
                                <MenuItem value={false}>InActive</MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div className='!overflow-x-hidden w-full h-[70px] fixed bottom-0 right-0 bg-white flex items-center justify-end px-10 gap-4 z-[49] border-t border-[rgba(0,0,0,0.1)] custom-shadow'>
                        <Button
                            type="reset"
                            onClick={handleDiscard}
                            className='!bg-red-500 !text-white w-[150px] h-[40px] flex items-center justify-center gap-2 '
                        >
                            <FaCloudUploadAlt className='text-[20px]' />Discard
                        </Button>
                        <Button type='submit' className={`${isLoading === true ? "custom-btn-disabled" : "custom-btn"}  w-[150px] h-[40px] flex items-center justify-center gap-2`} disabled={isLoading}>
                            {
                                isLoading ? <CircularProgress color="inherit" /> : <><FaCloudUploadAlt className='text-[20px]' />Create</>
                            }
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default AddAddress;
