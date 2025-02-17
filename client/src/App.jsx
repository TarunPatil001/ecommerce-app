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
import { fetchDataFromApi, postData } from './utils/api';
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
  const [isLogin, setIsLogin] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState(null);
  const [catData, setCatData] = useState([]);
  const [address, setAddress] = useState([]);
  const [addressIdNo, setAddressIdNo] = useState(null);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [cartData, setCartData] = useState([]);
  // const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState({});
  const [cartItem, setCartItem] = useState(null);
  const [isReducer, forceUpdate] = useReducer(x => x + 1, 0);


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

      getCartItems();

    } else {
      setIsLogin(false);
    }
  }, [isLogin]);


  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res?.error === false) {
        setCatData(res?.data);
      }
      // console.log(res);
    });
  }, [isReducer]);


  useEffect(() => {
    fetchDataFromApi(`/api/user/getReviews?productId=${openProductDetailsModal?.product?._id}`).then((res) => {
      if (res?.error === false && res?.data) {
        setReviewsCount(res.data.length);
      } else {
        setReviewsCount(0); // Ensuring reviewsCount is always a number
      }
    });
  }, [openProductDetailsModal?.product?._id])


  const openAlertBox = (status, msg) => {
    if (status === "success") {
      toast.success(msg);
    } else if (status === "error") {
      toast.error(msg);
    } else if (status === "loading") {
      toast.loading(msg, { id: "loadingToast" });
    }
  };


  const getCartItems = () => {
    fetchDataFromApi('/api/cart/get-product-from-cart').then((res) => {
      if (res.error === false && res.data) {
        setCartData(res?.data);
      }
    })
  };

  const addToCart = async (product, userId, quantity, selectedSize, selectedWeight, selectedRam) => {
    if (!userId) {
      openAlertBox("error", "Please login to continue.");
      return false;
    }
  
    if (!product || !product._id || !product.name || !product.price) {
      openAlertBox("error", "Invalid product details.");
      return false;
    }
  
    // Send empty string if not selected
    const selectedOptions = {
      size: selectedSize || "",  // Send empty string if not selected
      productWeight: selectedWeight || "",  // Send empty string if not selected
      productRam: selectedRam || "",  // Send empty string if not selected
    };
  
    // // Check if at least one option is selected (size, weight, or RAM)
    // if (!selectedOptions.size && !selectedOptions.productWeight && !selectedOptions.productRam) {
    //   openAlertBox("error", "Please select at least one option (size, weight, or RAM).");
    //   return false;
    // }
  
    // Create the data object to send to the backend
    const data = {
      productTitle: product.name,
      image: product.images?.[0] || "",
      sellerDetails: {
        sellerId: product.seller?.sellerId || "",
        sellerName: product.seller?.sellerName || "",
      },
      rating: product.rating || 0,
      brand: product.brand || "Unknown",
      availableOptions: {
        size: Array.isArray(product.size) ? product.size : [],
        productWeight: Array.isArray(product.productWeight) ? product.productWeight : [],
        productRam: Array.isArray(product.productRam) ? product.productRam : [],
      },
      selectedOptions,  // Send the selectedOptions with empty strings if not selected
      price: Number(product.price) || 0,
      oldPrice: Number(product.oldPrice) || 0,
      quantity: Number(quantity) || 1,
      discount: Number(product.discount) || 0,
      subTotal: (Number(product.price) || 0) * (Number(quantity) || 1),
      subTotalOldPrice: (Number(product.oldPrice) || 0) * (Number(quantity) || 1),
      productId: product._id,
      countInStock: Number(product.countInStock) || 0,
      userId: userId,
    };
  
    try {
      await toast.promise(
        postData("/api/cart/add-product-to-cart", data),
        {
          loading: "Adding to cart... Please wait.",
          success: (res) => {
            if (res.error === false) {
              console.log(res?.data);
              getCartItems();
              return res?.message || "Item added to cart!";
            } else {
              throw new Error(res?.message || "Failed to add item.");
            }
          },
          error: (err) => {
            console.error("Error Response:", err);
            const errorMessage = err?.response?.data?.message || err?.message || "Something went wrong!";
            openAlertBox("error", errorMessage);
            return errorMessage;
          },
        }
      );
    } catch (error) {
      console.error(error);
      openAlertBox("error", "Unexpected error occurred. Please try again.");
    }
  };
  
  
  




  // Consolidated values for context/provider
  const values = {
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

    addToCart,

    cartData,
    setCartData,

    cartItem,
    setCartItem,

    getCartItems,

    selectedSize,
    setSelectedSize,

  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <Header />
          {/* <Navigation /> */}
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
