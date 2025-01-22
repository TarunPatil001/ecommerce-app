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



const MyContext = createContext();

function App() {
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [maxWidth, setMaxWidth] = useState('lg');
  const [fullWidth, setFullWidth] = useState(true);
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [cartItemsQty, setCartItemsQty] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState(null);
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

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal(false);
  };

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  useEffect(()=>{
    const token = localStorage.getItem('accessToken');
    if(token!==undefined && token!==null && token!==''){
      setIsLogin(true);

      fetchDataFromApi(`/api/user/user-details`).then((res)=>{
        setUserData(res.data);
        // console.log(res?.response?.data?.error);
        if(res?.response?.data?.error === true){
          if (res?.response?.data?.message === "You have not login") {
            localStorage.clear();
            openAlertBox("error", "Your session has expired. Please login again.");
            setIsLogin(false);
          }
        }
      })

      }else{
        setIsLogin(false);
      }
  }, [isLogin]);
  

   // Sync login state with localStorage and other tabs using the storage event
  //  useEffect(() => {
  //   // Function to set the login state based on access token
  //   const updateLoginState = () => {
  //     const token = localStorage.getItem('accessToken');
      
  //     if (token !== undefined && token !== null && token !== '') {
  //       setIsLogin(true);
  //       fetchDataFromApi(`/api/user/user-details`).then((res) => {
  //         setUserData(res.data);
  //       });
  //     } else {
  //       setIsLogin(false);
  //       setUserData(null);  // Optionally clear user data
  //     }
  //   };

  //   // Call on initial render to sync the state
  //   updateLoginState();

  //   // Listen for changes in localStorage (across all tabs)
  //   const handleStorageChange = (e) => {
  //     if (e.key === 'accessToken') {
  //       updateLoginState();  // Update login state when accessToken changes
  //     }
  //   };

  //   // Add listener for localStorage changes (across all tabs)
  //   window.addEventListener('storage', handleStorageChange);

  //   // Cleanup event listener on component unmount
  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, [isLogin]); // Empty array to run only once when the component mounts
  

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

    // Utility functions
    openAlertBox,

    
    isReducer,
    forceUpdate,

  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          <Navigation />
          <Routes>
            <Route path={"/"} exact={true} element={<Home />} />
            <Route path={"/productListing"} exact={true} element={<ProductListing />} />
            <Route path={"/productDetails/:id"} exact={true} element={<ProductDetails />} />
            <Route path={"/login"} exact={true} element={<Login />} />
            <Route path={"/register"} exact={true} element={<Register />} />
            <Route path={"/cart"} exact={true} element={<CartPage />} />
            <Route path={"/verify"} exact={true} element={<Verify />} />
            <Route path={"/forgot-password"} exact={true} element={<ForgotPassword />} />
            <Route path={"/checkout"} exact={true} element={<Checkout />} />
            <Route path={"/my-account"} exact={true} element={<MyAccount />} />
            <Route path={"/my-wishlist"} exact={true} element={<Wishlist />} />
            <Route path={"/my-orders"} exact={true} element={<Orders />} />
          </Routes>
          <Footer />
        </MyContext.Provider>
      </BrowserRouter>

      <Toaster />

      <Dialog
        open={openProductDetailsModal}
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

            {/* Left Column with Sticky */}
            <div className="col1 w-[50%] sticky top-5">
              <ProductZoom />
            </div>

            {/* Right Column */}
            <div className="col2 w-[50%] overflow-y-auto p-2 productContent">
              <ProductDetailsContent />
            </div>
          </div>

        </DialogContent>
      </Dialog>

    </>

  );
}

export default App;

export { MyContext };
