import React, { useState, createContext, useContext } from 'react';
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
import Login from './Pages/Login';
import Register from './Pages/Register';

const MyContext = createContext();

function App() {
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState(false);
  const [maxWidth, setMaxWidth] = useState('lg');
  const [fullWidth, setFullWidth] = useState(true);

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal(false);
  };

  const values = {
    setOpenProductDetailsModal
  };

  return (
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
        </Routes>
        <Footer />
      </MyContext.Provider>

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
    </BrowserRouter>
  );
}

export default App;

export {MyContext};
