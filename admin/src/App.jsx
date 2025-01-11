import React, { createContext, forwardRef, useState } from 'react';
import './App.css'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Dashboard from './Pages/Dashboard/index';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Products from './Pages/Products';
import AddProduct from './Pages/Products/addProduct';

import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IoCloseOutline } from "react-icons/io5";
import Slide from '@mui/material/Slide';
import { Button } from '@mui/material';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MyContext = createContext();

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
    open: false,
    model: '',
  });

  const router = createBrowserRouter([
    {
      path: "/",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%] z-50' : 'w-[0%] opacity-0'} transition-all duration-300`}>
                <Sidebar />
              </div>
              <div className={`contentRight p-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all duration-300`} >
                <Dashboard />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/sign-up",
      exact: true,
      element: (
        <>
          <SignUp />
        </>
      ),
    },
    {
      path: "/sign-in",
      exact: true,
      element: (
        <>
          <Login />
        </>
      ),
    },
    {
      path: "/products",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%] z-50' : 'w-[0%] opacity-0'} transition-all duration-300`}>
                <Sidebar />
              </div>
              <div className={`contentRight p-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all duration-300`} >
                <Products />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/upload",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%] z-50' : 'w-[0%] opacity-0'} transition-all duration-300`}>
                <Sidebar />
              </div>
              <div className={`contentRight ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all duration-300`} >

                <AddProduct />
              </div>
            </div>
          </section>
        </>
      ),
    },
  ]);

  const values = {
    isSidebarOpen,
    setIsSidebarOpen,
    isLogin,
    setIsLogin,
    isOpenFullScreenPanel,
    setIsOpenFullScreenPanel,
  };

  return (
    <>
      <MyContext.Provider value={values}>
        <RouterProvider router={router} />

        <Dialog
          fullScreen
          open={isOpenFullScreenPanel.open}
          onClose={() => setIsOpenFullScreenPanel({ open: false })}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'fixed', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar className='flex items-start justify-start gap-2'>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setIsOpenFullScreenPanel({ open: false })}
                aria-label="close"
              >
                <IoCloseOutline />
              </IconButton>
              <Typography variant="h6" component="div">
                <span className='text-gray-800'>{isOpenFullScreenPanel?.model}</span>
              </Typography>
            </Toolbar>
          </AppBar>
          <div className='mt-5 p-4'>
            
            {
              isOpenFullScreenPanel?.model === "Add Product" && <AddProduct />
            }
          </div>

        </Dialog>

      </MyContext.Provider>
    </>
  )
}

export default App
export { MyContext };