import React, { useContext } from "react";

import { Link } from "react-router-dom";
import Search from "./../Search/index";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoGitCompareOutline } from "react-icons/io5";
import Tooltip from '@mui/material/Tooltip';
import { MyContext } from "../../App";


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
              <li className="list-none">
                <div className="flex items-center justify-center">
                  <Link to="/login" className="link transition text-[15px] font-[500]">Login</Link>
                  <span className="line !h-[20px] mx-2 !w-[0.5px]"></span>
                  <Link to="/register" className="link transition text-[15px] font-[500]">Register</Link>
                </div>
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
