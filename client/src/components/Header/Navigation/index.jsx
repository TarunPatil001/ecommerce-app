import "./style.css";
import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { RiMenu2Fill } from "react-icons/ri";
import { LiaAngleDownSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { GoRocket } from "react-icons/go";
import CategoryPanel from "./CategoryPanel";
import { IoIosArrowForward } from "react-icons/io";
import { MyContext } from "../../../App";
import MobileNav from "./mobileNav";
import PropTypes from "prop-types";

const Navigation = (props) => {
  const context = useContext(MyContext);
  const [setIsSticky] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [catData, setCatData] = useState([]);

  useEffect(() => {
    setCatData(context?.catData);
  }, [context?.catData]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav className="navigation bg-white border-t shadow-md w-full transition-all duration-500 sticky top-[82px] left-0 z-[999] lg:px-0">
        <div className="container flex items-center justify-center lg:justify-end gap-8">

          {
            context?.windowWidth > 992 &&
            <>
              <div className="col_1 w-[20%]">
                <Button
                  className="!text-black !text-[14px] !font-[600] gap-2 w-full hover:!text-[rgba(0,0,0,0.9)]"
                  disableRipple
                  onClick={() => props?.setIsOpenCatPanel(true)}
                >
                  <RiMenu2Fill />
                  Shop By Categories
                  <LiaAngleDownSolid className="text-[13px] ml-auto font-bold" />
                </Button>
              </div>
              <span className="line !h-[20px]"></span>
            </>
          }


          <div className="col_2 w-full lg:w-[60%]">
            <ul className="flex items-center gap-3 nav">
              <li className="list-none mr-3">
                <Link to="/" className="link transition">
                  <Button className="link transition !text-[14px] !font-[600] !text-[rgba(0,0,0,0.9)] hover:!text-[var(--bg-primary)] text-capitalize !py-4">
                    Home
                  </Button>
                </Link>
              </li>

              {catData?.length !== 0 &&
                catData.map((cat, index) => (
                  <li className="list-none relative mr-3" key={index}>
                    <Link
                      to={`/products?categoryId=${cat?._id}`}
                      className="link transition font-[500]"
                    >
                      <Button className="link transition !text-[14px] !font-[600] !text-[rgba(0,0,0,0.9)] !py-4">
                        {cat?.name}
                      </Button>
                    </Link>

                    {cat?.children?.length !== 0 && (
                      <div className="submenu absolute top-[100%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 visibility-hidden transition-all">
                        <ul>
                          {cat?.children.map((subCat, index_) => (
                            <li className="list-none w-full relative" key={index_}>
                              <Link to={`/products?subCategoryId=${subCat?._id}`} className="w-full">
                                <Button className="!text-[rgba(0,0,0,0.9)] !pl-4 w-full !text-left !justify-between !rounded-none">
                                  {subCat?.name}
                                  {subCat?.children?.length !== 0 && <IoIosArrowForward />}
                                </Button>
                              </Link>

                              {subCat?.children?.length !== 0 && (
                                <div className="submenu absolute top-[0%] left-[100%] min-w-[150px] bg-white shadow-md opacity-0 visibility-hidden transition-all">
                                  <ul>
                                    {subCat?.children.map((childSubCat, index__) => (
                                      <li className="list-none w-full" key={index__}>
                                        <Link to={`/products?thirdSubCategoryId=${childSubCat?._id}`} className="w-full">
                                          <Button className="!text-[rgba(0,0,0,0.9)] !pl-4 w-full !text-left !justify-start !rounded-none">
                                            {childSubCat?.name}
                                          </Button>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </div>


          {
            context?.windowWidth > 992 &&
            <div className="col_3 w-[20%]">
              <p className="!text-[14px] !font-[600] flex items-center gap-3 mt-0 mb-0">
                <GoRocket className="text-[18px]" />
                Free International Delivery
              </p>
            </div>
          }
        </div>
      </nav>

      {/* ----------  Category Panel Sidebar  ---------- */}
      {catData?.length !== 0 && (
        <CategoryPanel
          isOpenPanel={props.isOpenCatPanel}
          setIsOpenCatPanel={props.setIsOpenCatPanel}
          categoryData={catData}
        />
      )}

      {context?.windowWidth < 992 && <MobileNav />}
    </>
  );
};

Navigation.propTypes = {
  isOpenCatPanel: PropTypes.bool.isRequired,
  setIsOpenCatPanel: PropTypes.func.isRequired,
};

export default Navigation;
