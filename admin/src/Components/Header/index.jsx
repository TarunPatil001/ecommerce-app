import React, { useContext, useEffect, useState } from 'react'
import { Badge, Button, Divider, IconButton } from '@mui/material';
import { AiOutlineMenuFold } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { FaRegBell, FaRegUser } from "react-icons/fa";
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MdOutlineDoubleArrow, MdOutlineLogout } from "react-icons/md";
import { MyContext } from "../../App";


const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Header = () => {

  const [anchorMyAcc, setAnchorMyAcc] = useState(null);
  const openMyAcc = Boolean(anchorMyAcc);

  const [isSticky, setIsSticky] = useState(true); // Track sticky state
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position
  
  const handleClickMyAcc = (event) => {
    setAnchorMyAcc(event.currentTarget);
  };
  const handleCloseMyAcc = () => {
    setAnchorMyAcc(null);
  };


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar (sticky) when scrolling up
      if (currentScrollY < lastScrollY) {
        setIsSticky(true);
      }
      // Hide navbar (non-sticky) when scrolling down
      else {
        setIsSticky(false);
      }

      setLastScrollY(currentScrollY); // Update the last scroll position
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const context = useContext(MyContext);

  return (
    <header className={`w-full h-auto py-2 shadow-md ${context.isSidebarOpen === true ? 'pl-72' : 'pl-5'} bg-[#fff] pr-7 flex items-center justify-between z-[50] transition-all duration-300 ${isSticky ? "sticky top-0" : "-top-[100px]"}`}>
      <div className="part1">
        <Button className="!w-[40px] !h-[40px] !rounded-full !min-w-[40px] !text-[rgba(0,0,0,0.8)] shadow-md hover:bg-gray-200" onClick={()=>context.setIsSidebarOpen(!context.isSidebarOpen)}><MdOutlineDoubleArrow className={`text-[18px] ${context.isSidebarOpen === true ? '-rotate-180' : 'rotate-0'} transition-all duration-300`} /></Button>
      </div>

      <div className="part2 w-[40%] flex items-center justify-end gap-5">
        <IconButton aria-label="notification">
          <StyledBadge badgeContent={4} color="secondary">
            <FaRegBell />
          </StyledBadge>
        </IconButton>

        <div className="relative">
          <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer" onClick={handleClickMyAcc}>
            <img src="https://ecme-react.themenate.net/img/avatars/thumb-1.jpg" alt="" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>
        <Menu
          anchorEl={anchorMyAcc}
          id="account-menu"
          open={openMyAcc}
          onClose={handleCloseMyAcc}
          onClick={handleCloseMyAcc}
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
          <MenuItem onClick={handleCloseMyAcc}>
            <div className="flex items-center gap-3">
              <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer">
                <img src="https://ecme-react.themenate.net/img/avatars/thumb-1.jpg" alt="" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="info">
                <h3 className='text-[14px] font-bold leading-5'>Angelina Gotelli</h3>
                <p className='text-[12px] opacity-70'>admin-01@ecme.com</p>
              </div>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleCloseMyAcc} className='flex items-center gap-3'>
          <FaRegUser className='text-[14px]' /> <span className='text-[14px]'>Profile</span>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleCloseMyAcc} className='flex items-center gap-3'>
          <MdOutlineLogout className='text-[15px]' /> <span className='text-[14px]'>Sign out</span>
          </MenuItem>
        </Menu>
      </div>
    </header>
  )
}

export default Header