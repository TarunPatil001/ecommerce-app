import { useState } from 'react'

import { Button } from "@mui/material"
import { FaRegSquareMinus, FaRegSquarePlus } from "react-icons/fa6"
import { Link } from "react-router-dom"

const CategoryCollapse = () => {
    const [submenuOpen, setSubmenuOpen] = useState({});
  const [innerSubmenuOpen, setInnerSubmenuOpen] = useState({});



  const toggleSubmenu = (index) => {
    // Update the submenu state using the previous state (prev)
    setSubmenuOpen((prev) => ({
      // Spread the previous state to keep other submenus unchanged
      ...prev,
      
      // Toggle the specific submenu at the given 'index'
      // If it was open (true), it will become closed (false), and vice versa
      [index]: !prev[index],
    }));
  };
  

  const toggleInnerSubmenu = (index) => {
    setInnerSubmenuOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <div className="scroll">
        <ul className="w-full !pl-3">
          {/* Fashion Menu */}
          <li key="fashion" className="list-none flex items-center relative flex-col ">
            <Link to="/" className="w-full">
              <Button
                className="w-full !text-[16px] !font-[500] !text-left !justify-start !p-3 !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                disableRipple
              >
                Fashion
              </Button>
            </Link>

            {submenuOpen[0] ? (
              <FaRegSquareMinus
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => toggleSubmenu(0)}
              />
            ) : (
              <FaRegSquarePlus
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => toggleSubmenu(0)}
              />
            )}

            {submenuOpen[0] && (
              <ul className="submenu w-full pl-6 ">
                <li key="mens" className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button
                      className="w-full !text-[16px] !font-[500] !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                      disableRipple
                    >
                      Men&apos;s
                    </Button>
                  </Link>
                  {innerSubmenuOpen[0] ? (
                    <FaRegSquareMinus
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => toggleInnerSubmenu(0)}
                    />
                  ) : (
                    <FaRegSquarePlus
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => toggleInnerSubmenu(0)}
                    />
                  )}

                  {innerSubmenuOpen[0] && (
                    <ul className="innerSubmenu w-full pl-6">
                      <li key="mens-link-1" className="list-none relative">
                        <Link to="/" className="link w-full">
                          <Button
                            className="w-full !text-[16px] !font-[500] mr-2 !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                            disableRipple
                          >
                            Men&apos;s Shirt
                          </Button>
                        </Link>
                      </li>
                      <li key="mens-link-2" className="list-none relative">
                        <Link to="/" className="link w-full">
                          <Button
                            className="w-full !text-[16px] !font-[500] !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                            disableRipple
                          >
                            Men&apos;s T-Shirt
                          </Button>
                        </Link>
                      </li>
                      <li key="mens-link-3" className="list-none relative">
                        <Link to="/" className="link w-full">
                          <Button
                            className="w-full !text-[16px] !font-[500] !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                            disableRipple
                          >
                            Men&apos;s Jackets
                          </Button>
                        </Link>
                      </li>
                      <li key="mens-link-4" className="list-none relative">
                        <Link to="/" className="link w-full">
                          <Button
                            className="w-full !text-[16px] !font-[500] !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                            disableRipple
                          >
                            Men&apos;s Cargo Pants
                          </Button>
                        </Link>
                      </li>
                      <li key="mens-link-5" className="list-none relative">
                        <Link to="/" className="link w-full">
                          <Button
                            className="w-full !text-[16px] !font-[500] !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                            disableRipple
                          >
                            Men&apos;s Jeans
                          </Button>
                        </Link>
                      </li>
                      <li key="mens-link-6" className="list-none relative">
                        <Link to="/" className="link w-full">
                          <Button
                            className="w-full !text-[16px] !font-[500] !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                            disableRipple
                          >
                            Men&apos;s Shoes
                          </Button>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>

          {/* Outerwear Menu */}
          <li key="outerwear" className="list-none flex items-center relative flex-col">
            <Link to="/" className="w-full">
              <Button
                className="w-full !text-[16px] !font-[500] !text-left !justify-start !p-3 !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                disableRipple
              >
                Electronic&apos;s
              </Button>
            </Link>

            {submenuOpen[1] ? (
              <FaRegSquareMinus
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => toggleSubmenu(1)}
              />
            ) : (
              <FaRegSquarePlus
                className="absolute top-[10px] right-[15px] cursor-pointer"
                onClick={() => toggleSubmenu(1)}
              />
            )}

            {submenuOpen[1] && (
              <ul className="submenu w-full pl-6">
                <li key="Laptop" className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button
                      className="w-full !text-[16px] !font-[500] !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                      disableRipple
                    >
                      Laptop
                    </Button>
                  </Link>
                  {innerSubmenuOpen[1] ? (
                    <FaRegSquareMinus
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => toggleInnerSubmenu(1)}
                    />
                  ) : (
                    <FaRegSquarePlus
                      className="absolute top-[10px] right-[15px] cursor-pointer"
                      onClick={() => toggleInnerSubmenu(1)}
                    />
                  )}

                  {innerSubmenuOpen[1] && (
                    <ul className="innerSubmenu w-full pl-6">
                      <li key="Laptop-link-1" className="list-none relative">
                        <Link to="/" className="link w-full">
                          <Button
                            className="w-full !text-[16px] !font-[500] mr-2 !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                            disableRipple
                          >
                            Lenovo
                          </Button>
                        </Link>
                      </li>
                      <li key="Laptop-link-2" className="list-none relative">
                        <Link to="/" className="link w-full">
                          <Button
                            className="w-full !text-[16px] !font-[500] !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                            disableRipple
                          >
                            Dell
                          </Button>
                        </Link>
                      </li>
                      <li key="Laptop-link-3" className="list-none relative">
                        <Link to="/" className="link w-full">
                          <Button
                            className="w-full !text-[16px] !font-[500] !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                            disableRipple
                          >
                            Asus
                          </Button>
                        </Link>
                      </li>
                      <li key="Laptop-link-4" className="list-none relative">
                        <Link to="/" className="link w-full">
                          <Button
                            className="w-full !text-[16px] !font-[500] !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
                            disableRipple
                          >
                            MacBook
                          </Button>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </>
  )
}

export default CategoryCollapse
