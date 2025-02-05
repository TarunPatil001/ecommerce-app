import { useState } from "react";
import { Button } from "@mui/material";
import { FaRegSquareMinus, FaRegSquarePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Collapse } from "react-collapse";

const CategoryCollapse = ({ data = [] }) => {
  const [submenuOpen, setSubmenuOpen] = useState({});
  const [innerSubmenuOpen, setInnerSubmenuOpen] = useState({});

  const toggleSubmenu = (index) => {
    setSubmenuOpen((prev) => {
      const newState = {
        ...prev,
        [index]: !prev[index],
      };
      
      // Close all inner submenus when the main submenu is toggled
      if (!newState[index]) {
        // Reset inner submenu state for this category
        const newInnerState = { ...innerSubmenuOpen };
        Object.keys(newInnerState)
          .filter((key) => key.startsWith(`${index}-`))  // Match all inner submenus of this category
          .forEach((key) => delete newInnerState[key]);
        setInnerSubmenuOpen(newInnerState);
      }
      
      return newState;
    });
  };

  const toggleInnerSubmenu = (parentIndex, childIndex) => {
    const key = `${parentIndex}-${childIndex}`;
    setInnerSubmenuOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };


  return (
    <div className="scroll">
      <ul className="w-full">
        {data.length > 0 &&
          data.map((cat, index) => (
            <li key={index} className="list-none flex flex-col relative">
              <div className="flex items-center w-full">
                <Link to="/" className="w-full" onClick={(e) => e.preventDefault()}>
                  <Button className="w-full !pl-8 !rounded-none !text-[16px] !font-semibold !text-left !justify-start !p-3 !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]">
                    {cat.name}
                  </Button>
                </Link>
                {cat.children?.length > 0 && (
                  <span
                    className="absolute top-[10px] right-[32px] cursor-pointer"
                    onClick={() => toggleSubmenu(index)}
                    aria-label={`Toggle submenu for ${cat.name}`}
                  >
                    {submenuOpen[index] ? <FaRegSquareMinus /> : <FaRegSquarePlus />}
                  </span>
                )}
              </div>

              <Collapse isOpened={submenuOpen[index]}>
                <ul className="w-full">
                  {cat.children?.map((subcat, subIndex) => (
                    <li key={`${index}-${subIndex}`} className="list-none relative">
                      <div className="flex items-center w-full">
                        <Link to="/" className="w-full" onClick={(e) => e.preventDefault()}>
                          <Button
                            className={`w-full !pl-[48px] !rounded-none !text-[14px] !font-medium !text-left !justify-start !p-3 !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]`}

                          >
                            {subcat.name}
                          </Button>
                        </Link>
                        {subcat.children?.length > 0 && (
                          <span
                            className="absolute top-[10px] right-[32px] cursor-pointer"
                            onClick={() => toggleInnerSubmenu(index, subIndex)}
                            aria-label={`Toggle inner submenu for ${subcat.name}`}
                          >
                            {innerSubmenuOpen[`${index}-${subIndex}`] ? <FaRegSquareMinus /> : <FaRegSquarePlus />}
                          </span>
                        )}
                      </div>

                      <Collapse isOpened={innerSubmenuOpen[`${index}-${subIndex}`]}>
                        <ul className="w-full">
                          {subcat.children?.map((childSubCat, childIndex) => (
                            <li key={`${index}-${subIndex}-${childIndex}`} className="list-none">
                              <Link to="/" className="w-full" onClick={(e) => e.preventDefault()}>
                                <Button
                                  className="w-full !pl-[64px] !rounded-none !text-[14px] !font-normal !text-left !justify-start !p-3 !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
          
                                >
                                  {childSubCat.name}
                                </Button>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </Collapse>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CategoryCollapse;
