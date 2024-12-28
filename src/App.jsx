import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./Pages/Home";
import ProductListing from "./Pages/ProductListing";
import Footer from "./components/Footer";
import ProductDetails from "./Pages/ProductDetails";
import Navigation from "./components/Header/Navigation";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Navigation />
        <Routes>
          <Route path={"/"} exact={true} element={<Home />} />
          <Route path={"/productListing"} exact={true} element={<ProductListing />} />
          <Route path={"/productDetails/:id"} exact={true} element={<ProductDetails />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
