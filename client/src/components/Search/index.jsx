// import React from 'react'
import "./styles.css"
import Button from '@mui/material/Button';
import { IoSearch } from "react-icons/io5";

const Search = () => {
  return (
    <div>
      <div className="searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-md relative p-2">
        <input type="text" placeholder="Search for products..." className='w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px]' />
        <Button className="!absolute top-[8px] right-[5px] z-50 w-[37px] !min-w-[37px] h-[37px] !rounded-full !text-black"><IoSearch className='text-[#4e4e4e] text-[22px] link'/></Button>
      </div>
    </div>
  )
}

export default Search