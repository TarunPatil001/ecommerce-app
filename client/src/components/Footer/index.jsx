// import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  Divider,
  Drawer,
  FormControlLabel,
  TextField,
  Tooltip,
} from "@mui/material";
import { useContext, useState } from "react";
import { BsTwitterX } from "react-icons/bs";
import { CiDeliveryTruck, CiGift } from "react-icons/ci";
import { FaYoutube } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
import { IoCloseOutline, IoWalletOutline } from "react-icons/io5";
import { RiFacebookFill, RiForward30Fill } from "react-icons/ri";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { Link } from "react-router-dom";
import CartPanel from "../CartPanel";
import { MyContext } from "../../App";
import ProductZoom from "../ProductZoom";
import ProductDetailsContent from "../ProductDetailsContent";

const Footer = () => {

  const context = useContext(MyContext);

  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setEmail(value);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setError(!emailRegex.test(value));
  };

  // Handle subscribe click
  const handleSubscribe = () => {
    // Check if email is empty or invalid
    if (!email || error) {
      setError(true); // Set error if email is empty or invalid
      return; // Stop submission if invalid
    }

    if (isChecked) {
      console.log("Subscribed!");
      setEmail("");
      setIsChecked(false);
    }
  };

  return (
    <>
      {/* <footer className="p-6 bg-[#fafafa]">
        <div className="container">
          <div className="flex items-center justify-center gap-20 pb-16 py-8">
            <div className="col flex flex-col items-center group">
              <CiDeliveryTruck className="logo text-[60px] transition-all transform duration-500 ease-in-out group-hover:-translate-y-2 group-hover:text-[var(--bg-primary)]" />
              <h3 className="font-semibold text-[17px]">Free Shipping</h3>
              <p>On all orders over ₹500</p>
            </div>

            <div className="col flex flex-col items-center group">
              <RiForward30Fill className="logo text-[60px] transition-all transform duration-500 ease-in-out group-hover:-translate-y-2 group-hover:text-[var(--bg-primary)]" />
              <h3 className="font-semibold text-[17px] ">30 Days Returns</h3>
              <p>For an Exchange Product</p>
            </div>
            <div className="col flex flex-col items-center group">
              <IoWalletOutline className="logo text-[60px] transition-all transform duration-500 ease-in-out group-hover:-translate-y-2 group-hover:text-[var(--bg-primary)]" />
              <h3 className="font-semibold text-[17px]">Secured Payment</h3>
              <p>Payment Cards Accepted</p>
            </div>
            <div className="col flex flex-col items-center group">
              <CiGift className="logo text-[60px] transition-all transform duration-500 ease-in-out group-hover:-translate-y-2 group-hover:text-[var(--bg-primary)]" />
              <h3 className="font-semibold text-[17px] ">Special Gifts</h3>
              <p>Our First Product Order</p>
            </div>
            <div className="col flex flex-col items-center group">
              <TfiHeadphoneAlt className="logo text-[60px] transition-all transform duration-500 ease-in-out group-hover:-translate-y-2 group-hover:text-[var(--bg-primary)]" />
              <h3 className="font-semibold text-[17px] ">Support 24/7</h3>
              <p>Contact us Anytime</p>
            </div>
          </div>
          <hr />

          <div className="footer flex py-8">
            <div className="part1 w-[25%] border-r border-[rgba(0,0,0,0.1)]">
              <h2 className="text-[20px] font-semibold pb-4">Contact Us</h2>
              <address className="text-[14px] font-normal not-italic pb-4 leading-loose">
                Classyshop - Mega Super Store <br /> 507-Union Trade Centre{" "}
                <br /> France
              </address>
              <Link
                to="mailto:sales@yourcompany.com"
                className="link text-[14px]"
              >
                sales@yourcompany.com
              </Link>
              <Link
                to="tel:(+91) 9876-543-210"
                className="text-[24px] font-semibold block w-full mt-3 text-[var(--bg-primary)] mb-5"
              >
                (+91) 9876-543-210
              </Link>
              <div className="flex items-center gap-2">
                <IoMdChatboxes className="text-[40px] hover:text-[var(--bg-primary)]" />
                <span className="font-semibold text-[16px] pl-3">
                  Online Chat <br /> Get Expert Help
                </span>
              </div>
            </div>

            <div className="part2 w-[40%] flex pl-16">
              <div className="part2_col1 w-[50%]">
                <h2 className="text-[20px] font-semibold pb-4">Products</h2>

                <ul className="list leading-8">
                  <li className="list-none text-[14px] w-full">
                    <Link to="/" className="link">
                      Price Drop
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full">
                    <Link to="/" className="link">
                      New Products
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full">
                    <Link to="/" className="link">
                      Best Sales
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full">
                    <Link to="/" className="link">
                      Contact Us
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full">
                    <Link to="/" className="link">
                      Sitemap
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full">
                    <Link to="/" className="link">
                      Stores
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="part2_col2 w-[50%]">
                <h2 className="text-[20px] font-semibold pb-4">Our Company</h2>

                <ul className="list leading-8">
                  <li className="list-none text-[14px] w-full">
                    <Link to="/" className="link">
                      Delivery
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full">
                    <Link to="/" className="link">
                      Legal Notice
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full">
                    <Link to="/" className="link">
                      Terms and conditions of use
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full">
                    <Link to="/" className="link">
                      About us
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full">
                    <Link to="/" className="link">
                      Secure payment
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full">
                    <Link to="/" className="link">
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="part3 w-[35%] px-16 flex flex-col">
              <h2 className="text-[20px] font-semibold pb-4">
                Subscribe to newsletter
              </h2>
              <p className="mb-2 text-[14px] font-normal">
                Subscribe to our latest newsletter to get news about special
                discounts.
              </p>

              <form action="/">
                <Box sx={{ width: 500, maxWidth: "100%" }} className="my-3">
                  <TextField
                    type="email"
                    fullWidth
                    label="Email"
                    id="email-input"
                    value={email}
                    onChange={handleChange}
                    error={error}
                    helperText={
                      error ? "Please enter a valid email address" : ""
                    }
                    variant="outlined"
                    className="custom-textfield"
                  />
                </Box>
                <Tooltip
                  title={!isChecked ? "Agree to the Terms & Conditions" : ""}
                  placement="right"
                  arrow
                >
                  <Button
                    variant="contained"
                    className={`uppercase buttonPrimaryBlack ${isChecked
                      ? "buttonPrimaryBlack"
                      : "hover:!bg-gray-400 !cursor-not-allowed"
                      } `}
                    onClick={handleSubscribe}
                  >
                    Subscribe
                  </Button>
                </Tooltip>

                <FormControlLabel
                  value="end"
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                  }
                  className="mt-3 flex flex-row items-start"
                  label={
                    <span className="text-[10px] ">
                      I agree to the terms and conditions and the privacy
                      policy. <span className="text-red-500 text-sm">*</span>
                    </span>
                  }
                  labelPlacement="end"
                />
              </form>
            </div>
          </div>
        </div>
      </footer>

      <div className="bottomStrip border-t border-[rgba(0,0,0,0.2)] py-3">
        <div className="container flex items-center justify-between">
          <ul className="flex items-center gap-2">
            <li className="list-none ">
              <Link to="/" target="_blank" className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.2)] flex items-center justify-center group hover:bg-[var(--bg-primary)] transition-all duration-500">
                <RiFacebookFill className="group-hover:text-white text-[50px] p-1.5" />
              </Link>
            </li>
            <li className="list-none">
              <Link to="/" target="_blank" className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.2)] flex items-center justify-center group hover:bg-[var(--bg-primary)] transition-all duration-500">
                <BsTwitterX className="group-hover:text-white text-[50px] p-2" />
              </Link>
            </li>
            <li className="list-none">
              <Link to="/" target="_blank" className="w-[35px] h-[35px] rounded-full border border-[rgba(0,0,0,0.2)] flex items-center justify-center group hover:bg-[var(--bg-primary)] transition-all duration-500">
                <FaYoutube className="group-hover:text-white text-[50px] p-1.5" />
              </Link>
            </li>
          </ul>
          <p className="text-[13px] text-center mb-0">&copy;2024-2025 EcommerceApp.com</p>

          <div className="flex items-center">
            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c454fb.svg" alt="visa" />
          </div>
        </div>
      </div> */}


      <footer className="bg-[#fafafa] px-4 sm:px-6 py-6 md:py-8">
        <div className="container mx-auto">
          {/* Features Section */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-20 pb-8 md:pb-16 py-4 md:py-8">
            {[
              { icon: <CiDeliveryTruck className="logo text-[40px] md:text-[50px] lg:text-[60px] transition-all duration-300 group-hover:-translate-y-2 group-hover:text-[var(--bg-primary)]" />, title: "Free Shipping", text: "On all orders over ₹500" },
              { icon: <RiForward30Fill className="logo text-[40px] md:text-[50px] lg:text-[60px] transition-all duration-300 group-hover:-translate-y-2 group-hover:text-[var(--bg-primary)]" />, title: "30 Days Returns", text: "For an Exchange Product" },
              { icon: <IoWalletOutline className="logo text-[40px] md:text-[50px] lg:text-[60px] transition-all duration-300 group-hover:-translate-y-2 group-hover:text-[var(--bg-primary)]" />, title: "Secured Payment", text: "Payment Cards Accepted" },
              { icon: <CiGift className="logo text-[40px] md:text-[50px] lg:text-[60px] transition-all duration-300 group-hover:-translate-y-2 group-hover:text-[var(--bg-primary)]" />, title: "Special Gifts", text: "Our First Product Order" },
              { icon: <TfiHeadphoneAlt className="logo text-[40px] md:text-[50px] lg:text-[60px] transition-all duration-300 group-hover:-translate-y-2 group-hover:text-[var(--bg-primary)]" />, title: "Support 24/7", text: "Contact us Anytime" }
            ].map((feature, index) => (
              <div key={index} className="col flex flex-col items-center group w-[150px] sm:w-[160px] md:w-auto px-2 py-3">
                {feature.icon}
                <h3 className="font-semibold text-sm sm:text-base md:text-[17px] mt-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-center">{feature.text}</p>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          {/* Main Footer Content */}
          <div className="footer flex flex-col lg:flex-row gap-8 md:gap-12 py-6 md:py-8">
            {/* Contact Us */}
            <div className="part1 lg:w-full lg:max-w-[25%] lg:border-r lg:border-[rgba(0,0,0,0.1)] lg:pr-8">
              <h2 className="text-lg md:text-[20px] font-semibold pb-3 md:pb-4">Contact Us</h2>
              <address className="text-sm md:text-[14px] font-normal not-italic pb-3 md:pb-4 leading-relaxed">
                Classyshop - Mega Super Store <br /> 507-Union Trade Centre <br /> France
              </address>
              <Link to="mailto:sales@yourcompany.com" className="link text-sm md:text-[14px] hover:text-[var(--bg-primary)]">
                sales@yourcompany.com
              </Link>
              <Link
                to="tel:(+91) 9876-543-210"
                className="text-lg md:text-xl lg:text-[24px] font-semibold block w-full mt-2 md:mt-3 text-[var(--bg-primary)] mb-4 md:mb-5"
              >
                (+91) 9876-543-210
              </Link>
              <div className="flex items-center gap-2">
                <IoMdChatboxes className="text-3xl md:text-[40px] hover:text-[var(--bg-primary)] cursor-pointer" />
                <span className="font-semibold text-sm md:text-[16px] pl-2 md:pl-3">
                  Online Chat <br /> Get Expert Help
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="part2 lg:w-full lg:max-w-[40%] flex flex-col sm:flex-row gap-6 md:gap-8 lg:pl-8 lg:pr-4">
              <div className="part2_col1 w-full sm:w-1/2">
                <h2 className="text-lg md:text-[20px] font-semibold pb-3 md:pb-4">Products</h2>
                <ul className="space-y-2 md:space-y-3">
                  {['Price Drop', 'New Products', 'Best Sales', 'Contact Us', 'Sitemap', 'Stores'].map((item) => (
                    <li key={item} className="list-none">
                      <Link to="/" className="link text-sm md:text-[14px] hover:text-[var(--bg-primary)]">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="part2_col2 w-full sm:w-1/2">
                <h2 className="text-lg md:text-[20px] font-semibold pb-3 md:pb-4">Our Company</h2>
                <ul className="space-y-2 md:space-y-3">
                  {['Delivery', 'Legal Notice', 'Terms and conditions of use', 'About us', 'Secure payment', 'Login'].map((item) => (
                    <li key={item} className="list-none">
                      <Link to="/" className="link text-sm md:text-[14px] hover:text-[var(--bg-primary)]">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="part3 lg:w-full lg:max-w-[35%] lg:px-8 flex flex-col">
              <h2 className="text-lg md:text-[20px] font-semibold pb-3 md:pb-4">
                Subscribe to newsletter
              </h2>
              <p className="mb-2 text-sm md:text-[14px] font-normal">
                Subscribe to our latest newsletter to get news about special discounts.
              </p>

              {/* <form action="/" className="w-full">
                <Box sx={{ width: '100%', maxWidth: "100%" }} className="my-3">
                  <TextField
                    type="email"
                    fullWidth
                    size="small"
                    label="Email"
                    id="email-input"
                    value={email}
                    onChange={handleChange}
                    error={error}
                    helperText={error ? "Please enter a valid email address" : ""}
                    variant="outlined"
                    className="custom-textfield"
                  />
                </Box>
                <Tooltip
                  title={!isChecked ? "Agree to the Terms & Conditions" : ""}
                  placement="right"
                  arrow
                >
                  <Button
                    variant="contained"
                    className={`uppercase text-sm md:text-base ${isChecked
                      ? "buttonPrimaryBlack"
                      : "hover:!bg-gray-400 !cursor-not-allowed"
                      }`}
                    onClick={handleSubscribe}
                    size="small"
                  >
                    Subscribe
                  </Button>
                </Tooltip>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      size="small"
                    />
                  }
                  className="mt-3 items-start"
                  label={
                    <span className="text-xs md:text-[10px]">
                      I agree to the terms and conditions and the privacy
                      policy. <span className="text-red-500 text-xs md:text-sm">*</span>
                    </span>
                  }
                  labelPlacement="end"
                />
              </form> */}
              <form action="/" className="w-full px-4 sm:px-6 md:px-8">
                <Box className="w-full max-w-[500px] mx-auto my-3">
                  <TextField
                    type="email"
                    fullWidth
                    label="Email"
                    id="email-input"
                    value={email}
                    onChange={handleChange}
                    error={error}
                    helperText={error ? "Please enter a valid email address" : ""}
                    variant="outlined"
                    className="custom-textfield"
                  />
                </Box>

                <div className="w-full max-w-[500px] mx-auto">
                  <Tooltip
                    title={!isChecked ? "Agree to the Terms & Conditions" : ""}
                    placement="right"
                    arrow
                  >
                    <Button
                      variant="contained"
                      className={`uppercase w-full sm:w-auto buttonPrimaryBlack ${!isChecked ? "hover:!bg-gray-400 !cursor-not-allowed" : ""
                        }`}
                      onClick={handleSubscribe}
                    >
                      Subscribe
                    </Button>
                  </Tooltip>

                  <div className="mt-3 flex items-center">
                    <Checkbox
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      className="mt-1" // fine-tunes vertical alignment
                    />
                    <span className="text-[10px] sm:text-xs md:text-sm leading-snug">
                      I agree to the terms and conditions and the privacy policy.{" "}
                      <span className="text-red-500 text-sm">*</span>
                    </span>
                  </div>
                </div>
              </form>
              
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Strip */}
      <div className="border-t border-[rgba(0,0,0,0.2)] py-3 pb-16 lg:pb-3 px-4 sm:px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <ul className="flex items-center gap-2 order-1 sm:order-1">
            {[
              { icon: <RiFacebookFill className="group-hover:text-white text-[24px] p-1" />, label: "Facebook" },
              { icon: <BsTwitterX className="group-hover:text-white text-[24px] p-1.5" />, label: "Twitter" },
              { icon: <FaYoutube className="group-hover:text-white text-[24px] p-1" />, label: "YouTube" }
            ].map((social, index) => (
              <li key={index} className="list-none">
                <Link
                  to="/"
                  target="_blank"
                  aria-label={social.label}
                  className="w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] rounded-full border border-[rgba(0,0,0,0.2)] flex items-center justify-center group hover:bg-[var(--bg-primary)] transition-all duration-300"
                >
                  {social.icon}
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-xs sm:text-[13px] text-center order-3 sm:order-2">
            &copy;2024-2025 EcommerceApp.com
          </p>

          <div className="flex items-center order-2 sm:order-3">
            <img
              src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c454fb.svg"
              alt="Payment methods"
              className="h-4"
              loading="lazy"
            />
          </div>
        </div>
      </div>


      {/* Cart Panel */}
      <Drawer open={context.openCartPanel} onClose={context.toggleCartPanel(false)} anchor="right">
        <div className="flex items-center justify-between px-4 py-1 !w-[400px] !max-w-[400px]">
          <h3 className="text-[18px] !font-semibold text-[var(--text-dark)]">Shopping Cart ({context.cartData.length})</h3>
          <Button
            className="!w-[40px] !h-[40px] !min-w-[40px] !shadow-sm !text-red-500 !rounded-full flex items-center justify-center"
            onClick={context.toggleCartPanel(false)}
          >
            <IoCloseOutline className="text-[50px]" onClose={context.toggleCartPanel(false)} />
          </Button>
        </div>
        <Divider />
        {/* <CartPanel  /> */}
        {
          context?.cartData?.length !== 0 ?
            <CartPanel data={context?.cartData} />
            :
            <div className='w-full h-full flex flex-col items-center justify-center gap-2'>
              {/* <MdOutlineRemoveShoppingCart className='text-[40px]' /> */}
              <span className="flex items-center justify-center">
                <img src="../empty-cart.png" alt="empty-cart-img" className="w-[200px]" />
              </span>
              <span className="text-[18px] mt-4">Your cart is empty!</span>
              <span className="text-[12px]">Add items to it now.</span>
              <Link to="/" className="w-[50%] min-w-[30%] !mt-2 !flex !items-center !justify-center">
                <Button className="buttonPrimaryBlack !normal-case w-[100%] min-w-[30%] !mt-2" onClick={context.toggleCartPanel(false)}>Shop now</Button>
              </Link>
            </div>
        }

      </Drawer>


      <Dialog
        open={context?.openProductDetailsModal.open}
        onClose={context?.handleCloseProductDetailsModal}
        fullWidth={context?.fullWidth}
        maxWidth={context?.maxWidth}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="productDetailsModal"
        classes={"relative"}
      >
        <DialogContent>
          <div className="flex items-start w-full productDetailsModalContainer gap-10 p-5">
            {/* Close Button */}
            <Button
              className="!w-[40px] !h-[40px] !min-w-[40px] !bg-red-50 shadow !text-red-500 !rounded-full !absolute top-[20px] right-[30px] z-10"
              onClick={context?.handleCloseProductDetailsModal}
            >
              <IoCloseOutline className="text-[30px]" />
            </Button>

            {
              context?.openProductDetailsModal?.product?.length !== 0 &&
              ( // Ensure cartData exists before rendering
                <>
                  {/* Left Column with Sticky */}
                  <div className="col1 w-[50%] sticky top-5">
                    <ProductZoom images={context?.openProductDetailsModal?.product?.images} />
                  </div>

                  {/* Right Column */}
                  <div className="col2 w-[50%] h-full  p-2 productContent">
                    <ProductDetailsContent product={context?.openProductDetailsModal?.product} reviewsCount={context?.reviewsCount} />
                  </div>
                </>
              )
            }
          </div>

        </DialogContent>
      </Dialog>


    </>
  );
};

export default Footer;
