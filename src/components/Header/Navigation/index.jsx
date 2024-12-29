import "./style.css";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { RiMenu2Fill } from "react-icons/ri";
import { LiaAngleDownSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { GoRocket } from "react-icons/go";
import CategoryPanel from "./CategoryPanel";
import { IoIosArrowForward } from "react-icons/io";

const Navigation = () => {
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [isSticky, setIsSticky] = useState(true); // Track sticky state
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position


  const openCategoryPanel = (isOpenCatPanel) => {
    setIsOpenCatPanel(isOpenCatPanel);
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

  return (
    <>

      <nav className={`bg-white border-b shadow-md w-full z-[999] transition-all duration-500 ${isSticky ? "sticky top-0" : "-top-[100px]"}`}>
        <div className="container flex items-center justify-end gap-8">
          <div className="col_1 w-[20%]">
            <Button
              className="!text-black !text-[16px] !font-[600] gap-2 w-full hover:!text-[rgba(0,0,0,0.9)]"
              disableRipple
              onClick={() => openCategoryPanel(true)}
            >
              <RiMenu2Fill className="" />
              Shop By Categories
              <LiaAngleDownSolid className="text-[13px] ml-auto font-bold" />
            </Button>
          </div>
          <span className="line !h-[20px]"></span>
          <div className="col_2 w-[60%]">
            <ul className="flex items-center gap-3 nav">
              <li className="list-none">
                <Link to="/" className="link transition ">
                  <Button className="link transition !text-[16px] !font-[600] !text-[rgba(0,0,0,0.9)] hover:!text-[var(--bg-primary)] text-capitalize !py-4">
                    Home
                  </Button>
                </Link>
              </li>
              <li className="list-none relative">
                <Link to="/productListing" className="link transition  font-[500]">
                  <Button className="link transition !text-[16px] !font-[600] !text-[rgba(0,0,0,0.9)] !py-4">
                    Fashion
                  </Button>
                </Link>

                <div className="submenu absolute top-[100%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 visibility-hidden transition-all">
                  <ul>
                    <li className="list-none w-full relative">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.9)]  w-full !text-left !justify-between !rounded-none">
                          Men
                          <IoIosArrowForward />
                        </Button>
                      </Link>
                      <div className="submenu absolute top-[0%] left-[100%] min-w-[150px] bg-white shadow-md opacity-0 visibility-hidden transition-all">
                        <ul>
                          <li className="list-none w-full">
                            <Link to="/" className="w-full">
                              <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                                Shirt
                              </Button>
                            </Link>
                          </li>
                          <li className="list-none w-full">
                            <Link to="/" className="w-full">
                              <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                                T-Shirt
                              </Button>
                            </Link>
                          </li>
                          <li className="list-none w-full">
                            <Link to="/boys" className="w-full">
                              <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                                Jackets
                              </Button>
                            </Link>
                          </li>
                          <li className="list-none w-full">
                            <Link to="/" className="w-full">
                              <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                                Cargo Pants
                              </Button>
                            </Link>
                          </li>
                          <li className="list-none w-full">
                            <Link to="/" className="w-full">
                              <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                                Jeans
                              </Button>
                            </Link>
                          </li>
                          <li className="list-none w-full">
                            <Link to="/" className="w-full">
                              <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                                Shoes
                              </Button>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                          Women
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                          Boys
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                          Girls
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                          Kids
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className="list-none">
                <Link
                  to="/electronics"
                  className="link transition"
                >
                  <Button className="link transition !text-[16px] !font-[600] !text-[rgba(0,0,0,0.9)] hover:!text-[var(--bg-primary)] !py-4">
                    Electronics
                  </Button>
                </Link>
              </li>

              <li className="list-none relative">
                <Link to="/" className="link transition">
                  <Button className="link transition !text-[16px] !font-[600] !text-[rgba(0,0,0,0.9)] hover:!text-[var(--bg-primary)] !py-4">
                    Bags
                  </Button>
                </Link>
                <div className="submenu absolute top-[100%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 visibility-hidden transition-all">
                  <ul>
                    <li className="list-none w-full relative">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-between !rounded-none">
                          Men
                          <IoIosArrowForward />
                        </Button>
                      </Link>

                      <div className="submenu absolute top-[0%] left-[100%] min-w-[150px] bg-white shadow-md opacity-0 visibility-hidden transition-all">
                        <ul>
                          <li className="list-none w-full">
                            <Link to="/" className="w-full">
                              <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                                Men
                              </Button>
                            </Link>
                          </li>
                          <li className="list-none w-full">
                            <Link to="/" className="w-full">
                              <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                                Women
                              </Button>
                            </Link>
                          </li>
                          <li className="list-none w-full">
                            <Link to="/" className="w-full">
                              <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                                Boys
                              </Button>
                            </Link>
                          </li>
                          <li className="list-none w-full">
                            <Link to="/" className="w-full">
                              <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                                Girls
                              </Button>
                            </Link>
                          </li>
                          <li className="list-none w-full">
                            <Link to="/" className="w-full">
                              <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                                Kids
                              </Button>
                            </Link>
                          </li>
                          <li className="list-none w-full">
                            <Link to="/" className="w-full">
                              <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                                Kids
                              </Button>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                          Women
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                          Boys
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                          Girls
                        </Button>
                      </Link>
                    </li>
                    <li className="list-none w-full">
                      <Link to="/" className="w-full">
                        <Button className="!text-[rgba(0,0,0,0.9)] w-full !text-left !justify-start !rounded-none">
                          Kids
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="list-none">
                <Link
                  to="/footware"
                  className="link transition"
                >
                  <Button className="link transition !text-[16px] !font-[600] !text-[rgba(0,0,0,0.9)] hover:!text-[var(--bg-primary)] !py-4">
                    Footwear
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link
                  to="/groceries"
                  className="link transition"
                >
                  <Button className="link transition !text-[16px] !font-[600] !text-[rgba(0,0,0,0.9)] hover:!text-[var(--bg-primary)] !py-4">
                    Groceries
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link
                  to="/beauty"
                  className="link transition"
                >
                  <Button className="link transition !text-[16px] !font-[600] !text-[rgba(0,0,0,0.9)] hover:!text-[var(--bg-primary)] !py-4">
                    Beauty
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link
                  to="/wellness"
                  className="link transition"
                >
                  <Button className="link transition !text-[16px] !font-[600] !text-[rgba(0,0,0,0.9)] hover:!text-[var(--bg-primary)] !py-4">
                    Wellness
                  </Button>
                </Link>
              </li>
              <li className="list-none">
                <Link
                  to="/jewellery"
                  className="link transition"
                >
                  <Button className="link transition !text-[16px] !font-[600] !text-[rgba(0,0,0,0.9)] hover:!text-[var(--bg-primary)] !py-4">
                    Jewellery
                  </Button>
                </Link>
              </li>
            </ul>
          </div>

          <div className="col_3 w-[20%]">
            <p className="!text-[16px] !font-[600] flex items-center gap-3 mt-0 mb-0">
              <GoRocket className="text-[18px]" />
              Free International Delivery
            </p>
          </div>
        </div>
      </nav>

      {/* ----------  Category Panel Sidebar  ---------- */}
      <CategoryPanel
        openCategoryPanel={openCategoryPanel}
        isOpenPanel={isOpenCatPanel}
      />
    </>
  );
};

export default Navigation;
