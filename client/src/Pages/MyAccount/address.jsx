import React, { useContext, useEffect, useRef, useState } from 'react'
import AccountSidebar from '../../components/AccountSidebar'
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Divider, Radio } from '@mui/material';
import toast from 'react-hot-toast';
import { editData, fetchDataFromApi, postData } from '../../utils/api';
import 'react-international-phone/style.css';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line, RiResetLeftFill } from 'react-icons/ri';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import 'react-international-phone/style.css';
import { MenuItem, Select, TextField, } from '@mui/material';
import { IoIosSave } from 'react-icons/io';
import { MuiPhone } from '../../components/MuiPhone';



const Address = () => {

    const context = useContext(MyContext);
    const navigate = useNavigate();

    const formRef = useRef(); // Create ref to the form
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    // const [isLoading3, setIsLoading3] = useState(false);
    const [address, setAddress] = useState([]);
    const [selectedValue, setSelectedValue] = useState(false);
    const [userIdForEdit, setUserIdForEdit] = useState("");
    const [addressIdForEdit, setAddressIdForEdit] = useState("");

    const [phone, setPhone] = useState('');
    const [error, setError] = useState(false);
    const [status, setStatus] = useState("");
    const [isOpenModel, setIsOpenModel] = useState(false);

    const addressLine1Ref = useRef(null);
    const cityRef = useRef(null);
    const stateRef = useRef(null);
    const countryRef = useRef(null);
    const pincodeRef = useRef(null);
    const mobileRef = useRef(null);

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

    // Effect for checking if the user is logged in and setting phone once user data is available
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
        const userId = context?.userData?._id;
        if (userId) {
            setFormFields((prevState) => ({
                ...prevState,
                userId: context.userData._id,
            }));
        }
    }, [context?.userData]);

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
    }, [context?.userData, context?.isReducer]);


    // Effect for handling address edits and populating form fields
    useEffect(() => {
        const { userId, addressId } = { userId: userIdForEdit, addressId: addressIdForEdit };

        if (!addressId) {
            setAddressIdForEdit(undefined);
            setUserIdForEdit(context?.userData?._id);
            setFormFields({
                address_line1: "",
                city: "",
                state: "",
                pincode: "",
                country: "",
                mobile: "",
                status: "",
                userId: userId || context?.userData?._id,
            });
            setPhone("");
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

                        setFormFields({
                            address_line1: address.address_line1 || "",
                            city: address.city || "",
                            state: address.state || "",
                            pincode: address.pincode || "",
                            country: address.country || "",
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

    // Effect to manage selected address
    useEffect(() => {
        const safeAddress = address || [];  // Ensure address is an array (in case it's null or undefined)

        // Find the address that is selected
        const selectedAddress = safeAddress.find(addr => addr.selected === true);

        if (selectedAddress) {
            // Set the selected address ID
            setSelectedValue(selectedAddress._id);
        } else {
            // No address is selected, set a default value or handle as needed
            setSelectedValue(null);  // Example: Set selectedValue to null if no address is selected
        }
    }, [address]); // This effect runs whenever the address list changes

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleStatusChange = (event) => {
        const value = event.target.value;
        setStatus(value);
        setFormFields((prevState) => ({
            ...prevState,
            status: value,
        }));
    };

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
            address_line1: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            mobile: '',
        });
        setPhone('');
        setStatus('');
        setError(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form fields
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
                            context.forceUpdate();
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
                        address_line1: address.address_line1 || "",
                        city: address.city || "",
                        state: address.state || "",
                        pincode: address.pincode || "",
                        country: address.country || "",
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
                            context.forceUpdate();
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
                            context.forceUpdate();
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


    const handleSelectAddress = async (event) => {
        const addressId = event.target.value;
        const selected = event.target.checked;

        try {
            const result = await toast.promise(
                editData("/api/address/select-address", {
                    addressId: addressId,
                    userId: context?.userData?._id,
                    selected: selected,
                }, { withCredentials: true }),
                {
                    loading: "Updating address selection... Please wait.",
                    success: (res) => {
                        if (res?.success) {
                            const updatedAddresses = context?.address?.map((address) =>
                                address._id === addressId
                                    ? { ...address, selected: selected }
                                    : address
                            );

                            context?.setAddress(updatedAddresses);
                            setSelectedValue(addressId); // Set selected value to the newly selected address
                            context.forceUpdate();
                            return res.message || "Address selection updated successfully!";
                        } else {
                            throw new Error(res?.message || "An unexpected error occurred.");
                        }
                    },
                    error: (err) => {
                        const errorMessage = err?.response?.data?.message || err.message || "Failed to update address selection.";
                        return errorMessage;
                    },
                }
            );

            console.log("Select Address Result:", result);
        } catch (err) {
            console.error("Error in handleSelectAddress:", err);
            toast.error(err?.message || "An unexpected error occurred.");
        }
    };


    return (
        <>
            <section className="py-10 w-full">
                <div className="container flex gap-5">
                    <AccountSidebar />
                    <div className="col-2 w-[100%]">
                        <div className="card bg-white p-5 shadow-md rounded-md mb-5">
                            <div className="flex items-center mb-2">
                                <h2 className="pb-0 font-bold text-[20px]">Address Details</h2>
                            </div>
                            <Divider />
                            <form action="" className="mt-6" onSubmit={handleSubmit}>
                                <div className="flex items-center gap-5">
                                    <div className={`w-full h-[40px] bg-red-50 flex items-center justify-center border-2 border-dashed ${isLoading === true ? "" : "hover:border-[var(--bg-primary)] cursor-pointer"} rounded-md p-3 text-md ${isLoading === true ? "cursor-not-allowed" : ""}`} onClick={() => handleClickOpen()} disabled={isLoading}>
                                        <span className='text-gray-700 text-center flex items-center justify-center'>
                                            {
                                                isLoading ? <CircularProgress color="inherit" /> : "Add Address"
                                            }

                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5">
                                    <div
                                        className={`w-full h-full flex flex-col items-center justify-center gap-4 mt-4 text-md ${isLoading ? 'cursor-not-allowed' : ''}`}
                                    >
                                        {Array.isArray(address) && address.length > 0 ? (
                                            address.map((address, index) => {
                                                const fullAddress =
                                                    address?.address_line1 +
                                                    ', ' +
                                                    address?.city +
                                                    ', ' +
                                                    address?.state +
                                                    ', ' +
                                                    address?.pincode +
                                                    ', ' +
                                                    address?.country +
                                                    ', ' +
                                                    address?.mobile;

                                                return (
                                                    <label
                                                        key={index}
                                                        className="border-2 border-dashed addressBox w-full flex items-center justify-between rounded-md cursor-pointer p-2"
                                                    >
                                                        <div className="flex items-center">
                                                            <Radio
                                                                name="address"
                                                                checked={selectedValue === address?._id}
                                                                value={address?._id}
                                                                onChange={handleSelectAddress}
                                                            />
                                                            <span className="ml-2">{fullAddress}</span>
                                                        </div>
                                                        <div className='flex items-start gap-2'>
                                                            <Button className='!w-[35px] shadow !h-[35px] !min-w-[35px] !rounded-full !text-[50px]' onClick={() => handleEditClick(address?.userId, address?._id)}>
                                                                <FiEdit />
                                                            </Button>
                                                            <Button className='!w-[35px] shadow !text-red-500 !h-[35px] !min-w-[35px] !rounded-full !text-[50px]' onClick={(e) => handleDeleteAddress(e, address?._id)}>
                                                                <RiDeleteBin6Line />
                                                            </Button>
                                                        </div>
                                                    </label>
                                                );
                                            })
                                        ) : (
                                            <p>No addresses found.</p>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </section>


            <Dialog open={isOpenModel} onClose={handleClose}>
                <DialogTitle>{addressIdForEdit !== undefined ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                <form onSubmit={handleSubmit} ref={formRef}>
                    <div className='flex flex-col w-auto px-5 pb-5'>

                        <h2 className='text-gray-500'>
                            Share your delivery details, and we&apos;ll take care of the rest! &#128522;
                        </h2>

                        <TextField
                            autoFocus
                            margin="dense"
                            id="address_line1"
                            name="address_line1"
                            label="Address Line1 (House No, Building/Street/Area Name)"
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
                            id="city"
                            name="city"
                            label="Add City/District"
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
                            label="Add State"
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
                            label="Add Country"
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
                            label="Add Pincode"
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


                        <Select
                            value={status} // Ensure the status is converted to string
                            onChange={handleStatusChange}
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            className="h-[40px] mt-2"
                            fullWidth
                            size="small"
                            margin="dense"
                            variant="outlined"
                            sx={{
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'var(--bg-primary) !important', // Set the focus border color
                                },
                            }}
                        >
                            <MenuItem value="" disabled>Select Status</MenuItem>
                            <MenuItem value="true">Active</MenuItem>
                            <MenuItem value="false">Inactive</MenuItem>
                        </Select>


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

export default Address
