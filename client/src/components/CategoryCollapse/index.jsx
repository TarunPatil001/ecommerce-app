// import { useContext, useEffect, useState } from "react";
// import { Button } from "@mui/material";
// import { FaRegSquareMinus, FaRegSquarePlus } from "react-icons/fa6";
// import { Link, useNavigate } from "react-router-dom";
// import { Collapse } from "react-collapse";
// import PropTypes from "prop-types";
// import { MyContext } from "../../App";

// // const CategoryCollapse = ({ data = [] }) => {

// //   const context = useContext(MyContext);
// //   const [submenuOpen, setSubmenuOpen] = useState({});
// //   const [innerSubmenuOpen, setInnerSubmenuOpen] = useState({});

// //   const toggleSubmenu = (index) => {
// //     setSubmenuOpen((prev) => {
// //       const newState = {
// //         ...prev,
// //         [index]: !prev[index],
// //       };
      
// //       // Close all inner submenus when the main submenu is toggled
// //       if (!newState[index]) {
// //         // Reset inner submenu state for this category
// //         const newInnerState = { ...innerSubmenuOpen };
// //         Object.keys(newInnerState)
// //           .filter((key) => key.startsWith(`${index}-`))  // Match all inner submenus of this category
// //           .forEach((key) => delete newInnerState[key]);
// //         setInnerSubmenuOpen(newInnerState);
// //       }
      
// //       return newState;
// //     });
// //   };

// //   const toggleInnerSubmenu = (parentIndex, childIndex) => {
// //     const key = `${parentIndex}-${childIndex}`;
// //     setInnerSubmenuOpen((prev) => ({
// //       ...prev,
// //       [key]: !prev[key],
// //     }));
// //   };


// //   const navigate = useNavigate();

// //   const handleCategoryClick = (categoryId) => {
// //     navigate(`/products?categoryId=${categoryId}`);
// //   };

// //   const handleSubCategoryClick = (subCategoryId) => {
// //     navigate(`/products?subCategoryId=${subCategoryId}`);
// //   };

// //   const handleThirdSubCategoryClick = (thirdSubCategoryId) => {
// //     navigate(`/products?thirdSubCategoryId=${thirdSubCategoryId}`);
// //   };



// //   return (
 

// //     <div className="scroll">
// //       <ul className="w-full">
// //         {data.length > 0 &&
// //           data.map((cat, index) => (
// //             <li key={index} className="list-none flex flex-col relative">
// //               <div className="flex items-center w-full">
// //                 <Button
// //                   onClick={() => handleCategoryClick(cat._id)}
// //                   className="w-full !pl-8 !rounded-none !text-[16px] !font-semibold !text-left !justify-start !p-3 !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
// //                 >
// //                   {cat.name}
// //                 </Button>

// //                 {cat.children?.length > 0 && (
// //                   <span
// //                     className="absolute top-[10px] right-[32px] cursor-pointer"
// //                     onClick={() => toggleSubmenu(index)}
// //                     aria-label={`Toggle submenu for ${cat.name}`}
// //                   >
// //                     {submenuOpen[index] ? <FaRegSquareMinus /> : <FaRegSquarePlus />}
// //                   </span>
// //                 )}
// //               </div>

// //               <Collapse isOpened={submenuOpen[index]}>
// //                 <ul className="w-full">
// //                   {cat.children?.map((subcat, subIndex) => (
// //                     <li key={`${index}-${subIndex}`} className="list-none relative">
// //                       <div className="flex items-center w-full">
// //                         <Button
// //                           onClick={() => handleSubCategoryClick(subcat._id)}
// //                           className="w-full !pl-[48px] !rounded-none !text-[14px] !font-medium !text-left !justify-start !p-3 !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
// //                         >
// //                           {subcat.name}
// //                         </Button>

// //                         {subcat.children?.length > 0 && (
// //                           <span
// //                             className="absolute top-[10px] right-[32px] cursor-pointer"
// //                             onClick={() => toggleInnerSubmenu(index, subIndex)}
// //                             aria-label={`Toggle inner submenu for ${subcat.name}`}
// //                           >
// //                             {innerSubmenuOpen[`${index}-${subIndex}`] ? <FaRegSquareMinus /> : <FaRegSquarePlus />}
// //                           </span>
// //                         )}
// //                       </div>

// //                       <Collapse isOpened={innerSubmenuOpen[`${index}-${subIndex}`]}>
// //                         <ul className="w-full">
// //                           {subcat.children?.map((childSubCat, childIndex) => (
// //                             <li key={`${index}-${subIndex}-${childIndex}`} className="list-none">
// //                               <Button
// //                                 onClick={() => handleThirdSubCategoryClick(childSubCat._id)}
// //                                 className="w-full !pl-[64px] !rounded-none !text-[14px] !font-normal !text-left !justify-start !p-3 !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]"
// //                               >
// //                                 {childSubCat.name}
// //                               </Button>
// //                             </li>
// //                           ))}
// //                         </ul>
// //                       </Collapse>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </Collapse>
// //             </li>
// //           ))}
// //       </ul>
// //     </div>
// //   );
// // };

// const CategoryCollapse = ({ data = [] }) => {
//   const [openMenus, setOpenMenus] = useState({});
//   const navigate = useNavigate();

//   const toggleMenu = (path) => {
//     setOpenMenus(prev => ({
//       ...prev,
//       [path]: !prev[path]
//     }));
//   };

//   const handleCategoryClick = (categoryId, level) => {
//     const queryParam = level === 0 ? 'categoryId' : 
//                       level === 1 ? 'subCategoryId' : 'thirdSubCategoryId';
//     navigate(`/products?${queryParam}=${categoryId}`);
//   };

//   const renderCategories = (categories, level = 0, parentPath = '') => {
//     return (
//       <ul className="w-full">
//         {categories.map((cat, index) => {
//           const currentPath = parentPath ? `${parentPath}-${index}` : `${index}`;
//           const hasChildren = cat.children?.length > 0;
          
//           return (
//             <li key={cat._id} className="list-none flex flex-col relative">
//               <div className="flex items-center w-full">
//                 <Button
//                   onClick={() => handleCategoryClick(cat._id, level)}
//                   className={`w-full !rounded-none !text-[${16 - level * 2}px] ${
//                     level === 0 ? '!font-semibold' : level === 1 ? '!font-medium' : '!font-normal'
//                   } !text-left !justify-start !p-3 !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]`}
//                   style={{ paddingLeft: `${32 + level * 16}px` }}
//                 >
//                   {cat.name}
//                 </Button>

//                 {hasChildren && (
//                   <span
//                     className="absolute top-[10px] right-[32px] cursor-pointer"
//                     onClick={() => toggleMenu(currentPath)}
//                     aria-expanded={openMenus[currentPath] || false}
//                     aria-label={`Toggle ${cat.name} submenu`}
//                   >
//                     {openMenus[currentPath] ? <FaRegSquareMinus /> : <FaRegSquarePlus />}
//                   </span>
//                 )}
//               </div>

//               {hasChildren && (
//                 <Collapse isOpened={openMenus[currentPath]}>
//                   {renderCategories(cat.children, level + 1, currentPath)}
//                 </Collapse>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     );
//   };

//   return <div className="scroll">{renderCategories(data)}</div>;
// };

// CategoryCollapse.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       _id: PropTypes.string.isRequired,
//       name: PropTypes.string.isRequired,
//       children: PropTypes.array,
//     })
//   ).isRequired,
// };

// export default CategoryCollapse;


// // CategoryCollapse.propTypes = {
// //   data: PropTypes.arrayOf(
// //     PropTypes.shape({
// //       name: PropTypes.string.isRequired,
// //       children: PropTypes.arrayOf(
// //         PropTypes.shape({
// //           name: PropTypes.string.isRequired,
// //           children: PropTypes.arrayOf(
// //             PropTypes.shape({
// //               name: PropTypes.string.isRequired,
// //             })
// //           ),
// //         })
// //       ),
// //     })
// //   ).isRequired,
// // };

// // export default CategoryCollapse;


import { useState } from "react";
import { Button } from "@mui/material";
import { FaRegSquareMinus, FaRegSquarePlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Collapse } from "react-collapse";
import PropTypes from "prop-types";

const CategoryCollapse = ({ data = [] }) => {
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();

  const toggleMenu = (id) => {
    setOpenMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCategoryClick = (id, level) => {
    const queryParam = level === 0 ? 'categoryId' : 
                      level === 1 ? 'subCategoryId' : 'thirdSubCategoryId';
    navigate(`/products?${queryParam}=${id}`);
  };

  const renderCategories = (categories, level = 0) => {
    return (
      <ul className="w-full">
        {categories.map((category) => {
          const hasChildren = category.children?.length > 0;
          
          return (
            <li key={category._id} className="list-none flex flex-col relative">
              <div className="flex items-center w-full">
                <Button
                  onClick={() => handleCategoryClick(category._id, level)}
                  className={`w-full !rounded-none !text-[${16 - level * 2}px] ${
                    level === 0 ? '!font-semibold' : level === 1 ? '!font-medium' : '!font-normal'
                  } !text-left !justify-start !p-3 !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-[var(--bg-primary)]`}
                  style={{ paddingLeft: `${32 + level * 16}px` }}
                >
                  {category.name}
                </Button>

                {hasChildren && (
                  <span
                    className="absolute top-[10px] right-[32px] cursor-pointer"
                    onClick={() => toggleMenu(category._id)}
                    aria-expanded={openMenus[category._id] || false}
                    aria-label={`Toggle ${category.name} submenu`}
                  >
                    {openMenus[category._id] ? <FaRegSquareMinus /> : <FaRegSquarePlus />}
                  </span>
                )}
              </div>

              {hasChildren && (
                <Collapse isOpened={openMenus[category._id]}>
                  {renderCategories(category.children, level + 1)}
                </Collapse>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return <div className="scroll">{renderCategories(data)}</div>;
};

CategoryCollapse.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      children: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          children: PropTypes.arrayOf(
            PropTypes.shape({
              _id: PropTypes.string.isRequired,
              name: PropTypes.string.isRequired,
            })
          ),
        })
      ),
    })
  ).isRequired,
};

export default CategoryCollapse;