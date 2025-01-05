import './App.css'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Dashboard from './Pages/Dashboard/index';
import { createContext, useState } from 'react';


const MyContext = createContext();

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
              <div className={`contentRight p-5 w-[82%] ${isSidebarOpen === false ? 'w-[100%]' : 'w-[82%]'} transition-all duration-300`} >
                <Dashboard />
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