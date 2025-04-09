// import React from 'react'

import PropTypes from "prop-types";
import { IoIosArrowForward } from "react-icons/io";
import { LuClock9 } from "react-icons/lu";
import { Link } from "react-router-dom";

// const BlogItem = (props) => {
//   return (
//     <div className="blogItem group">
//       <div className="imgWrapper w-full h-[200px] overflow-hidden rounded-md relative">
//         <img
//           src={props?.item?.images[0]}
//           alt="blog image"
//           className="w-full h-auto transition-all duration-1000 group-hover:scale-125 group-hover:rotate-3 cursor-pointer"
//         />

//         <span className="flex items-center justify-center text-white absolute bottom-[15px] right-[15px] z-50 bg-[var(--bg-primary)] rounded-md p-1 text-[11px] font-medium gap-1">
//           <LuClock9 className="text-[15px]" /><span>{new Date(props?.item?.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }).toUpperCase()}</span>
//         </span>
//       </div>

//       <div className="info py-4">
//         <h2 className="text-[15px] font-semibold text-black leading-5 mb-1"><Link to="/" className="link">{props?.item?.title}</Link></h2>
//         <p className="text-[13px] font-normal text-[rgba(0,0,0,0.8)] mb-4 line-clamp-2 leading-5">{props?.item?.description?.replace(/<[^>]+>/g, '').substr(0, 150) + (props?.item?.description?.length > 150 ? "..." : "")}</p>
//         <Link to="/" className="link font-medium flex items-center gap-1">
//             Read More <IoIosArrowForward />
//         </Link>
//       </div>
//     </div>
//   );
// };

const BlogItem = (props) => {
  return (
    <div className="blogItem group h-full flex flex-col">
      <div className="imgWrapper w-full h-[150px] sm:h-[180px] md:h-[200px] overflow-hidden rounded-md relative">
        <img
          src={props?.item?.images[0]}
          alt={props?.item?.title || "Blog post"}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 cursor-pointer"
          loading="lazy"
        />

        <span className="flex items-center justify-center text-white absolute bottom-2 sm:bottom-3 right-2 sm:right-3 z-50 bg-[var(--bg-primary)] rounded-md px-2 py-1 text-[10px] sm:text-xs font-medium gap-1">
          <LuClock9 className="text-xs sm:text-sm" />
          <span>
            {new Date(props?.item?.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }).toUpperCase()}
          </span>
        </span>
      </div>

      <div className="info py-3 sm:py-4 flex-1 flex flex-col">
        <h2 className="text-sm sm:text-[15px] font-semibold text-black leading-tight sm:leading-5 mb-1">
          <Link to="/" className="hover:text-[var(--bg-primary)] transition-colors">
            {props?.item?.title}
          </Link>
        </h2>
        <p className="text-xs sm:text-[13px] font-normal text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-snug sm:leading-5">
          {props?.item?.description?.replace(/<[^>]+>/g, '').substr(0, 120) + 
           (props?.item?.description?.length > 120 ? "..." : "")}
        </p>
        <Link 
          to="/" 
          className="link font-medium text-xs sm:text-sm flex items-center gap-1 mt-auto text-[var(--bg-primary)] hover:underline"
        >
          Read More <IoIosArrowForward className="text-xs sm:text-sm" />
        </Link>
      </div>
    </div>
  );
};

BlogItem.propTypes = {
  item: PropTypes.shape({
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      createdAt: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
  }).isRequired,
};

export default BlogItem;
