import "./style.css"
import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import { Button } from "@mui/material";
import { FaRegSquareMinus, FaRegSquarePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { RxCross2 } from "react-icons/rx";

const CategoryPanel = ({ isOpenPanel, openCategoryPanel }) => {
  const [submenuOpen, setSubmenuOpen] = useState({});
  const [innerSubmenuOpen, setInnerSubmenuOpen] = useState({});

  const toggleDrawer = () => {
    openCategoryPanel(false);
  };

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

  const DrawerList = () => (
    <Box sx={{ width: 315 }} role="presentation" className="categoryPanel">
      <h3 className="p-3 ml-3 text-[16px] font-[600] flex items-center justify-between">
        Shop By Categories{" "}
        <RxCross2 
          onClick={toggleDrawer}
          className="cursor-pointer text-[25px] hover:text-red-600"
        />
      </h3>
      <Divider />

      <div className="scroll">
        <ul className="w-full !pl-3">
          {/* Fashion Menu */}
          <li key="fashion" className="list-none flex items-center relative flex-col">
            <Link to="/" className="w-full">
              <Button
                className="w-full !text-left !justify-start !p-3 !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-primary"
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
              <ul className="submenu w-full pl-6">
                <li key="apparel" className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button
                      className="w-full !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-primary"
                      disableRipple
                    >
                      Apparel
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
                      <li key="apparel-link-1" className="list-none relative">
                        <Link to="/table" className="link w-full">
                          <Button
                            className="w-full mr-2 !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-primary"
                            disableRipple
                          >
                            Smart Tablet
                          </Button>
                        </Link>
                      </li>
                      <li key="apparel-link-2" className="list-none relative">
                        <Link to="/t-shirt" className="link w-full">
                          <Button
                            className="w-full !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-primary"
                            disableRipple
                          >
                            Crepe T-Shirt
                          </Button>
                        </Link>
                      </li>
                      <li key="apparel-link-3" className="list-none relative">
                        <Link to="/watch" className="link w-full">
                          <Button
                            className="w-full !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-primary"
                            disableRipple
                          >
                            Leather Watch
                          </Button>
                        </Link>
                      </li>
                      <li key="apparel-link-4" className="list-none relative">
                        <Link to="/diamond" className="link w-full">
                          <Button
                            className="w-full !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-primary"
                            disableRipple
                          >
                            Rolling Diamond
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
                className="w-full !text-left !justify-start !p-3 !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-primary"
                disableRipple
              >
                Outerwear
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
                <li key="apparel" className="list-none relative">
                  <Link to="/" className="w-full">
                    <Button
                      className="w-full !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-primary"
                      disableRipple
                    >
                      Apparel
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
                      <li key="apparel-link-1" className="list-none relative">
                        <Link to="/table" className="link w-full">
                          <Button
                            className="w-full mr-2 !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-primary"
                            disableRipple
                          >
                            Smart Tablet
                          </Button>
                        </Link>
                      </li>
                      <li key="apparel-link-2" className="list-none relative">
                        <Link to="/t-shirt" className="link w-full">
                          <Button
                            className="w-full !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-primary"
                            disableRipple
                          >
                            Crepe T-Shirt
                          </Button>
                        </Link>
                      </li>
                      <li key="apparel-link-3" className="list-none relative">
                        <Link to="/watch" className="link w-full">
                          <Button
                            className="w-full !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-primary"
                            disableRipple
                          >
                            Leather Watch
                          </Button>
                        </Link>
                      </li>
                      <li key="apparel-link-4" className="list-none relative">
                        <Link to="/diamond" className="link w-full">
                          <Button
                            className="w-full !text-left !justify-start !h-10 !text-[rgba(0,0,0,0.8)] hover:!text-primary"
                            disableRipple
                          >
                            Rolling Diamond
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
    </Box>
  );

  return (
    <Drawer open={isOpenPanel} onClose={toggleDrawer}>
      <DrawerList />
    </Drawer>
  );
};

CategoryPanel.propTypes = {
  isOpenPanel: PropTypes.bool.isRequired,
  openCategoryPanel: PropTypes.func.isRequired,
};

export default CategoryPanel;
