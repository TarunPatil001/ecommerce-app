import "./style.css"
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import { RxCross2 } from "react-icons/rx";
import CategoryCollapse from './../../CategoryCollapse/index';

const CategoryPanel = (props) => {
  const toggleDrawer = () => {
    props.openCategoryPanel(false);
  };

  const DrawerList = () => (
    <Box sx={{ width: 280 }} role="presentation" className="categoryPanel">
      <h3 className="p-3 pl-8 pr-7 text-[16px] font-[800] flex items-center justify-between">
        Shop By Categories{" "}
        <RxCross2 
          onClick={toggleDrawer}
          className="cursor-pointer text-[25px] hover:text-red-500"
        />
      </h3>
      <Divider />

      {
        props?.categoryData?.length !==0 && 
          <CategoryCollapse data={props?.categoryData} />
      }
    </Box>
  );

  return (
    <Drawer open={props.isOpenPanel} onClose={toggleDrawer}>
      <DrawerList />
    </Drawer>
  );
};

CategoryPanel.propTypes = {
  isOpenPanel: PropTypes.bool.isRequired,
  openCategoryPanel: PropTypes.func.isRequired,
};

export default CategoryPanel;
