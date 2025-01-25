import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addAddressController, getAddressController } from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.post("/add-address", auth, addAddressController);
addressRouter.get("/get-address", auth, getAddressController);



export default addressRouter;
