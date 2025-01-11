import { IoSearchOutline } from 'react-icons/io5'

const SearchBox = () => {
  return (
      <div className='w-full h-auto border bg-[#f1f1f1] relative rounded-md'>
        <IoSearchOutline className='top-[10px] left-[5px] text-[20px] absolute z-50 pointer-events-none opacity-80' />
        <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.1)] bg-[#f1f1f1] p-2 focus:outline-none focus:border-[rgba(0,0,0,0.5)] pl-8 rounded-md' placeholder="Search by product name..." />
    </div>
  )
}

export default SearchBox
