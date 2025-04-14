// import  { useContext, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Search from "./../Search/index";
// import Badge from '@mui/material/Badge';
// import { styled } from '@mui/material/styles';
// import IconButton from '@mui/material/IconButton';
// import { MdOutlineShoppingCart } from "react-icons/md";
// import { FaMapMarkerAlt, FaRegHeart, FaUserCircle } from "react-icons/fa";
// import { IoBagCheck, IoGitCompareOutline } from "react-icons/io5";
// import Tooltip from '@mui/material/Tooltip';
// import { MyContext } from "../../App";
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import Divider from '@mui/material/Divider';
// import { TbLogout } from "react-icons/tb";
// import { IoMdHeart } from "react-icons/io";
// import { fetchDataFromApi } from "../../utils/api";
// import Navigation from "./Navigation";


// const StyledBadge = styled(Badge)(({ theme }) => ({
//   '& .MuiBadge-badge': {
//     // right: -3,
//     // top: 13,
//     border: `2px solid ${theme.palette.background.paper}`,
//     padding: '0 4px',
//   },
// }));

// const Header = () => {

//   const context = useContext(MyContext);
//   const navigate = useNavigate();

//   const [loginData, setLoginData] = useState({ avatar: '', name: '', email: '' });
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };


//   useEffect(() => {
//     if (context.isLogin) {
//       setLoginData({
//         avatar: context?.userData?.avatar,
//         name: context?.userData?.name,
//         email: context?.userData?.email,
//       });
//     }
//   }, [context.isLogin, context?.userData?.avatar, context?.userData?.email, context?.userData?.name, context, context?.isReducer]);


//   const logout = () => {
//     setAnchorEl(null);

//     fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem('accessToken')}`, { withCredentials: true }).then((res) => {
//       if (res?.error === false) {
//         context.setIsLogin(false);
//         localStorage.clear();
//         context.setUserData([])
//         context?.setCartData([]);
//         context?.setWishlistData([]);
//         navigate("/");
//       }
//     })
//   }


//   return (
//     <>

//       {/* --------  Top strip of Page -------- */}
//       <div className="top-strip py-2 border-t-[1px] border-b-[1px] border-gray-250 bg-white">
//         <div className="container">
//           <div className="flex items-center justify-between">
//             <div className="col1 w-[50%]">
//               <p className="text-[12px] font-[500]">
//                 Get up to 50% off new season styles, limited time only.
//               </p>
//             </div>

//             <div className="col2 flex items-center justify-end">
//               <ul className="flex items-center gap-3">
//                 <li className="list-none">
//                   <Link
//                     to="/help-center"
//                     className="text-[13px] link font-[500] transition"
//                   >
//                     Help Center
//                   </Link>
//                 </li>
//                 <span className="line !h-[15px]"></span>
//                 <li className="list-none">
//                   <Link
//                     to="/order-tracking"
//                     className="text-[13px] link font-[500] transition"
//                   >
//                     Order Tracking{" "}
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       <header className="bg-white w-full sticky -top-[.5px] left-0 z-[999]">
//         {/* --------  Header Section -------- */}
//         <div className="header py-4 border-b-[1px] border-gray-250  bg-white">
//           <div className="container flex items-center justify-between">
//             {/* --------  Header > Logo -------- */}
//             <div className="col1 w-[25%]">
//               <Link to={"/"}>
//                 <img src="/logo.jpg" alt="Logo" />
//               </Link>
//             </div>

//             {/* --------  Header > Search Input -------- */}
//             <div className="col2 w-[45%]">
//               <Search />
//             </div>

//             {/* --------  Header > Register, Login | [ Compare, Wishlist, Cart ] -------- */}
//             <div className="col3 w-[30%] flex items-center justify-end pl-7">
//               <ul className="flex items-center justify-end gap-3 w-auto">
//                 <li className="list-none w-full">
//                   {
//                     context.isLogin === false ?
//                       (

//                         <div className="flex items-center justify-end">
//                           <Link to="/login" className="link transition text-[15px] font-[500]">Login</Link>
//                           <span className="line !h-[20px] mx-2 !w-[0.5px]"></span>
//                           <Link to="/register" className="link transition text-[15px] font-[500]">Register</Link>
//                         </div>

//                       ) : (
//                         <>
//                           <div className="myAccountWrap px-1 flex items-center justify-end gap-2 rounded-md hover:bg-slate-100 cursor-pointer transition-all duration-300" onClick={handleClick}>
//                             <div className="w-[35px] p-1">
//                               <div className="w-[35px] h-[35px] rounded-full overflow-hidden border flex items-center justify-center border-[rgb(180,180,180)]">
//                                 <img src={loginData?.avatar || `https://ui-avatars.com/api/?name=${loginData?.name?.replace(/ /g, "+")}`} alt="user avatar" className="h-full w-full object-cover" />
//                               </div>
//                             </div>
//                             <div className="flex items-start flex-col  p-1">
//                               <span className="font-bold text-[14px] line-clamp-1 uppercase link transition-all duration-200">{loginData?.name}</span>
//                               <span className="font-medium text-[12px] line-clamp-1 link transition-all duration-200">{loginData?.email}</span>
//                             </div>
//                           </div>

//                           <Menu
//                             anchorEl={anchorEl}
//                             id="account-menu"
//                             open={open}
//                             onClose={handleClose}
//                             onClick={handleClose}
//                             slotProps={{
//                               paper: {
//                                 elevation: 0,
//                                 sx: {
//                                   overflow: 'visible',
//                                   filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
//                                   mt: 1.5,
//                                   '& .MuiAvatar-root': {
//                                     width: 32,
//                                     height: 32,
//                                     ml: -0.5,
//                                     mr: 1,
//                                   },
//                                   '&::before': {
//                                     content: '""',
//                                     display: 'block',
//                                     position: 'absolute',
//                                     top: 0,
//                                     right: 14,
//                                     width: 10,
//                                     height: 10,
//                                     bgcolor: 'background.paper',
//                                     transform: 'translateY(-50%) rotate(45deg)',
//                                     zIndex: 0,
//                                   },
//                                 },
//                               },
//                             }}
//                             transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//                             anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//                           >
//                             <Link to="/my-account">
//                               <MenuItem onClick={handleClose}>
//                                 <ListItemIcon>
//                                   <FaUserCircle className="w-[20px] h-[20px] text-[var(--text-light)]" />
//                                 </ListItemIcon>
//                                 My Account
//                               </MenuItem>
//                             </Link>
//                             <Link to="/my-addresses">
//                               <MenuItem onClick={handleClose}>
//                                 <ListItemIcon>
//                                   <FaMapMarkerAlt className="w-[20px] h-[20px] text-[var(--text-light)]" />
//                                 </ListItemIcon>
//                                 Addresses
//                               </MenuItem>
//                             </Link>
//                             <Link to="/my-orders">
//                               <MenuItem onClick={handleClose}>
//                                 <ListItemIcon>
//                                   <IoBagCheck className="w-[20px] h-[20px] text-[var(--text-light)]" />
//                                 </ListItemIcon>
//                                 Orders
//                               </MenuItem>
//                             </Link>
//                             <Link to="/my-wishlist">
//                               <MenuItem onClick={handleClose}>
//                                 <ListItemIcon>
//                                   <IoMdHeart className="w-[20px] h-[20px] text-[var(--text-light)]" />
//                                 </ListItemIcon>
//                                 Wishlist
//                               </MenuItem>
//                             </Link>
//                             <Divider />
//                             <MenuItem onClick={logout}>
//                               <ListItemIcon>
//                                 <TbLogout className="w-[20px] h-[20px] text-[var(--text-light)]" />
//                               </ListItemIcon>
//                               Logout
//                             </MenuItem>
//                           </Menu>
//                         </>
//                       )
//                   }

//                 </li>
//                 <span className="line !h-[40px] mx-2"></span>
//                 <li>
//                   <Tooltip title="Compare" placement="top" arrow>
//                     <IconButton aria-label="compare" className="link transition">
//                       <StyledBadge badgeContent={4} color="secondary">
//                         <IoGitCompareOutline />
//                       </StyledBadge>
//                     </IconButton>
//                   </Tooltip>
//                 </li>
//                 <li>
//                   <Link to="/my-wishlist">
//                   <Tooltip title="Wishlist" placement="top" arrow>
//                     <IconButton aria-label="wishlist" className="link transition">
//                       <StyledBadge badgeContent={context?.wishlistData?.length || 0} color="secondary">
//                         <FaRegHeart />
//                       </StyledBadge>
//                     </IconButton>
//                   </Tooltip>
//                   </Link>
//                 </li>
//                 <li>
//                   <Tooltip title="Cart" placement="top" arrow>
//                     <IconButton aria-label="cart" className="link transition" onClick={() => context.setOpenCartPanel(true)}>
//                       <StyledBadge badgeContent={context?.cartData?.length || 0} color="secondary" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} className="w-[]">
//                         <MdOutlineShoppingCart />
//                       </StyledBadge>
//                     </IconButton>
//                   </Tooltip>
//                 </li>
//               </ul>

//             </div>
//           </div>
//         </div>

//         <Navigation />


//       </header>
//     </>
//   );
// };

// export default Header;


import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "./../Search/index";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaMapMarkerAlt, FaRegHeart, FaUserCircle } from "react-icons/fa";
import { IoBagCheck, IoGitCompareOutline, IoMenu } from "react-icons/io5";
import Tooltip from '@mui/material/Tooltip';
import { MyContext } from "../../App";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { TbLogout } from "react-icons/tb";
import { IoMdHeart } from "react-icons/io";
import { fetchDataFromApi } from "../../utils/api";
import Navigation from "./Navigation";
import { LuHeart } from "react-icons/lu";
import { Button } from "@mui/material";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ avatar: '', name: '', email: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
   const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openCategoryPanel = () => {
    setIsOpenCatPanel(prev => !prev);
  };

  useEffect(() => {
    if (context.isLogin) {
      setLoginData({
        avatar: context?.userData?.avatar,
        name: context?.userData?.name,
        email: context?.userData?.email,
      });
    }
  }, [context.isLogin, context?.userData]);

  const logout = () => {
    setAnchorEl(null);
    fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem('accessToken')}`, { withCredentials: true }).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        localStorage.clear();
        context.setUserData([]);
        context?.setCartData([]);
        context?.setWishlistData([]);
        navigate("/");
      }
    });
  };

  return (
    // <>
    //   {/* Top Strip */}
    //   <div className="top-strip py-2 border-t border-b border-gray-250 bg-white">
    //     <div className="container mx-auto px-4">
    //       <div className="flex items-center justify-between">
    //         <div className="w-full md:w-1/2">
    //           <p className="text-xs md:text-sm font-medium">
    //             Get up to 50% off new season styles, limited time only.
    //           </p>
    //         </div>

    //         <div className="hidden md:flex items-center justify-end">
    //           <ul className="flex items-center gap-3">
    //             <li>
    //               <Link
    //                 to="/help-center"
    //                 className="text-xs md:text-sm font-medium link transition hover:text-primary"
    //               >
    //                 Help Center
    //               </Link>
    //             </li>
    //             <span className="h-4 w-px bg-gray-300 mx-1"></span>
    //             <li>
    //               <Link
    //                 to="/order-tracking"
    //                 className="text-xs md:text-sm font-medium link transition hover:text-primary"
    //               >
    //                 Order Tracking
    //               </Link>
    //             </li>
    //           </ul>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Main Header */}
    //   <header className="bg-white w-full sticky top-0 left-0 z-[100] shadow-sm">
    //     <div className="container mx-auto px-4">
    //       <div className="flex items-center justify-between py-4">
    //         {/* Logo */}
    //         <div className="w-1/4">
    //           <Link to="/">
    //             <img src="/logo.jpg" alt="Logo" className="h-10 md:h-12" />
    //           </Link>
    //         </div>

    //         {/* Search */}
    //         <div className="md:block w-3/5 px-4">
    //           <Search />
    //         </div>

    //         {/* User Actions */}
    //         <div className="w-2/4 md:w-2/6 h-10 md:h-12 flex justify-end">
    //           <ul className="flex items-center gap-2">
    //             <li className="flex items-center">
    //               {context.isLogin ? (
    //                 <>
    //                   <div 
    //                     className="flex items-center w-[200px] gap-2 p-1 rounded-md hover:bg-gray-100 cursor-pointer transition"
    //                     onClick={handleClick}
    //                     aria-controls="account-menu"
    //                     aria-haspopup="true"
    //                   >
    //                     <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
    //                       <img 
    //                         src={loginData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(loginData?.name || '')}`} 
    //                         alt="User" 
    //                         className="w-full h-full object-cover"
    //                       />
    //                     </div>
    //                     <div className="hidden md:flex flex-col">
    //                       <span className="text-xs font-bold uppercase truncate max-w-[150px]">
    //                         {loginData?.name}
    //                       </span>
    //                       <span className="text-xs truncate max-w-[150px]">
    //                         {loginData?.email}
    //                       </span>
    //                     </div>
    //                   </div>

    //                   <Menu
    //                     anchorEl={anchorEl}
    //                     open={open}
    //                     onClose={handleClose}
    //                     onClick={handleClose}
    //                     PaperProps={{
    //                       elevation: 3,
    //                       sx: {
    //                         mt: 1.5,
    //                         minWidth: 200,
    //                         overflow: 'visible',
    //                         '&:before': {
    //                           content: '""',
    //                           display: 'block',
    //                           position: 'absolute',
    //                           top: 0,
    //                           right: 14,
    //                           width: 10,
    //                           height: 10,
    //                           bgcolor: 'background.paper',
    //                           transform: 'translateY(-50%) rotate(45deg)',
    //                           zIndex: 0,
    //                         },
    //                       },
    //                     }}
    //                     transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    //                     anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    //                   >
    //                     <MenuItem component={Link} to="/my-account" onClick={handleClose}>
    //                       <ListItemIcon>
    //                         <FaUserCircle className="text-gray-500" />
    //                       </ListItemIcon>
    //                       My Account
    //                     </MenuItem>
    //                     <MenuItem component={Link} to="/my-addresses" onClick={handleClose}>
    //                       <ListItemIcon>
    //                         <FaMapMarkerAlt className="text-gray-500" />
    //                       </ListItemIcon>
    //                       Addresses
    //                     </MenuItem>
    //                     <MenuItem component={Link} to="/my-orders" onClick={handleClose}>
    //                       <ListItemIcon>
    //                         <IoBagCheck className="text-gray-500" />
    //                       </ListItemIcon>
    //                       Orders
    //                     </MenuItem>
    //                     <MenuItem component={Link} to="/my-wishlist" onClick={handleClose}>
    //                       <ListItemIcon>
    //                         <IoMdHeart className="text-gray-500" />
    //                       </ListItemIcon>
    //                       Wishlist
    //                     </MenuItem>
    //                     <Divider />
    //                     <MenuItem onClick={logout}>
    //                       <ListItemIcon>
    //                         <TbLogout className="text-gray-500" />
    //                       </ListItemIcon>
    //                       Logout
    //                     </MenuItem>
    //                   </Menu>
    //                 </>
    //               ) : (
    //                 <div className="flex items-center">
    //                   <Link 
    //                     to="/login" 
    //                     className="text-sm font-medium px-2 link transition hover:text-primary"
    //                   >
    //                     Login
    //                   </Link>
    //                   <span className="h-5 w-px bg-gray-300 mx-1"></span>
    //                   <Link 
    //                     to="/register" 
    //                     className="text-sm font-medium px-2 link transition hover:text-primary"
    //                   >
    //                     Register
    //                   </Link>
    //                 </div>
    //               )}
    //             </li>

    //             <span className="h-8 w-px bg-gray-300 mx-1 hidden md:block"></span>

    //             <li>
    //               <Tooltip title="Compare" arrow>
    //                 <IconButton 
    //                   aria-label="compare" 
    //                   className="text-gray-700 hover:text-primary"
    //                   size="medium"
    //                 >
    //                   <StyledBadge badgeContent={4} color="secondary">
    //                     <IoGitCompareOutline className="text-lg" />
    //                   </StyledBadge>
    //                 </IconButton>
    //               </Tooltip>
    //             </li>

    //             <li>
    //               <Tooltip title="Wishlist" arrow>
    //                 <IconButton 
    //                   component={Link} 
    //                   to="/my-wishlist" 
    //                   aria-label="wishlist" 
    //                   className="text-gray-700 hover:text-primary"
    //                   size="medium"
    //                 >
    //                   <StyledBadge badgeContent={context?.wishlistData?.length || 0} color="secondary">
    //                     <FaRegHeart className="text-lg" />
    //                   </StyledBadge>
    //                 </IconButton>
    //               </Tooltip>
    //             </li>

    //             <li>
    //               <Tooltip title="Cart" arrow>
    //                 <IconButton 
    //                   aria-label="cart" 
    //                   className="text-gray-700 hover:text-primary"
    //                   onClick={() => context.setOpenCartPanel(true)}
    //                   size="medium"
    //                 >
    //                   <StyledBadge 
    //                     badgeContent={context?.cartData?.length || 0} 
    //                     color="secondary"
    //                     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    //                   >
    //                     <MdOutlineShoppingCart className="text-lg" />
    //                   </StyledBadge>
    //                 </IconButton>
    //               </Tooltip>
    //             </li>
    //           </ul>
    //         </div>
    //       </div>
    //     </div>

    //     <Navigation />
    //   </header>

    // </>

    <header className="bg-white sticky -top-[47px] left-0 z-[100] shadow-sm">
      {/* Top Strip */}
      <div className="top-strip py-2 border-t border-b border-gray-250 bg-white">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="col1 w-[50%] hidden lg:block">
              <p className="text-[12px] font-medium mt-0 mb-0">
                Get up to 50% off new season styles, limited time only.
              </p>
            </div>

            <div className="col2 w-full lg:w-[50%] flex items-center justify-between lg:justify-end">
              <ul className="flex items-center justify-between lg:justify-end w-full lg:w-[50%] gap-3">
                <li>
                  <Link
                    to="/help-center"
                    className="text-xs md:text-sm font-medium link transition hover:text-primary"
                  >
                    Help Center
                  </Link>
                </li>
                <span className="h-4 w-px bg-gray-300 mx-1 hidden lg:block"></span>
                <li>
                  <Link
                    to="/order-tracking"
                    className="text-xs md:text-sm font-medium link transition hover:text-primary"
                  >
                    Order Tracking
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header border-b-[1px] border-gray-50">
        <div className="container flex items-center justify-between py-2 lg:py-4">
          {/* <div className="flex items-center justify-between py-4"> */}
          {
            context?.windowWidth < 992 &&
            <div className="w-10 h-10 flex items-center justify-center">
              <Button className="!w-[35px] !min-w-[35px] !h-[35px] !rounded-full !text-gray-800" onClick={() => openCategoryPanel(true)}>
                <IoMenu className="text-[22px]" />
              </Button>
            </div>
          }
          {/* Logo */}
          <div className="col1 w-[40%] lg:w-[25%]">
            <Link to="/">
              <img src="/logo.jpg" alt="Logo" />
            </Link>
          </div>

          {/* Search */}
          
          <div className={`col2 fixed top-0 left-0 w-full h-full z-[1000] lg:w-[45%] lg:static p-2 lg:p-0 bg-white  ${context?.windowWidth < 992 && context?.openSearchPanel ? "block" : "hidden"} lg:block`}>
            <Search />
          </div>
          

          {/* User Actions */}
          <div className="col3 w-auto lg:w-[25%] flex justify-end">
            <ul className="flex items-center gap-2">
              {
                context?.windowWidth > 992 &&
                <li className="flex items-center justify-end">
                  {context.isLogin ? (
                    <>
                      <div
                        className="flex items-center justify-end  w-full gap-2 p-1 rounded-md hover:bg-gray-100 cursor-pointer transition"
                        onClick={handleClick}
                        aria-controls="account-menu"
                        aria-haspopup="true"
                      >
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
                          <img
                            src={loginData?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(loginData?.name || '')}`}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="hidden lg:flex flex-col">
                          <span className="text-xs font-bold uppercase truncate max-w-[150px]">
                            {loginData?.name}
                          </span>
                          <span className="text-xs truncate max-w-[150px]">
                            {loginData?.email}
                          </span>
                        </div>
                      </div>

                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                          elevation: 3,
                          sx: {
                            mt: 1.5,
                            minWidth: 200,
                            overflow: 'visible',
                            '&:before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem component={Link} to="/my-account" onClick={handleClose}>
                          <ListItemIcon>
                            <FaUserCircle className="text-gray-500" />
                          </ListItemIcon>
                          My Account
                        </MenuItem>
                        <MenuItem component={Link} to="/my-addresses" onClick={handleClose}>
                          <ListItemIcon>
                            <FaMapMarkerAlt className="text-gray-500" />
                          </ListItemIcon>
                          Addresses
                        </MenuItem>
                        <MenuItem component={Link} to="/my-orders" onClick={handleClose}>
                          <ListItemIcon>
                            <IoBagCheck className="text-gray-500" />
                          </ListItemIcon>
                          Orders
                        </MenuItem>
                        <MenuItem component={Link} to="/my-wishlist" onClick={handleClose}>
                          <ListItemIcon>
                            <IoMdHeart className="text-gray-500" />
                          </ListItemIcon>
                          Wishlist
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={logout}>
                          <ListItemIcon>
                            <TbLogout className="text-gray-500" />
                          </ListItemIcon>
                          Logout
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <div className="flex items-center">
                      <Link
                        to="/login"
                        className="text-sm font-medium px-2 link transition hover:text-primary"
                      >
                        Login
                      </Link>
                      <span className="h-5 w-px bg-gray-300 mx-1"></span>
                      <Link
                        to="/register"
                        className="text-sm font-medium px-2 link transition hover:text-primary"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </li>
              }
              <span className="h-8 w-px bg-gray-300 mx-1 hidden lg:block"></span>

              {/* <li>
                <Tooltip title="Compare" arrow>
                  <IconButton
                    aria-label="compare"
                    className="text-gray-700 hover:text-primary"
                    size="medium"
                  >
                    <StyledBadge badgeContent={4} color="secondary">
                      <IoGitCompareOutline className="text-[22px]" />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li> */}

              {
                context?.windowWidth > 992 &&
                <li>
                  <Tooltip title="Wishlist" arrow>
                    <IconButton
                      component={Link}
                      to="/my-wishlist"
                      aria-label="wishlist"
                      className="text-gray-700 hover:text-primary"
                      size="medium"
                    >
                      <StyledBadge badgeContent={context?.wishlistData?.length || 0} color="secondary">
                        <LuHeart className="text-[22px]" />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </li>
              }

              <li>
                <Tooltip title="Cart" arrow>
                  <IconButton
                    aria-label="cart"
                    className="text-gray-700 hover:text-primary"
                    onClick={() => context.setOpenCartPanel(true)}
                    size="medium"
                  >
                    <StyledBadge
                      badgeContent={context?.cartData?.length || 0}
                      color="secondary"
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <MdOutlineShoppingCart className="text-[22px]" />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
            </ul>
          </div>
          {/* </div> */}
        </div>
      </div>

      <Navigation isOpenCatPanel={isOpenCatPanel} setIsOpenCatPanel={setIsOpenCatPanel} />
    </header>
  );
};

export default Header;