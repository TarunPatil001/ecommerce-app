import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addAddressController } from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.post("/add-address", auth, addAddressController);



export default addressRouter;
