import './App.css'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import Dashboard from './Pages/Dashboard';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      exact: true,
      element: (
        <>
          <Dashboard />
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
