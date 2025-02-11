import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { addBanner, deleteBanner, deleteMultipleBanners, getBanner, getBanners, removeBannerImageFromCloudinary, updateBanner, uploadBannerImages } from "../controllers/bannerV1.controller.js";


const bannerV1Router = Router();

bannerV1Router.post('/uploadBannerImages', auth, upload.array('images'), uploadBannerImages);
bannerV1Router.post('/add', auth, addBanner);
bannerV1Router.get('/', getBanners);
bannerV1Router.get('/:id', getBanner);
bannerV1Router.delete('/deleteImage', auth, removeBannerImageFromCloudinary);
bannerV1Router.delete('/:id', auth, deleteBanner);
bannerV1Router.post('/delete-multiple-banners', auth, deleteMultipleBanners);
bannerV1Router.put('/:id', auth, updateBanner);


export default bannerV1Router;