import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { addBlog, deleteBlog, deleteMultipleBlog, getBlog, getBlogs, updateBlog } from "../controllers/blog.controller.js";

const blogRouter = Router();

blogRouter.post("/add", auth, upload.fields([{ name: "images" }]), addBlog);
blogRouter.get('/', getBlogs);
blogRouter.get('/:id', getBlog);
blogRouter.delete('/:id', auth, deleteBlog);
blogRouter.post('/delete-multiple-blogs', auth, deleteMultipleBlog);
blogRouter.put("/:id", auth, upload.fields([{ name: "newBlogImages" }]), updateBlog);
// blogRouter.put('/:id', auth, updateBlog);


export default blogRouter;