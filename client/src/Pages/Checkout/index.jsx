import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { MyContext } from '../../App';
import { Button, Checkbox, CircularProgress, Dialog, DialogTitle, Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import TextField from '@mui/material/TextField';
import CartTotal from '../Cart/cartTotal';
import { Link, useNavigate } from 'react-router-dom';
import { IoBagCheck } from 'react-icons/io5';
import { deleteData, editData, fetchDataFromApi, postData } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiEdit, FiPlus } from 'react-icons/fi';
import { TbDotsVertical } from 'react-icons/tb';
import { IoIosSave } from 'react-icons/io';
import { RiResetLeftFill } from 'react-icons/ri';
import { MuiPhone } from '../../components/MuiPhone';
import { GiTakeMyMoney } from 'react-icons/gi';
import { SiRazorpay } from "react-icons/si";
import { FaPaypal } from 'react-icons/fa';
import axios from 'axios';

const VITE_APP_RAZORPAY_KEY_ID = import.meta.env.VITE_APP_RAZORPAY_KEY_ID;
const VITE_APP_RAZORPAY_KEY_SECRET = import.meta.env.VITE_APP_RAZORPAY_KEY_SECRET;
const VITE_APP_PAYPAL_CLIENT_ID = import.meta.env.VITE_APP_PAYPAL_CLIENT_ID;
const VITE_API_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {

    const context = useContext(MyContext);
    const navigate = useNavigate();

    const formRef = useRef(); // Create ref to the form
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    // const [isLoading3, setIsLoading3] = useState(false);
    const [address, setAddress] = useState([]);
    const [isAddressType, setIsAddressType] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const [userIdForEdit, setUserIdForEdit] = useState("");
    const [addressIdForEdit, setAddressIdForEdit] = useState("");
    const [deliverTo, setDeliverTo] = useState("");

    const [phone, setPhone] = useState('');
    const [error, setError] = useState(false);
    const [status, setStatus] = useState("");
    const [isOpenModel, setIsOpenModel] = useState(false);


    const nameRef = useRef(null);
    const addressLine1Ref = useRef(null);
    const cityRef = useRef(null);
    const stateRef = useRef(null);
    const countryRef = useRef(null);
    const pincodeRef = useRef(null);
    const mobileRef = useRef(null);
    const addressTypeRef = useRef(null);

    const [totalMRP, setTotalMRP] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const [formFields, setFormFields] = useState({
        name: '',
        address_line1: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        mobile: '',
        addressType: '',
        status: '',
        userId: '',
        selected: false,
    });

    // const calculateTotal = () => {
    //     let totalMRP = 0;
    //     let discount = 0;
    //     // let couponDiscount = 0;
    //     // let platformFee = 49; // If applicable
    //     // let shippingFee = 79; // If applicable

    //     context?.cartData?.forEach(item => {
    //         totalMRP += item?.subTotalOldPrice || 0;
    //         discount += item?.subTotalOldPrice - item?.subTotal || 0;
    //     });

    //     setTotalAmount(totalMRP - discount); // Final payable amount

    //     return { totalMRP, discount, setTotalAmount };
    // };

    // const { totalMRP, discount, setTotalAmount } = calculateTotal(); // Destructuring values




    useEffect(() => {
        if (context?.cartData?.length !== 0) {
            const calculatedTotalMRP = context?.cartData?.reduce((total, item) => total + (item?.subTotalOldPrice || 0), 0);
            const calculatedDiscount = context?.cartData?.reduce((total, item) => total + ((item?.subTotalOldPrice || 0) - (item?.subTotal || 0)), 0);
            const calculatedTotalAmount = calculatedTotalMRP - calculatedDiscount;

            setTotalMRP(calculatedTotalMRP);
            setDiscount(calculatedDiscount);
            setTotalAmount(calculatedTotalAmount);

            // localStorage.setItem("totalAmount", calculatedTotalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }));
        } else {
            setTotalMRP(0);
            setDiscount(0);
            setTotalAmount(0);
            // localStorage.setItem("totalAmount", "0");
        }
    }, [context?.cartData]);



    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            context?.setIsLogin(true);
        } else {
            navigate("/");
        }

        // Set phone only if user data exists
        if (context?.userData) {
            const validPhone = context?.userData?.mobile ? String(context?.userData?.mobile) : "";
            setPhone(validPhone);
        }
    }, [context, navigate]);

    // Effect for setting userId in form fields when context changes
    useEffect(() => {
        window.scrollTo(0, 0);

        const userId = context?.userData?._id;
        if (userId) {
            setFormFields((prevState) => ({
                ...prevState,
                userId: context.userData._id,
            }));
        }


    }, [context?.userData]);

    const fetchAddress = useCallback(() => {
        if (!context?.userData?._id) return;

        setIsLoading(true);
        fetchDataFromApi(`/api/address/get-address?userId=${context?.userData?._id}`)
            .then((res) => setAddress(res.data))
            .catch((err) => console.error("Error fetching address:", err))
            .finally(() => setIsLoading(false));
    }, [context?.userData]);  // ✅ Stable function that updates only when userData changes

    useEffect(() => {
        fetchAddress();
    }, [fetchAddress]);  // ✅ Triggers only when fetchAddress reference changes

    useEffect(() => {
        setIsOpen(null); // Reset popover when addresses update
    }, [address]); // Run whenever address list changes


    // Effect for fetching address data
    useEffect(() => {
        if (context?.userData?._id) {
            setIsLoading(true);  // Start loading
            fetchDataFromApi(`/api/address/get-address?userId=${context?.userData?._id}`)
                .then((res) => {

                    setAddress(res.data);  // Set the fetched address data
                    setIsLoading(false);    // Stop loading

                })
                .catch((err) => {
                    console.error("Error fetching data from API:", err);
                    setIsLoading(false);  // Stop loading in case of error
                });
        }
    }, [context?.userData?._id]);




    // Effect for handling address edits and populating form fields
    useEffect(() => {
        const { userId, addressId } = { userId: userIdForEdit, addressId: addressIdForEdit };

        if (!addressId) {
            setAddressIdForEdit(undefined);
            setUserIdForEdit(context?.userData?._id);
            setFormFields({
                name: '',
                address_line1: "",
                landmark: '',
                city: "",
                state: "",
                pincode: "",
                country: "India",
                mobile: "",
                addressType: '',
                status: "",
                userId: userId || context?.userData?._id,
            });
            setPhone("");
            setIsAddressType("");
            setStatus("");
            return;
        }

        if (addressId && userId) {
            setAddressIdForEdit(addressId);
            setUserIdForEdit(userId);
            const fetchAddressData = async () => {
                try {
                    const response = await fetchDataFromApi(
                        `/api/address/get-single-address?userId=${userId}&_id=${addressId}`,
                        { withCredentials: true }
                    );

                    if (response.success && response.data) {
                        const address = response.data;
                        setIsAddressType(address.addressType || "");
                        setFormFields({
                            name: address.name || "",
                            address_line1: address.address_line1 || "",
                            landmark: address.landmark || "",
                            city: address.city || "",
                            state: address.state || "",
                            pincode: address.pincode || "",
                            country: address.country || "",
                            addressType: address.addressType || "",
                            status: address.status || "",
                            userId: address.userId || userId,

                        });

                        const validPhone = address.mobile ? String(address.mobile) : "";
                        setPhone(validPhone);

                        const statusValue = address.status === true || address.status === false ? address.status : "";
                        setStatus(statusValue);
                    } else {
                        console.error("Address data not found or response unsuccessful.");
                    }
                } catch (error) {
                    console.error("Error fetching address:", error);
                }
            };

            fetchAddressData();
        }
    }, [userIdForEdit, addressIdForEdit, context?.userData?._id, context?.isReducer]);

    // // Effect to manage selected address
    // useEffect(() => {
    //     const safeAddress = address || [];  // Ensure address is an array (in case it's null or undefined)

    //     // Find the address that is selected
    //     const selectedAddress = safeAddress.find(addr => addr.selected === true);

    //     if (selectedAddress) {
    //         // Set the selected address ID
    //         setSelectedValue(selectedAddress._id);
    //         setDeliverTo(selectedAddress.name);
    //     } else {
    //         // No address is selected, set a default value or handle as needed
    //         setSelectedValue(null);  // Example: Set selectedValue to null if no address is selected
    //     }
    // }, [address]); // This effect runs whenever the address list changes


    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleStatusChange = (event) => {
        const value = event.target.checked;
        setStatus(value);
        setFormFields((prevState) => ({
            ...prevState,
            status: value,
        }));
    };

    const handleAddressType = (event) => {
        const value = event.target.value;
        setIsAddressType(value);
        setFormFields((prevState) => ({
            ...prevState,
            addressType: value,
        }));
    }

    const handleClickOpen = (addressId) => {
        setUserIdForEdit(context?.userData?._id);
        setAddressIdForEdit(undefined);
        console.log(userIdForEdit);
        console.log(addressId);
        setIsOpenModel(true);
        context.forceUpdate();
    };

    const handleClose = () => {
        setIsOpenModel(false);
        formRef.current.reset();
        setFormFields({
            name: '',
            address_line1: '',
            landmark: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            mobile: '',
            addressType: '',
        });
        setPhone('');
        setStatus('');
        setError(false);
    };

    const getOrderDetails = () => {
        fetchDataFromApi(`/api/order/order-list`)
            .then((res) => {
                console.log("API Response:", res);
            })
            .catch((err) => {
                console.error("API Error:", err);
            });
    }

    useEffect(() => {
        getOrderDetails();
    }, [context?.userData])

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form fields
        if (!formFields.name) {
            context.openAlertBox("error", "Please enter name");
            nameRef.current.focus();
            return;
        }
        if (!formFields.address_line1) {
            context.openAlertBox("error", "Please enter address line 1");
            addressLine1Ref.current.focus();
            return;
        }
        if (!formFields.city) {
            context.openAlertBox("error", "Please enter city");
            cityRef.current.focus();
            return;
        }
        if (!formFields.state) {
            context.openAlertBox("error", "Please enter state");
            stateRef.current.focus();
            return;
        }
        if (!formFields.pincode) {
            context.openAlertBox("error", "Please enter pincode");
            pincodeRef.current.focus();
            return;
        }
        if (!formFields.country) {
            context.openAlertBox("error", "Please enter country");
            countryRef.current.focus();
            return;
        }
        if (!phone) {
            context.openAlertBox("error", "Please enter mobile");
            mobileRef.current.focus();
            return;
        }
        if (!isAddressType) {
            context.openAlertBox("error", "Please select address type");
            addressTypeRef.current.focus();
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
                            // Optimistically update the address list by adding the new address
                            const newAddress = res?.data;  // Assuming the new address data is returned
                            context?.setAddress((prevAddresses) => [...prevAddresses, newAddress]);  // Add the new address to the list

                            // Optionally, fetch updated addresses from the API to get the full list
                            fetchDataFromApi(`/api/address/get-address?userId=${context?.userData?._id}`).then((res) => {
                                context?.setAddress(res.data); // Update state with fresh data
                            });
                            fetchAddress();
                            handleClose();  // Close modal or form
                            return res.message || "Address added successfully!";
                        } else {
                            throw new Error(res?.message || "An unexpected error occurred.");
                        }
                    },
                    error: (err) => {
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
    };


    const handleEditClick = (userId, addressId) => {

        setAddressIdForEdit(addressId);
        setUserIdForEdit(userId);
        console.log("Edit Click userid", userId);
        console.log("Edit Click addressId", addressId);


        const fetchAddressData = async () => {
            try {
                const response = await fetchDataFromApi(
                    `/api/address/get-single-address?userId=${userId}&_id=${addressId}`,
                    { withCredentials: true }
                );

                if (response.success && response.data) {
                    const address = response.data;

                    setFormFields({
                        name: address.name || "",
                        address_line1: address.address_line1 || "",
                        landmark: address.landmark || "",
                        city: address.city || "",
                        state: address.state || "",
                        pincode: address.pincode || "",
                        country: address.country || "",
                        addressType: address.addressType || "",
                        status: address.status || "",
                        userId: address.userId || userId,
                    });

                    const validPhone = address.mobile ? String(address.mobile) : "";
                    setPhone(validPhone);

                    const statusValue = address.status === true || address.status === false ? address.status : "";
                    setStatus(statusValue);
                } else {
                    console.error("Address data not found or response unsuccessful.");
                }
            } catch (error) {
                console.error("Error fetching address:", error);
            }
        };

        fetchAddressData();
        fetchAddress();

        setIsOpenModel(true); // Open modal or form for editing

    };


    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await toast.promise(
                editData("/api/address/update-address", {
                    ...formFields,
                    userId: context?.userData?._id,
                    addressId: addressIdForEdit,
                }, { withCredentials: true }),
                {
                    loading: "Updating address... Please wait.",
                    success: (res) => {
                        if (res?.success) {
                            const updatedAddresses = context?.address?.map((address) =>
                                address._id === addressIdForEdit
                                    ? { ...address, ...formFields }
                                    : address
                            );
                            context?.setAddress(updatedAddresses); // Update the address state
                            fetchAddress();
                            handleClose();
                            return res.message || "Address updated successfully!";
                        } else {
                            throw new Error(res?.message || "An unexpected error occurred.");
                        }
                    },
                    error: (err) => {
                        const errorMessage = err?.response?.data?.message || err.message || "Failed to update address. Please try again.";
                        return errorMessage;
                    },
                }
            );
            console.log("Update Result:", result);
        } catch (err) {
            console.error("Error in handleUpdate:", err);
            toast.error(err?.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false); // Hide the loading spinner
        }
    };


    const handleDeleteAddress = async (e, addressId) => {
        e.preventDefault();
        // Start loading and disable the fields
        setIsLoading2(true);

        try {
            // Delete address API call wrapped with toast.promise
            const result = await toast.promise(
                postData("/api/address/delete-address", {
                    userId: context?.userData?._id, // Replace with the actual userId
                    addressId: addressId, // Address ID to delete
                }, { withCredentials: true }),
                {
                    loading: "Deleting address... Please wait.",
                    success: (res) => {
                        if (res && res.error === false) {
                            // Handle success, e.g., remove the address from the state
                            setAddress(Array.isArray(address) ? address.filter(addr => addr._id !== addressId) : []);
                            fetchAddress();
                            return res?.message;
                        } else {
                            throw new Error(res?.message || "Oops! Server is slow. Try again!");
                        }
                    },
                    error: (err) => {
                        // Ensure err.response exists and check the message structure
                        const errorMessage = err?.response?.data?.message || err.message || "An unexpected error occurred. Please try again.";
                        return errorMessage;
                    },
                }
            ).then((res) => {
                console.log(res);
                // Add any additional success actions here
            }).catch((err) => {
                console.error(err);
            });
        } catch (err) {
            // Final fallback for unexpected errors
            return err.message || "An error occurred while deleting the address.";
        } finally {
            setIsLoading2(false);
        }
    };


    useEffect(() => {
        if (Array.isArray(address) && address.length > 0) {
            const selectedAddress = address.find(addr => addr.selected === true);

            if (selectedAddress) {
                setSelectedValue(prevValue => {
                    if (prevValue !== selectedAddress._id) {
                        console.log("Updating selectedValue:", selectedAddress._id);
                    }
                    return selectedAddress._id;
                });

                setDeliverTo(prevName => {
                    if (prevName !== selectedAddress.name) {
                        console.log("Updating deliverTo:", selectedAddress.name);
                    }
                    return selectedAddress.name;
                });
            } else {
                console.warn("No selected address found. Resetting values.");
                setSelectedValue(null);
                setDeliverTo("");
            }
        }
    }, [address]); // ✅ Only depends on address


    const handleSelectAddress = async (event) => {
        const addressId = event.target.value;
        const selected = event.target.checked;

        try {
            await toast.promise(
                editData("/api/address/select-address", {
                    addressId,
                    userId: context?.userData?._id, // Ensure this is correctly defined
                    selected,
                }, { withCredentials: true }),
                {
                    loading: "Updating address selection... Please wait.",
                    success: (res) => {
                        if (res?.success) {
                            // ✅ Ensure only one address is selected
                            const updatedAddresses = address.map(addr =>
                                addr._id === addressId
                                    ? { ...addr, selected: true } // Set selected for the chosen address
                                    : { ...addr, selected: false } // Deselect all others
                            );

                            setAddress(updatedAddresses);
                            setSelectedValue(addressId);

                            // ✅ Update deliverTo correctly
                            const selectedAddress = updatedAddresses.find(addr => addr._id === addressId);
                            if (selectedAddress) {
                                setDeliverTo(selectedAddress.name);
                                console.log("Updated deliverTo:", selectedAddress.name);
                            }

                            return res.message || "Address selection updated successfully!";
                        } else {
                            throw new Error(res?.message || "An unexpected error occurred.");
                        }
                    },
                    error: (err) => {
                        return err?.response?.data?.message || err.message || "Failed to update address selection.";
                    },
                }
            );
        } catch (err) {
            console.error("Error in handleSelectAddress:", err);
            toast.error(err?.message || "An unexpected error occurred.");
        }
    };


    const checkout = (e) => {
        e.preventDefault();

        var options = {
            key: VITE_APP_RAZORPAY_KEY_ID,
            key_secret: VITE_APP_RAZORPAY_KEY_SECRET,
            amount: parseInt(totalAmount * 100),
            currency: "INR",
            order_receipt: deliverTo,
            name: "Ecommerce App",
            description: "for testing purpose",
            handler: function (response) {
                const paymentId = response.razorpay_payment_id;
                const user = context?.userData;

                const payLoad = {
                    userId: user?._id,
                    products: context?.cartData,
                    paymentId: paymentId,
                    payment_status: "COMPLETED",
                    delivery_address: selectedValue,
                    totalAmt: totalAmount,
                    date: new Date().toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    })
                };

                console.log(payLoad);

                postData(`/api/order/create-order`, payLoad).then((res) => {
                    
                    if (res.error === false) {
                        deleteData(`/api/cart/empty-cart-item/${user?._id}`).then((res) => {
                            context?.getCartItems();
                        })
                         
                        context?.openAlertBox("success", res?.message);
                        getOrderDetails();
                        navigate("/order/success");
                    } else {
                        context?.openAlertBox("error", res?.message);
                        navigate("/order/failed");
                    }
                });

            },
            theme: {
                color: "#ff5353",
            }

        };
        console.log(options);
        var pay = new window.Razorpay(options);
        pay.open();
    }

    const cashOnDelivery = () => {
        const user = context?.userData;

        console.log("User Data:", user);
        console.log("Selected Address ID Before Order:", selectedValue);
        console.log("Address List:", address);

        if (!user || !user._id) {
            console.error("User data is missing!");
            context?.openAlertBox("error", "User not logged in!");
            return;
        }

        if (!selectedValue) {
            console.error("No delivery address selected!");
            context?.openAlertBox("error", "Please select a delivery address!");
            return;
        }

        const payLoad = {
            userId: user._id,
            products: context?.cartData,
            paymentId: '',
            payment_status: "CASH ON DELIVERY",
            delivery_address: { _id: selectedValue }, // ✅ Ensure API gets an object
            totalAmt: totalAmount,
            date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }),
        };

        console.log("Final Payload:", payLoad);

        postData(`/api/order/create-order`, payLoad).then((res) => {
            if (res.error === false) {
                
                deleteData(`/api/cart/empty-cart-item/${user._id}`).then(() => {
                    context?.getCartItems();
                });
                
                context?.openAlertBox("success", res?.message);
                getOrderDetails();
                navigate("/order/success");
            } else {
                context?.openAlertBox("error", res?.message);
                navigate("/order/failed");
            }
        }).catch((error) => {
            console.error("Error creating order:", error);
            context?.openAlertBox("error", "Failed to place order!");
        });
    };

    useEffect(() => {

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${VITE_APP_PAYPAL_CLIENT_ID}&disable-funding=card`;
        script.async = true;
        script.onload = () => {
            window.paypal
                .Buttons({
                    createOrder: async () => {
                        const resp = await fetch('https://v6.exchangerate-api.com/v6/c6b1f2127cf87e8f14b8103e/latest/INR');
                        const respData = await resp.json();
                        var convertedAmount = 0;

                        if (respData.result === 'success') {
                            const usdToInrRate = respData.conversion_rates.USD;
                            convertedAmount = (totalAmount * usdToInrRate).toFixed(2);
                        }

                        const headers = {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Include the access token in the header
                            'Content-Type': 'application/json', // Specify the content type as JSON
                        }

                        const data = {
                            userId: context?.userData?._id,
                            totalAmount: convertedAmount,
                        }
                        // console.log(data);

                        const response = await axios.get(
                            VITE_API_URL + `/api/order/create-order-paypal?userId=${data?.userId}&totalAmount=${data?.totalAmount}`, { headers }
                        );

                        return response?.data?.id; // Return the order ID to PayPal
                    },
                    onApprove: async (data) => {
                        onApprovePayment(data);
                    },
                    onError: (err) => {
                        console.error("Paypal checkout onError: ", err);
                    },
                })
                .render('#paypal-button-container');
        }
        document.body.appendChild(script);
    }, [context?.cartData, context?.userData, selectedValue]);


    const onApprovePayment = async (data) => {
        const user = context?.userData;

        const info = {
            userId: user?._id,
            products: context?.cartData,
            payment_status: "COMPLETED",
            delivery_address: selectedValue,
            totalAmount: totalAmount,
            date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            })
        }

        // Capture order on server
        const headers = {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Include the access token in the header
            'Content-Type': 'application/json', // Specify the content type as JSON
        }

        const response = await axios.post(
            `${VITE_API_URL}/api/order/capture-order-paypal`,
            {
                ...info,
                paymentId: data.orderID, // Fixed case (was orderId)
            },
            { headers }
        );
        
        // Check if the request was successful
        if (response.data?.success) {
            // Empty the cart only if the order is successfully captured
            context?.openAlertBox("success", response?.data?.message);
            await deleteData(`/api/cart/empty-cart-item/${user._id}`);
            context?.getCartItems();
            navigate("/order/success");
        }else{
            context?.openAlertBox("error", response?.data?.message);
            navigate("/order/failed");
        }

    }


    // useEffect(() => {
    //     const script = document.createElement("script");
    //     script.src = `https://www.paypal.com/sdk/js?client-id=${VITE_APP_PAYPAL_CLIENT_ID}&disable-funding=card`;
    //     script.async = true;
    //     script.onload = () => {
    //         if (window.paypal) {
    //             window.paypal
    //                 .Buttons({
    //                     createOrder: async () => {
    //                         try {
    //                             const resp = await fetch(
    //                                 "https://v6.exchangerate-api.com/v6/c6b1f2127cf87e8f14b8103e/latest/INR"
    //                             );
    //                             const respData = await resp.json();
    //                             let convertedAmount = 0;

    //                             if (respData.result === "success") {
    //                                 const usdToInrRate = respData.conversion_rates.USD;
    //                                 convertedAmount = (totalAmount * usdToInrRate).toFixed(2);
    //                             }

    //                             const headers = {
    //                                 Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //                                 "Content-Type": "application/json",
    //                             };

    //                             const data = {
    //                                 userId: context?.userData?._id,
    //                                 totalAmount: convertedAmount,
    //                             };

    //                             const response = await axios.get(
    //                                 `${VITE_API_URL}/api/order/create-order-paypal?userId=${data?.userId}&totalAmount=${data?.totalAmount}`,
    //                                 { headers }
    //                             );

    //                             return response?.data?.id;
    //                         } catch (error) {
    //                             console.error("Error creating PayPal order: ", error);
    //                             return null;
    //                         }
    //                     },
    //                     onApprove: async (data) => {
    //                         await onApprovePayment(data);
    //                     },
    //                     onError: (err) => {
    //                         console.error("PayPal checkout onError: ", err);
    //                     },
    //                 })
    //                 .render("#paypal-button-container");
    //         }
    //     };

    //     document.body.appendChild(script);

    //     // Cleanup script when component unmounts
    //     return () => {
    //         document.body.removeChild(script);
    //     };
    // }, [context?.cartData, context?.userData, selectedValue, totalAmount]);

    // const onApprovePayment = async (data) => {
    //     try {
    //         const user = context?.userData;

    //         const info = {
    //             userId: user?._id,
    //             products: context?.cartData,
    //             paymentId: data.orderID,
    //             payment_status: "COMPLETED",
    //             delivery_address: selectedValue,
    //             totalAmt: totalAmount,
    //             date: new Date().toLocaleString("en-US", {
    //                 month: "short",
    //                 day: "2-digit",
    //                 year: "numeric",
    //             }),
    //         };

    //         const headers = {
    //             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //             "Content-Type": "application/json",
    //         };

    //         const response = await axios.post(`${VITE_API_URL}/api/order/capture-order-paypal`, info, { headers });

    //         if (response.data.success) {
    //             // Clear cart
    //             await axios.deleteData(`${VITE_API_URL}/api/cart/emptyCart/${context?.userData?._id}`);
    //             context?.getCartItems();

    //             // Show success message
    //             context?.openAlertBox("success", "Order completed and saved to database!");
    //         }
    //     } catch (error) {
    //         console.error("Error processing PayPal payment: ", error);
    //     }
    // };


    return (
        <>

            <form onSubmit={checkout}>
                <section className="section py-5 pb-10">
                    <div className="container checkoutPage w-[80%] max-w-[80%] flex gap-4">

                        <div className="w-[70%]">
                            <div className="card bg-white p-5 shadow-md rounded-md mb-5 h-full">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="pb-0 font-bold text-[20px]">Select Delivery Address</h2>
                                    {address?.length > 0 &&
                                        <Button className={`h-[40px] buttonPrimaryBlack !text-white flex items-center justify-center gap-1 rounded-md p-3 text-[14px] ${isLoading === true ? "cursor-not-allowed" : ""}`} onClick={() => handleClickOpen()} disabled={isLoading}>
                                            <span className='text-center flex items-center justify-center'>
                                                {
                                                    isLoading ? <CircularProgress color="inherit" /> : <><FiPlus className='text-[16px] font-bold' />Add Address</>
                                                }

                                            </span>
                                        </Button>
                                    }
                                </div>
                                <Divider />

                                <div className="flex items-center gap-5">
                                    <div
                                        className={`w-full grid grid-cols-1 gap-4 text-md ${isLoading ? 'cursor-not-allowed' : ''}`}
                                    >
                                        {Array.isArray(address) && address.length > 0 ? (
                                            address.map((address, index) => {
                                                const name = address?.name;
                                                const mobile = address?.mobile;
                                                const addressType = address?.addressType;
                                                const pincode = address?.pincode;
                                                const fullAddress = [
                                                    address?.address_line1,
                                                    address?.landmark,
                                                    address?.city,
                                                    address?.state,
                                                    address?.country,
                                                ]
                                                    .filter(Boolean) // Removes empty, null, or undefined values                                                
                                                    .join(", ");

                                                return (
                                                    <div
                                                        key={index}
                                                        className="relative border addressBox w-full flex flex-col items-center justify-between rounded-md p-2 hover:border-[var(--bg-primary)]"
                                                        onClick={() => handleSelectAddress(address?._id)} // Clicking the box selects the radio
                                                    >
                                                        <div className="flex items-start w-full">
                                                            {/* Radio Button with Label */}
                                                            <label htmlFor={`address-${index}`} className="cursor-pointer w-full flex items-start mr-[70px] p-2">
                                                                <Radio
                                                                    id={`address-${index}`}
                                                                    name="address"
                                                                    checked={selectedValue === address?._id}
                                                                    value={address?._id}
                                                                    onChange={handleSelectAddress}
                                                                />

                                                                {/* Address Content */}
                                                                <div className="w-full px-5 text-[14px] mt-2">
                                                                    <div className="flex flex-col items-start mb-2 gap-2">
                                                                        <span className="bg-gray-200 px-2 rounded-sm">{addressType}</span>
                                                                        <div className="flex gap-5 font-semibold">
                                                                            <span>{name}</span>
                                                                            <span>{mobile}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-auto">{fullAddress} - <span className="font-semibold">{pincode}</span></div>
                                                                </div>
                                                            </label>

                                                            {/* Edit/Delete Popover */}
                                                            <div
                                                                className="relative inline-block"
                                                                onMouseEnter={() => setIsOpen(index)}
                                                                onMouseLeave={() => setIsOpen(false)}
                                                            >
                                                                <button className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200">
                                                                    <TbDotsVertical size={20} />
                                                                </button>

                                                                {isOpen === index && (
                                                                    <span className="absolute right-0 top-0 w-24 bg-white shadow-md rounded p-2">
                                                                        <div
                                                                            className="cursor-pointer p-1 hover:bg-gray-100"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleEditClick(address?.userId, address?._id);
                                                                            }}
                                                                        >
                                                                            Edit
                                                                        </div>
                                                                        <div
                                                                            className="cursor-pointer p-1 hover:bg-gray-100"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteAddress(e, address?._id);
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </div>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                );
                                            })
                                        ) : (
                                            <div className='w-full h-full flex flex-col items-center'>
                                                <img src="../empty-myaddresses.png" className='w-[200px]' />
                                                <span className='font-bold mt-5'>No Addresses found in your account!</span>
                                                <span className='text-[14px]'>Add a delivery address.</span>
                                                <Button className={`h-[40px] !px-10 !mt-4 buttonPrimaryBlack !text-white flex items-center justify-center gap-1 rounded-md p-3 text-[14px] ${isLoading === true ? "cursor-not-allowed" : ""}`} onClick={() => handleClickOpen()} disabled={isLoading}>
                                                    <span className='text-center flex items-center justify-center'>
                                                        {
                                                            isLoading ? <CircularProgress color="inherit" /> : <><FiPlus className='text-[16px] font-bold' />Add Address</>
                                                        }

                                                    </span>
                                                </Button>
                                            </div>

                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className={`rightPart ${context?.cartData?.length === 0 ? "hidden" : "w-[30%]"}`}>
                            <div className="shadow-md rounded-md bg-white flex flex-col gap-2 sticky top-[150px] z-50">
                                <div className="cartTotals ">
                                    <div className="py-2">
                                        <h2 className="uppercase px-4 py-1 text-[16px] font-bold text-[var(--text-light)] pb-2">Price Details <span className="capitalize">({context?.cartData?.length} Item{context?.cartData?.length <= 1 ? ("") : ("s")})</span></h2>
                                    </div>
                                    <Divider />
                                    <div className="flex items-center justify-between px-4 py-1 mt-1">
                                        <span className="text-[14px]">Total MRP</span>
                                        <span className="price text-black text-[14px] flex items-center">₹{new Intl.NumberFormat('en-IN').format(totalMRP)}</span>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-1">
                                        <span className="text-[14px]">Discount on MRP</span>
                                        <span className="price text-green-600 text-[14px] flex items-center gap-1">- ₹{new Intl.NumberFormat('en-IN').format(discount)}</span>
                                    </div>
                                    {/* <div className="flex items-center justify-between px-4 py-1">
                                                    <span className="text-[14px]">Coupon Discount</span>
                                                    <span className="price text-green-600 text-[14px] flex items-center gap-1">- ₹{new Intl.NumberFormat('en-IN').format(102)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between px-4 py-1">
                                                    <span className="text-[14px]">Platform Fee</span>
                                                    {
                                                        context.platformFee === 0 ? (
                                                            <span className="price text-green-600 text-[14px] flex items-center">Free</span>
                                                            ) : (
                                                                <span className="price text-black text-[14px] flex items-center">₹{new Intl.NumberFormat('en-IN').format(49)}</span>
                                                                )
                                                                }
                                                                </div>
                                                                <div className="flex items-center justify-between px-4">
                                                                <span className="text-[14px]">Shipping Fee</span>
                                                                {
                                                                    context.shippingFee === 0 ? (
                                                                        <span className="price text-green-600 text-[14px] flex items-center gap-1"><span className="line-through !text-[var(--text-dark)]"> ₹{new Intl.NumberFormat('en-IN').format(79)}</span>Free</span>
                                                                        ) : (
                                                                            <span className="price text-black text-[14px] flex items-center">₹{new Intl.NumberFormat('en-IN').format(79)}</span>
                                                                            )
                                                                            }
                                                                            </div>
                                                                            <div className="flex items-center justify-between px-4 py-0 pb-5">
                                                                            {
                                                                                context.shippingFee === 0 ? (
                                                                                    <span className="text-[12px]">Free Shipping for you</span>
                                                                                    ) : (""
                                                                                    )
                                                                                    }
                                                                                    
                                                                                    </div> */}
                                    <Divider />
                                    <div className="flex items-center justify-between px-4 py-4 font-bold text-[18px]">
                                        <span>Total Amount:</span>
                                        <span>₹{new Intl.NumberFormat('en-IN').format(totalAmount)}</span>
                                    </div>
                                    <Divider />
                                    <div className="w-[100%] flex items-center justify-between bg-gray-100 p-4 ">
                                        <Button type='submit' className="buttonPrimaryBlack w-full h-[45px] flex items-center justify-center gap-1"><SiRazorpay />RazorPay</Button>
                                    </div>
                                    <Divider />
                                    <div id='paypal-button-container' className="w-[100%] flex items-center justify-between bg-gray-100 p-4 ">
                                        {/* <Button className="!bg-blue-700 !text-white w-full flex items-center justify-center gap-1" onClick={cashOnDelivery}>
                                            <FaPaypal className='text-[15px]' />
                                            Paypal
                                        </Button> */}
                                    </div>
                                    <Divider />
                                    <div className="w-[100%] flex items-center justify-between bg-gray-100 p-4 ">
                                        <Button className="!bg-gray-700 !text-white w-full h-[45px] flex items-center justify-center gap-1" onClick={cashOnDelivery}>
                                            <IoBagCheck />
                                            Cash On Delivery
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </form>

            <Dialog open={isOpenModel} onClose={handleClose}>
                <DialogTitle>{addressIdForEdit !== undefined ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                <form onSubmit={handleSubmit} ref={formRef}>
                    <div className='flex flex-col w-auto h-[400px] overflow-y-scroll px-5 pb-5'>
                        <h2 className='text-gray-500 sticky top-0 z-50 bg-white pb-2 border-b'>
                            Share your delivery details, and we&apos;ll take care of the rest! &#128522;
                        </h2>

                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="name"
                            label="Name*"
                            type="text"
                            value={formFields?.name || ''}
                            disabled={isLoading}
                            className='custom-textfield'
                            onChange={onChangeInput}
                            inputRef={nameRef}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            margin="dense"
                            id="address_line1"
                            name="address_line1"
                            label="Address Line1 (House No, Building/Street/Area Name)*"
                            type="text"
                            value={formFields?.address_line1 || ''}
                            disabled={isLoading}
                            className='custom-textfield'
                            onChange={onChangeInput}
                            inputRef={addressLine1Ref}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            margin="dense"
                            id="landmark"
                            name="landmark"
                            label="Landmark"
                            type="text"
                            value={formFields?.landmark || ''}
                            disabled={isLoading}
                            className='custom-textfield'
                            onChange={onChangeInput}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            margin="dense"
                            id="city"
                            name="city"
                            label="City/District*"
                            value={formFields?.city || ''}
                            disabled={isLoading}
                            onChange={onChangeInput}
                            className='custom-textfield'
                            type="text"
                            inputRef={cityRef}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            margin="dense"
                            id="state"
                            name="state"
                            label="State*"
                            value={formFields?.state || ''}
                            disabled={isLoading}
                            onChange={onChangeInput}
                            className='custom-textfield'
                            type="text"
                            inputRef={stateRef}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />
                        <TextField
                            margin="dense"
                            id="country"
                            name="country"
                            label="Country*"
                            value={formFields?.country || ''}
                            disabled={isLoading}
                            onChange={onChangeInput}
                            className='custom-textfield'
                            type="text"
                            inputRef={countryRef}
                            fullWidth
                            variant="outlined"
                            size="small"
                        />

                        <TextField
                            margin="dense"
                            id="pincode"
                            name="pincode"
                            label="Pincode*"
                            value={formFields?.pincode || ''}
                            disabled={isLoading}
                            inputProps={{
                                maxLength: 6,
                            }}
                            error={error}
                            helperText={error ? "Please enter a valid 6-digit pincode" : ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,6}$/.test(value)) {
                                    setError(false);
                                } else {
                                    setError(true);
                                }
                                onChangeInput(e);
                            }}
                            type="text"
                            inputRef={pincodeRef}
                            className='custom-textfield'
                            fullWidth
                            variant="outlined"
                            size="small"
                        />

                        <MuiPhone
                            margin="dense"
                            defaultCountry="in"
                            value={phone || ''}  // Set value to the phone state
                            onChange={(phone) => {
                                setPhone(phone); // Update phone state when the value changes
                                setFormFields((prevState) => ({ ...prevState, mobile: phone })); // Also update formFields with the new phone
                            }}
                            disabled={isLoading}
                            type="text"
                            inputRef={mobileRef}
                            className='custom-textfield'
                            fullWidth
                            variant="outlined"
                            size="small"
                        />

                        <fieldset ref={addressTypeRef} className="border rounded-md p-2 hover:border-black">
                            <legend className="text-[12px] font-normal text-gray-700 px-2">Address Type*</legend>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                value={isAddressType}
                                onChange={(e) => handleAddressType(e)}
                                name="radio-buttons-group"
                            >
                                <div className="flex items-center space-x-4 px-4">
                                    <FormControlLabel value="Home" control={<Radio />} label="Home" />
                                    <FormControlLabel value="Office" control={<Radio />} label="Office" />
                                </div>
                            </RadioGroup>
                        </fieldset>


                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={status} // Convert string to boolean
                                    onChange={handleStatusChange}
                                    inputProps={{ "aria-label": "Active Status" }}
                                    sx={{
                                        color: "var(--bg-primary)", // Default color
                                        "&.Mui-checked": {
                                            color: "var(--bg-primary) !important", // Checked color
                                        },

                                    }}
                                />
                            }
                            label="Make it default"
                            className='mt-2 px-2'
                        />

                    </div>

                    <div className='flex items-center justify-end px-5 pb-5 gap-5'>
                        <Button
                            type="reset"
                            onClick={handleClose}
                            className='buttonPrimaryWhite !text-white w-[150px] h-[40px] flex items-center justify-center gap-2 '
                        >
                            <RiResetLeftFill className='text-[20px]' />Discard
                        </Button>

                        {
                            addressIdForEdit === undefined ? (
                                <Button type='submit' className={`${isLoading === true ? "buttonDisabled" : "buttonPrimaryBlack"}  w-[150px] h-[40px] flex items-center justify-center gap-2`} disabled={isLoading}>
                                    {
                                        isLoading ? <CircularProgress color="inherit" /> : <><IoIosSave className='text-[20px]' />Create</>
                                    }
                                </Button>
                            ) : (
                                <Button className={`${isLoading === true ? "buttonDisabled" : "buttonPrimaryBlack"}  w-[150px] h-[40px] flex items-center justify-center gap-2`} disabled={isLoading} onClick={handleUpdate}>
                                    {
                                        isLoading ? <CircularProgress color="inherit" /> : <><FiEdit className='text-[20px]' />Update</>
                                    }
                                </Button>
                            )
                        }
                    </div>
                </form>
            </Dialog>
        </>
    )
}

export default Checkout
