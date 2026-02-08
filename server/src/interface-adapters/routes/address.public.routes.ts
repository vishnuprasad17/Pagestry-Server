import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireUserAuth } from "../middlewares/user.auth.middleware.js";
import { AddressModule } from "../../infrastructure/di/AddressModule.js";

const router = Router();
const addressController = AddressModule.getAddressController();

router.get("/", requireUserAuth, asyncHandler("Get Addresses")((req, res) => 
  addressController.getAllAddresses(req, res)
));

router.get("/:id", requireUserAuth, asyncHandler("Get Address")((req, res) => 
  addressController.getAddressById(req, res)
));

router.post("/add-address", requireUserAuth, asyncHandler("Add Address")((req, res) => 
  addressController.addAddress(req, res)
));

router.put("/update-address/:id", requireUserAuth, asyncHandler("Update Address")((req, res) => 
  addressController.updateAddress(req, res)
));

router.patch("/:id/make-default", requireUserAuth, asyncHandler("Make Address Default")((req, res) => 
  addressController.makeAddressDefault(req, res)
));

router.delete("/delete-address/:id", requireUserAuth, asyncHandler("Delete Address")((req, res) => 
  addressController.deleteAddress(req, res)
));

export default router;