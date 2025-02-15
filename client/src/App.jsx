import React, { useState, createContext, useEffect, useReducer } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./Pages/Home";
import ProductListing from "./Pages/ProductListing";
import Footer from "./components/Footer";
import ProductDetails from "./Pages/ProductDetails";
import Navigation from "./components/Header/Navigation";
import { Button, Dialog, DialogContent } from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import ProductZoom from './components/ProductZoom';
import ProductDetailsContent from './components/ProductDetailsContent';
import toast, { Toaster } from 'react-hot-toast';
import Login from './Pages/Login';
import Register from './Pages/Register';
import CartPage from './Pages/Cart';
import Verify from './Pages/Verify';
import ForgotPassword from './Pages/ForgotPassword';
import Checkout from './Pages/Checkout';
import MyAccount from './Pages/MyAccount';
import Wishlist from './Pages/Wishlist';
import Orders from './Pages/Orders';
import { fetchDataFromApi } from './utils/api';
import Address from './Pages/MyAccount/address';



const MyContext = createContext();

function App() {
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState({
    open: false,
    product: {}
  });
  const [maxWidth, setMaxWidth] = useState('lg');
  const [fullWidth, setFullWidth] = useState(true);
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [cartItemsQty, setCartItemsQty] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState(null);
  const [catData, setCatData] = useState([]);
  const [address, setAddress] = useState([]);
  const [addressIdNo, setAddressIdNo] = useState(null);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [isReducer, forceUpdate] = useReducer(x => x + 1, 0);


  // callback from cartPanel
  const handleCartItemQtyChange = (newQty) => {
    setCartItemsQty(newQty); // Updates the cart quantity
  };
  // callback from cartPanel
  const handlePlatformFeeChange = (PlatformFeeRate) => {
    setPlatformFee(PlatformFeeRate); // Updates the cart quantity
  };
  // callback from cartPanel
  const handleShippingFeeChange = (PlatformFeeRate) => {
    setShippingFee(PlatformFeeRate); // Updates the cart quantity
  };

  const handleOpenProductDetailsModal = (status, product) => {
    setOpenProductDetailsModal({
      open: status,
      product: product,
    });
  };

  const handleCloseProductDetailsModal = (status, product) => {
    setOpenProductDetailsModal({
      open: false,
      product: {},
    });
  };

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token !== undefined && token !== null && token !== '') {
      setIsLogin(true);

      fetchDataFromApi(`/api/user/user-details`).then((res) => {
        setUserData(res.data);
        // console.log(res?.response?.data?.error);
        if (res?.response?.data?.error === true) {
          if (res?.response?.data?.message === "You have not login") {
            localStorage.clear();
            openAlertBox("error", "Your session has expired. Please login again.");
            setIsLogin(false);
          }
        }
      })

    } else {
      setIsLogin(false);
    }
  }, [isLogin]);


  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res?.error === false) {
        setCatData(res?.data);
      }
      console.log(res);
    });
  }, [isReducer]);


  useEffect(()=>{
    fetchDataFromApi(`/api/user/getReviews?productId=${openProductDetailsModal?.product?._id}`).then((res) => {
      if (res?.error === false && res?.data) {
          setReviewsCount(res.data.length);
      } else {
          setReviewsCount(0); // Ensuring reviewsCount is always a number
      }
  });
  },[openProductDetailsModal?.product?._id])

  


  const openAlertBox = (status, msg) => {
    if (status === "success") {
      toast.success(msg);
    } else if (status === "error") {
      toast.error(msg);
    } else if (status === "loading") {
      toast.loading(msg, { id: "loadingToast" });
    }
  };


  // Consolidated values for context/provider
  const values = {
    // Cart-related states and handlers
    cartItemsQty,
    platformFee,
    shippingFee,
    handleCartItemQtyChange,
    handlePlatformFeeChange,
    handleShippingFeeChange,
    setCartItemsQty,
    setPlatformFee,
    setShippingFee,

    // Modal-related state and handlers
    setOpenProductDetailsModal,
    handleOpenProductDetailsModal,

    // Cart panel visibility
    openCartPanel,
    toggleCartPanel,
    setOpenCartPanel,

    // User authentication
    isLogin,
    setIsLogin,

    // User details
    userData,
    setUserData,

    catData,
    setCatData,

    // Utility functions
    openAlertBox,


    isReducer,
    forceUpdate,

    address,
    setAddress,

    addressIdNo,
    setAddressIdNo,

    reviewsCount,
    setReviewsCount,

  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <Navigation />
          <Routes>
            <Route path={"/"} exact={true} element={<Home />} />
            <Route path={"/products"} exact={true} element={<ProductListing />} />
            <Route path={"/product/:id"} exact={true} element={<ProductDetails />} />
            <Route path={"/login"} exact={true} element={<Login />} />
            <Route path={"/register"} exact={true} element={<Register />} />
            <Route path={"/cart"} exact={true} element={<CartPage />} />
            <Route path={"/verify"} exact={true} element={<Verify />} />
            <Route path={"/forgot-password"} exact={true} element={<ForgotPassword />} />
            <Route path={"/checkout"} exact={true} element={<Checkout />} />
            <Route path={"/my-account"} exact={true} element={<MyAccount />} />
            <Route path={"/my-wishlist"} exact={true} element={<Wishlist />} />
            <Route path={"/my-orders"} exact={true} element={<Orders />} />
            <Route path={"/my-addresses"} exact={true} element={<Address />} />
          </Routes>
          <Footer />
        </MyContext.Provider>

        <Toaster />

        <Dialog
          open={openProductDetailsModal.open}
          onClose={handleCloseProductDetailsModal}
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="productDetailsModal"
        >
          <DialogContent>
            <div className="flex items-start w-full productDetailsModalContainer relative gap-10 p-5">
              {/* Close Button */}
              <Button
                className="!w-[40px] !h-[40px] !min-w-[40px] !bg-gray-100 !border-red-500 !text-red-500 !rounded-full !absolute top-[10px] right-[10px] z-10"
                onClick={handleCloseProductDetailsModal}
              >
                <IoCloseOutline className="text-[30px]" />
              </Button>


              {
                openProductDetailsModal?.product?.length !== 0 &&
                <>
                  {/* Left Column with Sticky */}
                  <div className="col1 w-[50%] sticky top-5">
                    <ProductZoom images={openProductDetailsModal?.product?.images} />
                  </div>

                  {/* Right Column */}
                  <div className="col2 w-[50%] overflow-y-auto p-2 productContent">
                    <ProductDetailsContent product={openProductDetailsModal?.product} reviewsCount={reviewsCount} />
                  </div>
                </>
              }

            </div>

          </DialogContent>
        </Dialog>

      </BrowserRouter>
    </>

  );
}

export default App;

export { MyContext };
