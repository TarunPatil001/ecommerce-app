import { useState, useContext } from 'react'
import { MyContext } from '../../App'
import DashboardBoxes from '../../Components/DashboardBoxes'
import { Button, Checkbox, FormControl, InputLabel, MenuItem, Pagination } from '@mui/material'
import { Tooltip } from '@mui/material'
import { FiPlus } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Badge from '../../Components/Badge';
import { Link, useNavigate } from 'react-router-dom';
import ProgressBar from '../../Components/ProgressBar';
import { MdOutlineEdit } from 'react-icons/md';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDeleteBin6Line, RiDownloadCloud2Line } from "react-icons/ri";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import { GoDotFill, GoPlus } from "react-icons/go";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip as RechartTooltip, XAxis, YAxis } from 'recharts';
import { useEffect } from 'react'

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const columns = [
  { id: 'product', label: 'PRODUCT', minWidth: 150, align: 'left' },
  { id: 'category', label: 'CATEGORY', minWidth: 150, align: 'left' },
  {
    id: 'subCategory',
    label: 'SUB CATEGORY',
    minWidth: 150,
    align: 'left'
  },
  {
    id: 'price',
    label: 'PRICE',
    minWidth: 160,
    align: 'center',
    format: (value) => `$${value.toFixed(2)}`,
  },
  { id: 'sales', label: 'SALES', minWidth: 130, align: 'center' },
  { id: 'action', label: 'ACTION', minWidth: 130, align: 'center' },
];


const Dashboard = () => {

  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [isOpenOrder, setIsOpenOrder] = useState(null);
  const totalStock = 250;
  const currentSales = 241;

  // Calculate percentage
  const salePercentage = (currentSales / totalStock) * 100;
  const remainStock = totalStock - currentSales;


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token !== undefined && token !== null && token !== '') {
        context?.setIsLogin(true);
    } else {
        navigate("/sign-in");
    }
}, [context, navigate]);


  const isShowOrderedProduct = (index) => {
    if (isOpenOrder === index) {
      setIsOpenOrder(null);
    } else {
      setIsOpenOrder(index);
    }
  }


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [categoryFilterValue, setCategoryFilterValue] = useState("");

  const handleChangeCategoryFilterValue = (event) => {
    setCategoryFilterValue(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [chartData1, setChartData1] = useState([
    {
      name: "JANUARY",
      Total_Users: 4000,
      Total_Sales: 2400,
      amt: 2400,
    },
    {
      name: "FEBRUARY",
      Total_Users: 3000,
      Total_Sales: 1398,
      amt: 2210,
    },
    {
      name: "MARCH",
      Total_Users: 2000,
      Total_Sales: 9800,
      amt: 2290,
    },
    {
      name: "APRIL",
      Total_Users: 2780,
      Total_Sales: 3908,
      amt: 2000,
    },
    {
      name: "MAY",
      Total_Users: 1890,
      Total_Sales: 4800,
      amt: 2181,
    },
    {
      name: "JUNE",
      Total_Users: 2390,
      Total_Sales: 3800,
      amt: 2500,
    },
    {
      name: "JULY",
      Total_Users: 3490,
      Total_Sales: 4300,
      amt: 2100,
    },
    {
      name: "AUGUST",
      Total_Users: 5490,
      Total_Sales: 4900,
      amt: 2100,
    },
    {
      name: "SEPTEMBER",
      Total_Users: 8490,
      Total_Sales: 4700,
      amt: 2100,
    },
    {
      name: "OCTOBER",
      Total_Users: 7490,
      Total_Sales: 6300,
      amt: 2100,
    },
    {
      name: "NOVEMBER",
      Total_Users: 9490,
      Total_Sales: 2300,
      amt: 2100,
    },
    {
      name: "DECEMBER",
      Total_Users: 5490,
      Total_Sales: 7300,
      amt: 2100,
    },
  ]
  );


  return (
    <>
      <div className={'w-full px-5 py-2 bg-white hover:bg-[var(--bg-hover-primary)] border border-[rgba(0,0,0,0.1)] flex items-center justify-between gap-8 mb-5 rounded-md'}>
        <div className="info">
          <h1 className='text-[30px] font-bold leading-9 mb-2'>Good Morning, <br /> Cameron &#128075;</h1>
          <p className='text-[16px] mb-10'>Here’s What happening on your store today. See the statistics at once.</p>
          <Button className='flex items-center gap-1 !capitalize !text-[14px] !font-medium !text-white !bg-[var(--text-active)] !p-2 !px-4' onClick={()=>context.setIsOpenFullScreenPanel({open:true,model:'Product Details'})}><FiPlus className='text-[18px]' />Add Product</Button>
        </div>
        <img src="/shop-illustration.webp" alt="image" className='w-[250px] object-cover' />
      </div>
      <DashboardBoxes />

      <div className="card my-4 bg-white border rounded-md px-1">
        <div className='flex items-center justify-between p-5'>
          <h2 className='text-[20px] font-bold'>Products <span className="font-normal text-[12px]">Tailwind(Css)</span></h2>
        </div>

        <div className='flex items-center w-full pl-5 justify-between pr-5'>
          <div className='col w-[20%]'>
            <h4 className='font-bold text-[14px] mb-2'>Category By</h4>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Sort by category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={categoryFilterValue}
                label="Sort by category"
                onChange={handleChangeCategoryFilterValue}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value={10}>Men</MenuItem>
                <MenuItem value={20}>Women</MenuItem>
                <MenuItem value={30}>Kids</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className='col w-[50%] flex items-center justify-end gap-3'>
            <Button className='!bg-green-600 !px-3 !text-white flex items-center gap-1 !capitalize'><RiDownloadCloud2Line className='text-[18px]' />Export</Button>
            <Button className='!bg-[var(--bg-primary)] !px-3 !text-white flex items-center gap-1 !capitalize' onClick={()=>context.setIsOpenFullScreenPanel({open:true,model:'Product Details'})}><GoPlus className='text-[20px]' />Add Product</Button>
          </div>
        </div>

        <div className="customScroll relative overflow-x-auto rounded-md mt-5 pb-5">
          <table className="w-full text-[14px] text-left rtl:text-right text-[var(--text-light)] rounded-md">
            <thead className="text-[14px] text-gray-700 uppercase bg-gray-100 whitespace-nowrap">
              <tr>
                <th scope="col" className="px-6 pr-2 py-3 text-left"><div className='w-[60px]'><Checkbox {...label} /></div></th>
                <th scope="col" className="px-0 py-3 text-left">Products</th>
                <th scope="col" className="px-6 py-3 text-left">Category</th>
                <th scope="col" className="px-6 py-3 text-left">Sub Category</th>
                <th scope="col" className="px-6 py-3 text-left">Price</th>
                <th scope="col" className="px-6 py-3 text-left">Sales</th>
                <th scope="col" className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>

              <tr className="odd:bg-gray-200 even:bg-gray-50 border-b dark:border-gray-400">
                <td className="px-6 pr-2 py-2 text-left">
                  <div className="w-[60px]">
                    <Checkbox {...label} />
                  </div>
                </td>
                <td className="px-0 py-2 text-left">
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  Women Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  <div className="flex flex-col items-center text-left">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal text">(17% OFF)</span>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  <p className='text-[14px] flex flex-col gap-1'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </td>

                <td className="px-6 py-2 text-left">
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </td>

              </tr>

              <tr className="odd:bg-gray-200 even:bg-gray-50 border-b dark:border-gray-400">
                <td className="px-6 pr-2 py-2 text-left">
                  <div className="w-[60px]">
                    <Checkbox {...label} />
                  </div>
                </td>
                <td className="px-0 py-2 text-left">
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  Women Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  <div className="flex flex-col items-center text-left">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal text">(17% OFF)</span>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  <p className='text-[14px] flex flex-col gap-1'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </td>

                <td className="px-6 py-2 text-left">
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </td>

              </tr>

              <tr className="odd:bg-gray-200 even:bg-gray-50 border-b dark:border-gray-400">
                <td className="px-6 pr-2 py-2 text-left">
                  <div className="w-[60px]">
                    <Checkbox {...label} />
                  </div>
                </td>
                <td className="px-0 py-2 text-left">
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  Women Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  <div className="flex flex-col items-center text-left">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal text">(17% OFF)</span>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  <p className='text-[14px] flex flex-col gap-1'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </td>

                <td className="px-6 py-2 text-left">
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </td>

              </tr>

              <tr className="odd:bg-gray-200 even:bg-gray-50 border-b dark:border-gray-400">
                <td className="px-6 pr-2 py-2 text-left">
                  <div className="w-[60px]">
                    <Checkbox {...label} />
                  </div>
                </td>
                <td className="px-0 py-2 text-left">
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  Women Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  <div className="flex flex-col items-center text-left">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal text">(17% OFF)</span>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  <p className='text-[14px] flex flex-col gap-1'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </td>

                <td className="px-6 py-2 text-left">
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </td>

              </tr>

              <tr className="odd:bg-gray-200 even:bg-gray-50 border-b dark:border-gray-400">
                <td className="px-6 pr-2 py-2 text-left">
                  <div className="w-[60px]">
                    <Checkbox {...label} />
                  </div>
                </td>
                <td className="px-0 py-2 text-left">
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  Women Clothing
                </td>

                <td className="px-6 py-2 text-left">
                  <div className="flex flex-col items-center text-left">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal text">(17% OFF)</span>
                  </div>
                </td>

                <td className="px-6 py-2 text-left">
                  <p className='text-[14px] flex flex-col gap-1'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </td>

                <td className="px-6 py-2 text-left">
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </td>

              </tr>

            </tbody>
          </table>
        </div>
        <div className='flex items-center justify-end px-5 pb-5'>
          <Pagination count={10} />
        </div>
      </div >

      <div className="card my-4 bg-white border rounded-md px-1">
        <div className='flex items-center justify-between p-5'>
          <h2 className='text-[20px] font-bold'>Products <span className="font-normal text-[12px]">Material UI</span></h2>
        </div>

        <div className='flex items-center w-full pl-5 justify-between pr-5'>
          <div className='col w-[20%]'>
            <h4 className='font-bold text-[14px] mb-2'>Category By</h4>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Sort by category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={categoryFilterValue}
                label="Sort by category"
                onChange={handleChangeCategoryFilterValue}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value={10}>T-Shirt</MenuItem>
                <MenuItem value={20}>Jeans</MenuItem>
                <MenuItem value={30}>Jurkins</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className='col w-[50%] flex items-center justify-end gap-3'>
            <Button className='!bg-green-600 !px-3 !text-white flex items-center gap-1 !capitalize'><RiDownloadCloud2Line className='text-[18px]' />Export</Button>
            <Button className='!bg-[var(--bg-primary)] !px-3 !text-white flex items-center gap-1 !capitalize' onClick={()=>context.setIsOpenFullScreenPanel({open:true,model:'Product Details'})}><GoPlus className='text-[20px]' />Add Product</Button>
          </div>
        </div>

        <TableContainer className='max-h-[440px] customScroll mt-5'>
          <Table stickyHeader aria-label="sticky table">

            <TableHead>
              <TableRow>
                <TableCell className="px-6 py-2 text-left">
                  <Checkbox {...label} size='small' />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>

              <TableRow>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Women Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex flex-col items-center">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Women Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex flex-col items-center">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Women Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex flex-col items-center">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Women Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex flex-col items-center">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Women Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex flex-col items-center">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Women Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex flex-col items-center">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Women Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex flex-col items-center">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Women Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex flex-col items-center">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Women Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex flex-col items-center">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Women Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex flex-col items-center">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Women Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex flex-col items-center">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Women Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex flex-col items-center">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <Checkbox {...label} size='small' />
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex items-start gap-4 w-[350px]">
                    <div className='img w-[50px] h-[50px] overflow-hidden rounded-md shadow-md group'>
                      <Link to="/product/458457">
                        <img src="https://ecme-react.themenate.net/img/products/product-1.jpg" alt="product_img" className='w-full h-full object-cover rounded-md transition-all group-hover:scale-105' />
                      </Link>
                    </div>
                    <div className='info w-[75%] flex flex-col items-start gap-1'>
                      <Link to="/product/458457">
                        <h3 className='text-[12px] font-bold leading-4 hover:text-[var(--text-active)]'>Ethnic Motifs Woven Design V-Neck Pure Cotton Panelled Kurti</h3>
                      </Link>
                      <span className='text-[12px]'>Libas</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  Women Clothing
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className="flex flex-col items-center">
                    <span className="price text-[var(--text-light)] text-[14px] font-bold flex items-center">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(499)}</span>
                    </span>
                    <span className="oldPrice line-through text-[var(--text-light)] text-[12px] font-normal flex items-center ">
                      ₹<span>{new Intl.NumberFormat('en-IN').format(599)}</span>
                    </span>
                    <span className="uppercase text-[12px] text-[var(--off-color)] font-normal">(17% OFF)</span>
                  </div>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <p className='text-[14px] flex flex-col gap-1 justify-center text-center'><span><span className='font-bold'>{currentSales}</span> sold</span><ProgressBar value={salePercentage} type="success" /><span><span className='text-[14px] font-bold'>{remainStock}</span> remain</span></p>
                </TableCell>
                <TableCell style={{ minWidth: columns.minWidth }}>
                  <div className='flex items-center gap-2'>
                    <Tooltip title="Edit Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><MdOutlineEdit className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="View Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><IoEyeOutline className='text-[35px]' /></Button>
                    </Tooltip>
                    <Tooltip title="Delete Product" arrow placement="top">
                      <Button className='!h-[35px] !w-[35px] !min-w-[35px] !bg-[#f1f1f1] !text-[var(--text-light)] shadow'><RiDeleteBin6Line className='text-[35px]' /></Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={10}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </div>

      <div className="card my-4 bg-white border rounded-md px-1">
        <div className='flex items-center justify-between p-5'>
          <h2 className='text-[20px] font-bold'>Recent Orders</h2>
        </div>
        <div className="customScroll relative overflow-x-auto rounded-md pb-5">
          <table className="w-full text-[14px] text-left rtl:text-right text-[var(--text-light)] rounded-md">
            <thead className="text-[14px] text-gray-700 uppercase bg-gray-100 whitespace-nowrap">
              <tr>
                <th scope="col" className="px-6 py-3 text-left"></th>
                <th scope="col" className="px-6 py-3 text-left">Order Id</th>
                <th scope="col" className="px-6 py-3 text-left">Payment Id</th>
                <th scope="col" className="px-6 py-3 text-left">Name</th>
                <th scope="col" className="px-6 py-3 text-left">Mobile No.</th>
                <th scope="col" className="px-6 py-3 text-left">Address</th>
                <th scope="col" className="px-6 py-3 text-left">Pin Code</th>
                <th scope="col" className="px-6 py-3 text-left">Email</th>
                <th scope="col" className="px-6 py-3 text-left">Total Amount</th>
                <th scope="col" className="px-6 py-3 text-left">User Id</th>
                <th scope="col" className="px-6 py-3 text-left">Order Status</th>
                <th scope="col" className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <Button
                    className="!text-black !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1] flex items-center justify-center"
                    onClick={() => isShowOrderedProduct(0)}
                  >
                    {isOpenOrder === (0) ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </Button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <span className="text-[var(--bg-primary)] font-semibold">
                    685958547548455555555555
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <span className="text-[var(--bg-primary)] font-semibold">
                    685958547548455555555555
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  Lorem ipsum dolor sit amet Lorem, ipsum.
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  999999999999
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo, maiores.
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  elonmusk12345@gmail.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">8484</td>
                <td className="px-6 py-4 whitespace-nowrap text-left ">
                  Lorem252556666ipsum
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <Badge status="rejected" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left ">
                  2025-01-01
                </td>
              </tr>
              {
                isOpenOrder === 0 && (
                  <tr>
                    <td colSpan="6" className="p-0">
                      <div className="customScroll relative overflow-x-auto my-2 px-20">
                        <table className="w-full text-[14px] text-left rtl:text-right text-[var(--text-light)]">
                          <thead className="text-[14px] text-gray-700 uppercase bg-gray-100 whitespace-nowrap">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left">Product Id</th>
                              <th scope="col" className="px-6 py-3 text-left">Product Title</th>
                              <th scope="col" className="px-6 py-3 text-left">Image</th>
                              <th scope="col" className="px-6 py-3 text-left">Quantity</th>
                              <th scope="col" className="px-6 py-3 text-left">Price</th>
                              <th scope="col" className="px-6 py-3 text-left">SubTotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )
              }
              <tr className="bg-white border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <Button
                    className="!text-black !w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1] flex items-center justify-center"
                    onClick={() => isShowOrderedProduct(1)}
                  >
                    {isOpenOrder === (1) ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </Button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <span className="text-[var(--bg-primary)] font-semibold">
                    685958547548455555555555
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <span className="text-[var(--bg-primary)] font-semibold">
                    685958547548455555555555
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  Lorem ipsum dolor sit amet Lorem, ipsum.
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  999999999999
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo, maiores.
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  elonmusk12345@gmail.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">8484</td>
                <td className="px-6 py-4 whitespace-nowrap text-left ">
                  Lorem252556666ipsum
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <Badge status="rejected" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left ">
                  2025-01-01
                </td>
              </tr>
              {
                isOpenOrder === 1 && (
                  <tr>
                    <td colSpan="6" className="p-0">
                      <div className="customScroll relative overflow-x-auto my-2 px-20">
                        <table className="w-full text-[14px] text-left rtl:text-right text-[var(--text-light)]">
                          <thead className="text-[14px] text-gray-700 uppercase bg-gray-100 whitespace-nowrap">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left">Product Id</th>
                              <th scope="col" className="px-6 py-3 text-left">Product Title</th>
                              <th scope="col" className="px-6 py-3 text-left">Image</th>
                              <th scope="col" className="px-6 py-3 text-left">Quantity</th>
                              <th scope="col" className="px-6 py-3 text-left">Price</th>
                              <th scope="col" className="px-6 py-3 text-left">SubTotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                            <tr className="bg-white border-b hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                685958547548455555555555
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                Lorem ipsum dolor sit amet Lorem, ipsum.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">
                                <div className="!w-[50px] !h-[50px]">
                                  <img
                                    src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                                    alt=""
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">5</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">2580</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">555502</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>

      <div className="card my-4 bg-white border rounded-md px-1">
        <div className='flex items-center justify-between px-5 pb-2 pt-5'>
          <h2 className='text-[20px] font-bold'>Total Sales & Total Users</h2>
        </div>

        <div className='flex items-center justify-start px-5 pt-2 pb-5 gap-5'>
          <span className='flex items-center'><span><GoDotFill className='text-violet-500' /></span>Total Sales</span>
          <span className='flex items-center'><span><GoDotFill className='text-green-500' /></span>Total Users</span>
        </div>
        <div style={{ width: '100%', height: '500px' }}>
          <ResponsiveContainer>
            <LineChart
              width={1000}
              height={500}
              data={chartData1}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="none" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <RechartTooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Total_Sales" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Total_Users" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


    </>
  )
}

export default Dashboard
