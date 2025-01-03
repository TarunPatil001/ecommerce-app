import React, { useContext } from "react";

import { Link } from "react-router-dom";
import Search from "./../Search/index";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart, FaUserCircle } from "react-icons/fa";
import { IoBagCheck, IoGitCompareOutline } from "react-icons/io5";
import Tooltip from '@mui/material/Tooltip';
import { MyContext } from "../../App";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { TbLogout } from "react-icons/tb";
import { IoMdHeart } from "react-icons/io";


const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    // right: -3,
    // top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {

  const context = useContext(MyContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="bg-white">
      {/* --------  Top strip of Page -------- */}
      <div className="top-strip py-2 border-t-[1px] border-b-[1px] border-gray-250">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="col1 w-[50%]">
              <p className="text-[12px] font-[500]">
                Get up to 50% off new season styles, limited time only.
              </p>
            </div>

            <div className="col2 flex items-center justify-end">
              <ul className="flex items-center gap-3">
                <li className="list-none">
                  <Link
                    to="/help-center"
                    className="text-[13px] link font-[500] transition"
                  >
                    Help Center
                  </Link>
                </li>
                <span className="line !h-[15px]"></span>
                <li className="list-none">
                  <Link
                    to="/order-tracking"
                    className="text-[13px] link font-[500] transition"
                  >
                    Order Tracking{" "}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* --------  Header Section -------- */}
      <div className="header py-4 border-b-[1px] border-gray-250">
        <div className="container flex items-center justify-between">
          {/* --------  Header > Logo -------- */}
          <div className="col1 w-[25%]">
            <Link to={"/"}>
              <img src="/logo.jpg" alt="Logo" />
            </Link>
          </div>

          {/* --------  Header > Search Input -------- */}
          <div className="col2 w-[45%]">
            <Search />
          </div>

          {/* --------  Header > Register, Login | [ Compare, Wishlist, Cart ] -------- */}
          <div className="col3 w-[30%] flex items-center pl-7">
            <ul className="flex items-center justify-end gap-3 w-full">
              <li className="list-none w-full">
                {
                  context.isLogin === false ?
                    (

                      <div className="flex items-center justify-center">
                        <Link to="/login" className="link transition text-[15px] font-[500]">Login</Link>
                        <span className="line !h-[20px] mx-2 !w-[0.5px]"></span>
                        <Link to="/register" className="link transition text-[15px] font-[500]">Register</Link>
                      </div>

                    ) : (
                      <>
                        <div className="myAccountWrap flex items-center justify-start gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-all duration-300 rounded-md" onClick={handleClick}>
                          <div className="w-[35px] p-1">
                            <div className="w-[35px] h-[35px] rounded-full overflow-hidden border flex items-center justify-center border-[rgb(180,180,180)]">
                              <img src={context.username ? `https://t3.ftcdn.net/jpg/02/50/84/98/360_F_250849890_qxH2MudfMq5AFSqHrOp5oA9NqykT14Ti.jpg` : `https://ui-avatars.com/api/?name=Elon+Musk`} alt="user image" className="h-full w-full object-cover" />
                            </div>
                          </div>
                          <div className="flex items-start flex-col w-full p-1">
                            <span className="font-bold text-[14px] line-clamp-1 uppercase link transition-all duration-200">Elon Musk</span>
                            <span className="font-normal text-[12px] line-clamp-1 link transition-all duration-200">elonmusk123@gmail.com</span>
                          </div>
                        </div>

                        <Menu
                          anchorEl={anchorEl}
                          id="account-menu"
                          open={open}
                          onClose={handleClose}
                          onClick={handleClose}
                          slotProps={{
                            paper: {
                              elevation: 0,
                              sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                  width: 32,
                                  height: 32,
                                  ml: -0.5,
                                  mr: 1,
                                },
                                '&::before': {
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
                            },
                          }}
                          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                          <Link to="/my-account">
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <FaUserCircle className="w-[20px] h-[20px] text-[var(--text-light)]" />
                              </ListItemIcon>
                              My Account
                            </MenuItem>
                          </Link>
                          <Link to="/my-orders">
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <IoBagCheck className="w-[20px] h-[20px] text-[var(--text-light)]" />
                              </ListItemIcon>
                              Orders
                            </MenuItem>
                          </Link>
                          <Link to="/my-wishlist">
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <IoMdHeart className="w-[20px] h-[20px] text-[var(--text-light)]" />
                              </ListItemIcon>
                              Wishlist
                            </MenuItem>
                          </Link>
                          <Divider />
                            <MenuItem onClick={handleClose}>
                              <ListItemIcon>
                                <TbLogout className="w-[20px] h-[20px] text-[var(--text-light)]" />
                              </ListItemIcon>
                              Logout
                            </MenuItem>
                        </Menu>
                      </>
                    )
                }

              </li>
              <span className="line !h-[40px] mx-2"></span>
              <li>
                <Tooltip title="Compare" placement="top" arrow>
                  <IconButton aria-label="compare" className="link transition">
                    <StyledBadge badgeContent={4} color="secondary">
                      <IoGitCompareOutline />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
              <li>
                <Tooltip title="Wishlist" placement="top" arrow>
                  <IconButton aria-label="wishlist" className="link transition">
                    <StyledBadge badgeContent={4} color="secondary">
                      <FaRegHeart />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
              <li>
                <Tooltip title="Cart" placement="top" arrow>
                  <IconButton aria-label="cart" className="link transition" onClick={() => context.setOpenCartPanel(true)}>
                    <StyledBadge badgeContent={4} color="secondary" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} className="w-[]">
                      <MdOutlineShoppingCart />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
            </ul>

          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
