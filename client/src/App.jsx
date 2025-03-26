import  { useState, createContext, useEffect, useReducer } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./Pages/Home";
import ProductListing from "./Pages/ProductListing";
import Footer from "./components/Footer";
import ProductDetails from "./Pages/ProductDetails";
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
import OrderSuccess from './Pages/Orders/success';
import OrderFailed from './Pages/Orders/failed';
import SearchPage from './Pages/Search';



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
  // const apiUrl = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState(null);
  const [catData, setCatData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [address, setAddress] = useState([]);
  const [addressIdNo, setAddressIdNo] = useState(null);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [cartData, setCartData] = useState([]);
  // const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState({});
  const [cartItem, setCartItem] = useState(null);
  const [wishlistData, setWishlistData] = useState([]);
  // const [isWishlist, setIsWishlist] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearch, setIsSearch] = useState('');
  const [filteredProductData, setFilteredProductData] = useState([]);
  const [isReducer, forceUpdate] = useReducer(x => x + 1, 0);


  const handleOpenProductDetailsModal = (status, product) => {
    setOpenProductDetailsModal({
      open: status,
      product: product,
    });
  };

  const handleCloseProductDetailsModal = () => {
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
      getWishlistData();
      
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
  
  useEffect(()=>{
    getProductData();
  },[]);

  const getProductData = () => {
    fetchDataFromApi('/api/product/get-all-products').then((res) => {
      if (res.error === false && res.data) {
        setProductData(res?.data);
      }
    })
  };


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
    // Validate user
    if (!userId) {
      openAlertBox("error", "Please login to continue.");
      return false;
    }

    // Validate product
    if (!product || !product._id || !product.name || !product.price) {
      openAlertBox("error", "Invalid product details.");
      return false;
    }

    // Create selectedOptions object, excluding empty fields
    const selectedOptions = {};
    if (selectedSize?.trim()) selectedOptions.size = selectedSize;
    if (selectedWeight?.trim()) selectedOptions.productWeight = selectedWeight;
    if (selectedRam?.trim()) selectedOptions.productRam = selectedRam;

    // Create availableOptions object, excluding empty arrays
    const availableOptions = {};
    if (Array.isArray(product.size) && product.size.length > 0) availableOptions.size = product.size;
    if (Array.isArray(product.productWeight) && product.productWeight.length > 0) availableOptions.productWeight = product.productWeight;
    if (Array.isArray(product.productRam) && product.productRam.length > 0) availableOptions.productRam = product.productRam;

    // Create the data object to send to the backend
    const data = {
      productTitle: product.name,
      image: product.images?.[0] || "", // Use the first image or an empty string
      sellerDetails: {
        sellerId: product.seller?.sellerId || "",
        sellerName: product.seller?.sellerName || "",
      },
      rating: product.rating || 0,
      brand: product.brand || "Unknown",
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

    // Add availableOptions and selectedOptions only if they are not empty
    if (Object.keys(availableOptions).length > 0) data.availableOptions = availableOptions;
    if (Object.keys(selectedOptions).length > 0) data.selectedOptions = selectedOptions;

    try {
      await toast.promise(
        postData("/api/cart/add-product-to-cart", data),
        {
          loading: "Adding to cart... Please wait.",
          success: (res) => {
            if (res.error === false) {
              console.log(res?.data);
              getCartItems(); // Refresh cart items
              return res?.message || "Item added to cart!";
            } else {
              throw new Error(res?.message || "Failed to add item.");
            }
          },
          error: (err) => {
            console.error("Error Response:", err);
            const errorMessage = err?.response?.data?.message || err?.message || "Something went wrong!";
            return errorMessage;
          },
        }
      );
    } catch (error) {
      console.error(error);
      openAlertBox("error", "Unexpected error occurred. Please try again.");
    }
  };

  const getWishlistData = () => {
    fetchDataFromApi('/api/wishlist/get-wishlist').then((res) => {
      console.log(res.data);
      setWishlistData(res.data);
    })
  }



  // Consolidated values for context/provider
  const values = {
    // Modal-related state and handlers
    openProductDetailsModal,
    setOpenProductDetailsModal,
    handleOpenProductDetailsModal,
    handleCloseProductDetailsModal,

    fullWidth,
    setFullWidth,
    maxWidth,
    setMaxWidth,

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

    productData,
    setProductData,

    getProductData,

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

    getWishlistData,
    wishlistData,
    setWishlistData,
    // isWishlist,
    // setIsWishlist,

    searchData,
    setSearchData,
    filteredProductData, 
    setFilteredProductData,

    searchQuery, 
    setSearchQuery,
    isSearch, 
    setIsSearch,


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
            <Route path={"/my-addresses"} exact={true} element={<Address />} />
            <Route path={"/my-orders"} exact={true} element={<Orders />} />
            <Route path={"/order/success"} exact={true} element={<OrderSuccess />} />
            <Route path={"/order/failed"} exact={true} element={<OrderFailed />} />
            <Route path={"/search"} exact={true} element={<SearchPage />} />
          </Routes>
          <Footer />
        </MyContext.Provider>

        <Toaster />

      </BrowserRouter>
    </>

  );
}


export default App;

export { MyContext };
