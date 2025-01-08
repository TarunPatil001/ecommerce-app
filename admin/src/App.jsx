import './App.css'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Dashboard from './Pages/Dashboard/index';
import { createContext, useState } from 'react';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';


const MyContext = createContext();

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

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
  ]);

  const values = {
    isSidebarOpen,
    setIsSidebarOpen,
    isLogin,
    setIsLogin,
  };

  return (
    <>
      <MyContext.Provider value={values}>
        <RouterProvider router={router} />
      </MyContext.Provider>
    </>
  )
}

export default App
export { MyContext };