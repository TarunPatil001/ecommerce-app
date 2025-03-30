import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { addBanner, deleteBanner, deleteMultipleBanners, getBanner, getBanners, updateBanner } from "../controllers/bannerV1.controller.js";


const bannerV1Router = Router();

bannerV1Router.post("/add", auth, upload.fields([{ name: "images" }]), addBanner);
bannerV1Router.get('/', getBanners);
bannerV1Router.get('/:id', getBanner);
bannerV1Router.delete('/:id', auth, deleteBanner);
bannerV1Router.post('/delete-multiple-banners', auth, deleteMultipleBanners);
bannerV1Router.put("/:id", auth, upload.fields([{ name: "newBannerImages" }]), updateBanner);


export default bannerV1Router;