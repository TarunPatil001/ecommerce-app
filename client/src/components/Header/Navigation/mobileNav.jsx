import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button } from '@mui/material';
import { RiAccountCircleLine, RiHome2Line } from "react-icons/ri";
import { FiSearch } from 'react-icons/fi';
import { IoMdHeartEmpty } from 'react-icons/io';
import { IoBagCheckOutline } from 'react-icons/io5';
import { MdAccountCircle } from 'react-icons/md';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import { MyContext } from '../../../App';
import { fetchDataFromApi } from '../../../utils/api';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { TbLogout } from 'react-icons/tb';

const MobileNav = () => {

  const context = useContext(MyContext);
  const shouldShow = location.pathname === '/products' || location.pathname === '/search';
  const [isAccountPopupOpen, setAccountPopupOpen] = useState(false);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);

  const popupRef = useRef(null);

  // 🔄 Close popup on click outside
  useEffect(() => {
    
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setAccountPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Directly set the avatar URL from context if available
    if (context?.userData?.avatar) {
      setAvatar(context?.userData?.avatar);
    }
  }, [context?.userData?.avatar]); // Re-fetch when only the avatar in context changes

  const logout = () => {

    fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem('accessToken')}`, { withCredentials: true }).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        localStorage.clear();
        context.setUserData([]);
        context?.setCartData([]);
        context?.setWishlistData([]);
        navigate("/");
      }
    })
  }

  return (

    <>
      <div className={`mobileNav bg-white p-1 w-full grid ${shouldShow ? "grid-cols-5" : "grid-cols-5"} fixed bottom-0 left-0 place-items-center z-[1001]`}>

        <NavLink to="/" exact={true} activeClassName='isActive' className='!w-full'>
          <Button className='flex flex-col !capitalize !text-[12px] !w-full !min-w-full !text-gray-700'  onClick={()=> context?.setOpenSearchPanel(false)}>
            <RiHome2Line size={18} />
            <span className='text-[12px]'>Home</span>
          </Button>
        </NavLink>

        {/* {shouldShow && (
          // <NavLink to="/" exact="true" activeClassName="isActive">
          <Button className="flex flex-col !capitalize !text-[12px] !w-full !min-w-full !text-[var(--bg-primary)]" onClick={() => context?.setIsSidebarOpen(true)}>
            <FiFilter size={18} />
            <span className="text-[12px]">Filters</span>
          </Button>
          // </NavLink>
        )} */}

        {/* <NavLink to="/search" exact={true} activeClassName='isActive' className='!w-full'> */}
          <Button className={`flex flex-col !capitalize !text-[12px] !w-full !min-w-full !text-gray-700 `} onClick={()=> context?.setOpenSearchPanel(!context?.openSearchPanel)}>
            <FiSearch size={18} />
            <span className='text-[12px]'>Search</span>
          </Button>
        {/* </NavLink> */}

        <NavLink to="/my-wishlist" exact={true} activeClassName='isActive' className='!w-full'>
          <Button className='flex flex-col !capitalize !text-[12px] !w-full !min-w-full !text-gray-700'  onClick={()=> context?.setOpenSearchPanel(false)}>
            <IoMdHeartEmpty size={18} />
            <span className='text-[12px]'>Wishlist</span>
          </Button>
        </NavLink>

        <NavLink to="/my-orders" exact={true} activeClassName='isActive' className='!w-full'>
          <Button className='flex flex-col !capitalize !text-[12px] !w-full !min-w-full !text-gray-700'  onClick={()=> context?.setOpenSearchPanel(false)}>
            <IoBagCheckOutline size={18} />
            <span className='text-[12px]'>Orders</span>
          </Button>
        </NavLink>

        {/* <NavLink to="/my-account" exact={true} activeClassName='isActive' className='!w-full'> */}
        {/* <Button className='flex flex-col !capitalize !text-[12px] !w-full !min-w-full !text-gray-700'>
            <RiAccountCircleLine size={18} />
            <span className='text-[12px]'>Account</span>
          </Button> */}
        {/* </NavLink> */}
        <Button
          onClick={() => {setAccountPopupOpen(prev => !prev); context?.setOpenSearchPanel(false);}}
          className='flex flex-col !capitalize !text-[12px] !w-full !min-w-full !text-gray-700'
        >
          <RiAccountCircleLine size={18} />
          <span className='text-[12px]'>Account</span>
        </Button>
      </div>

      {/* Popup */}
      {isAccountPopupOpen && (
        <div
          ref={popupRef}
          className="fixed bottom-16 right-4 z-[1002] bg-white shadow-lg rounded-xl w-48 p-3 border"
        >
          <ul className="flex flex-col gap-2 text-sm text-gray-700">
            {context?.isLogin ? (
              <>
                <li>
                   <Link to="/my-account" className="hover:text-black" onClick={()=> {setAccountPopupOpen(!isAccountPopupOpen); context?.setOpenSearchPanel(false)}}>
                    <div className="flex flex-row items-center gap-2 w-full">
                      <img
                        src={
                          avatar ||
                          `https://static-00.iconduck.com/assets.00/profile-default-icon-1024x1023-4u5mrj2v.png`
                        }
                        alt="profile"
                        className="w-6 h-6 object-cover rounded-full"
                      />
                      <span>{context?.userData?.name}</span>
                    </div>
                  </Link>
                </li>
                <hr />
                <li>
                   <Link to="/my-addresses" className="hover:text-black" onClick={()=> {setAccountPopupOpen(!isAccountPopupOpen); context?.setOpenSearchPanel(false);}}>
                    <div className="flex flex-row items-center gap-2 w-full">
                      <FaMapMarkerAlt className="w-6 h-5" />
                      <span>Addresses</span>
                    </div>
                  </Link>
                </li>
                <hr />
                <li>
                  <button
                    onClick={()=>{logout(); setAccountPopupOpen(!isAccountPopupOpen); context?.setOpenSearchPanel(false);}}
                    className="text-left w-full hover:text-red-500 flex items-center gap-2"
                  >
                    <TbLogout className="w-6 h-5" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login"
                    className="hover:text-black flex items-center gap-2"
                    onClick={()=> {setAccountPopupOpen(!isAccountPopupOpen); context?.setOpenSearchPanel(false);}}
                  >
                    <MdAccountCircle className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register"
                    className="hover:text-black flex items-center gap-2"
                    onClick={()=> {setAccountPopupOpen(!isAccountPopupOpen); context?.setOpenSearchPanel(false);}}
                  >
                    <RiAccountCircleLine className="w-5 h-5" />
                    <span>Signup</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

    </>
  )
}

export default MobileNav
