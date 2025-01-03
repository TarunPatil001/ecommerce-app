import './App.css'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Dashboard from './Pages/Dashboard/index';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className='contentMain flex'>
              <div className='sidebarWrapper w-[18%]'>
                <Sidebar />
              </div>
              <div className='contentRight p-5'>
                <Dashboard />
              </div>
            </div>
          </section>
        </>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
