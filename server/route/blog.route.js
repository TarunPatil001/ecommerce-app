import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { addBlog, deleteBlog, deleteMultipleBlog, getBlog, getBlogs, removeBlogImageFromCloudinary, updateBlog, uploadBlogImages } from "../controllers/blog.controller.js";

const blogRouter = Router();

blogRouter.post('/uploadBlogImages', auth, upload.array('images'), uploadBlogImages);
blogRouter.post('/add', auth, addBlog);
blogRouter.get('/', getBlogs);
blogRouter.get('/:id', getBlog);
blogRouter.delete('/deleteImage', auth, removeBlogImageFromCloudinary);
blogRouter.delete('/:id', auth, deleteBlog);
blogRouter.post('/delete-multiple-blogs', auth, deleteMultipleBlog);
blogRouter.put('/:id', auth, updateBlog);


export default blogRouter;