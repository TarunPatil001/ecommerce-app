// import React from 'react'

import { IoIosArrowForward } from "react-icons/io";
import { LuClock9 } from "react-icons/lu";
import { Link } from "react-router-dom";

const BlogItem = () => {
  return (
    <div className="blogItem group">
      <div className="imgWrapper w-full overflow-hidden rounded-md relative">
        <img
          src="https://demos.codezeel.com/prestashop/PRS21/PRS210502/img/psblog/b/9/1105_813/b-blog-7.jpg"
          alt="blog image"
          className="w-full transition-all duration-1000 group-hover:scale-125 group-hover:rotate-3 cursor-pointer"
        />

        <span className="flex items-center justify-center text-white absolute bottom-[15px] right-[15px] z-50 bg-[var(--bg-primary)] rounded-md p-1 text-[11px] font-medium gap-0.5">
          <LuClock9 className="text-[15px]" /><span>21 DECEMBER 2024</span>
        </span>
      </div>

      <div className="info py-4">
        <h2 className="text-[15px] font-semibold text-black"><Link to="/" className="link">Nullam ullamcorper ornare molestie</Link></h2>
        <p className="text-[13px] font-normal text-[rgba(0,0,0,0.8)] mb-4 line-clamp-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem veniam provident deleniti cupiditate similique eius amet voluptate voluptates quo voluptatum earum ut, laborum iusto explicabo maxime impedit est fuga pariatur neque repellat ea dicta recusandae placeat! Quidem, omnis corrupti earum dolor debitis itaque fuga corporis dolores cumque! Libero, numquam optio.</p>
        <Link to="/" className="link font-medium flex items-center gap-1">
            Read More <IoIosArrowForward />
        </Link>
      </div>
    </div>
  );
};

export default BlogItem;
