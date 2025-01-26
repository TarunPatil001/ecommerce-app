import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addAddressController, deleteAddressController, getAddressController, getSingleAddressController, selectAddressController, updateAddressController } from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.post("/add-address", auth, addAddressController);
addressRouter.get("/get-address", auth, getAddressController);
addressRouter.get("/get-single-address", auth, getSingleAddressController);
addressRouter.post("/delete-address", auth, deleteAddressController);
addressRouter.put("/update-address", auth, updateAddressController);
addressRouter.put("/select-address", auth, selectAddressController);



export default addressRouter;
