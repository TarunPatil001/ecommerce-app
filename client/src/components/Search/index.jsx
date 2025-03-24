// // import React from 'react'
import "./styles.css"
import Button from '@mui/material/Button';
import { useContext, useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";


const Search = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null); // Store timeout ID


  // Handle input change with a delay
  const onChangeInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };


  const search = async () => {
    const trimmedQuery = searchQuery.trim();
    context?.setSearchQuery(trimmedQuery);
  
    if (trimmedQuery === "") return; // Prevent empty search
  
    const obj = {
      page: 1,
      limit: Number.MAX_SAFE_INTEGER, // Effectively infinite limit
      query: trimmedQuery,
    };
  
    try {
      const res = await postData(`/api/product/search/get`, obj);
  
      if (res?.data?.length > 0) {
        context?.setSearchData(res);
        navigate(`/search`);
      } else {
        console.warn("No results found for the given query.");
      }
    } catch (error) {
      console.error("Search request failed:", error);
    }
  };
  

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      search(e);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Box */}
      <div className="searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-md relative p-2">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px]"
          value={searchQuery}
          onChange={onChangeInput}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onClick={(e) => e.stopPropagation()}
        />
        <Button
          className="!absolute top-[8px] right-[5px] z-50 w-[37px] !min-w-[37px] h-[37px] !rounded-full !text-black"
          onClick={search}
          aria-label="Search"
        >
          <IoSearch className="text-[#4e4e4e] text-[22px] link" />
        </Button>
      </div>

      {/* Search Result List */}
      {/* {isFocused && searchQuery && (
        <ul className="absolute top-[55px] left-0 w-full border rounded-md p-2 bg-white max-h-[450px] overflow-y-auto shadow-lg z-[1000]">
          {loading ? (
            <li className="p-2 text-center">Loading...</li>
          ) : searchData?.data?.length > 0 ? (
            searchData?.data?.map((item) => (
              <li
                key={item._id}
                className="p-2 flex gap-3 items-center border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
                onClick={(e) => { navigate(`/product/${item._id}`); e.target.blur(); setIsFocused(false); }}
              >
                <div>
                  <p className="text-[14px] font-semibold">
                    {item.name} ({item.brand})
                  </p>
                </div>
              </li>
            ))
          ) : (
            <li className="p-2 text-center">No products found.</li>
          )}

        </ul>
      )} */}
    </div>
  );
};

export default Search;


// import "./styles.css";
// import Button from '@mui/material/Button';
// import { useContext, useEffect, useRef, useState } from "react";
// import { IoSearch } from "react-icons/io5";
// import { MyContext } from "../../App";
// import { postData } from "../../utils/api";
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";



// const Search = () => {
//   const context = useContext(MyContext);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchData, setSearchData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isFocused, setIsFocused] = useState(false);
//   const searchRef = useRef(null);
//   const searchTimeout = useRef(null);

//   // 🚀 Trigger immediately when URL changes
//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const query = queryParams.get("query") || "";

//     console.log("URL Changed: ", location.search, "Extracted Query:", query);

//     // ✅ Instead of relying on state, pass `query` directly to fetchResults
//     if (query) {
//       setSearchQuery(query);
//       context?.setSearchQuery(query);
//       fetchResults(query); // ✅ Ensures the latest query is used
//     }

//   }, [location.search]); // ✅ Effect runs immediately when URL updates

//   useEffect(() => {
//     if (context.searchQuery) {
//       context?.setSearchData(searchData || []);
//     }
//   },[context?.searchData]);

//   const fetchResults = async (query) => {
//     if (!query.trim()) return;
//     setLoading(true);
//     try {
//       const res = await postData("/api/product/search/get", { query, page: 1, limit: 8 });
//       setSearchData(res || []);
//       // context?.setSearchData(res || []);
//       console.log("Fetch Results: ", res);
//     } catch (error) {
//       console.error("Search API Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onChangeInput = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);

//     if (!query.trim()) {
//       setSearchData([]);
//       return;
//     }

//     if (searchTimeout.current) clearTimeout(searchTimeout.current);

//     searchTimeout.current = setTimeout(() => {
//       fetchResults(query);
//     }, 500);
//   };

  
//   const onKeyDown = async (e) => {
//     if (e.key === "Enter") {
//       await search();
//     }
//   };

//   const search = async () => {
//     if (!searchQuery.trim()) return;

//     setLoading(true);
//     context?.setSearchData(searchData || []);
//     context?.setSearchQuery(searchQuery);

//     console.log("Search Results: ", searchData);
//     console.log("Navigating to:", `/search?query=${encodeURIComponent(searchQuery)}`);

//     setIsFocused(false); // 🔴 Move this before navigation
//     navigate(`/search?query=${encodeURIComponent(searchQuery)}`);

//     setLoading(false);
//   };


//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setTimeout(() => setIsFocused(false), 150); // Add slight delay
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);



//   useEffect(() => {
//     console.log("isFocused:", isFocused);
//   }, [isFocused]);



//   return (
//     <div className="relative" ref={searchRef}>
//       {/* Search Box */}
//       <div className="searchBox w-[100%] h-[50px] bg-[#e5e5e5] rounded-md relative p-2">
//         <input
//           type="text"
//           placeholder="Search for products..."
//           className="w-full h-[35px] focus:outline-none bg-inherit p-2 text-[15px]"
//           value={searchQuery}
//           onChange={onChangeInput}
//           onKeyDown={onKeyDown}
//           onFocus={() => setIsFocused(true)}
//           onClick={(e) => e.stopPropagation()}
//         />

//         <Button
//           className="!absolute top-[8px] right-[5px] z-50 w-[37px] !min-w-[37px] h-[37px] !rounded-full !text-black"
//           onClick={search}
//           aria-label="Search"
//         >
//           <IoSearch className="text-[#4e4e4e] text-[22px] link" />
//         </Button>
//       </div>

//       {/* Search Result List */}
//       {isFocused && searchQuery && (
//         <ul className="absolute top-[55px] left-0 w-full border rounded-md p-2 bg-white max-h-[450px] overflow-y-auto shadow-lg z-[1000]">
//           {loading ? (
//             <li className="p-2 text-center">Loading...</li>
//           ) : searchData?.data?.length > 0 ? (
//             searchData?.data?.map((item) => (
//               <li
//                 key={item._id}
//                 className="p-2 flex gap-3 items-center border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
//                 onClick={() => { navigate(`/product/${item._id}`); setIsFocused(false); }}
//               >
//                 <div>
//                   <p className="text-[14px] font-semibold">
//                     {item.name} ({item.brand})
//                   </p>
//                 </div>
//               </li>
//             ))
//           ) : (
//             <li className="p-2 text-center">No products found.</li>
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Search;

