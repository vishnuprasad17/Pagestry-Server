import { Request, Response } from "express";
import { CreateAddressUseCase } from "../../application/use-cases/CreateAddressUseCase.js";
import { GetAllAddressesUseCase } from "../../application/use-cases/GetAllAddressesUseCase.js";
import { GetAddressByIdUseCase } from "../../application/use-cases/GetAddressByIdUseCase.js";
import { UpdateAddressUseCase } from "../../application/use-cases/UpdateAddressUseCase.js";
import { MakeAddressDefaultUseCase } from "../../application/use-cases/MakeAddressDefaultUseCase.js";
import { DeleteAddressUseCase } from "../../application/use-cases/DeleteAddressUseCase.js";

export class AddressController {
  constructor(
    private readonly createAddressUseCase: CreateAddressUseCase,
    private readonly getAllAddressesUseCase: GetAllAddressesUseCase,
    private readonly getAddressByIdUseCase: GetAddressByIdUseCase,
    private readonly updateAddressUseCase: UpdateAddressUseCase,
    private readonly makeAddressDefaultUseCase: MakeAddressDefaultUseCase,
    private readonly deleteAddressUseCase: DeleteAddressUseCase
  ) {}

  async addAddress(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const uid = req.user?.uid;

    if (!uid) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const address = await this.createAddressUseCase.execute(data);
    res.status(200).json({
      success: true,
      data: address,
      message: "Address added successfully"
    });
  }

  async getAllAddresses(req: Request, res: Response): Promise<void> {
    const { userId } = req.query;
    const addresses = await this.getAllAddressesUseCase.execute(userId as string);
    
    res.status(200).json({
      success: true,
      data: addresses,
      message: "Addresses fetched successfully"
    });
  }

  async getAddressById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const address = await this.getAddressByIdUseCase.execute(id);
    res.status(200).json({
      success: true,
      data: address,
      message: "Address fetched successfully"
    });
  }

  async updateAddress(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = req.body;

    const address = await this.updateAddressUseCase.execute(
      id,
      data.userId,
      data
    );
    res.status(200).json({
      success: true,
      data: address,
      message: "Address updated successfully"
    });
  }

  async makeAddressDefault(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { userId } = req.body;

    const address = await this.makeAddressDefaultUseCase.execute(id, userId);
    res.status(200).json({
      success: true,
      data: address,
      message: "Address set as default successfully"
    });
  }

  async deleteAddress(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await this.deleteAddressUseCase.execute(id);
    res.status(200).json({
      success: true,
      data: { success: true },
      message: "Address deleted successfully"
    });
  }
}