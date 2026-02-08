import { IAddressRepository } from "../../application/ports/IAddressRepository.js";
import { IAddressUnitOfWork } from "../../application/ports/IUnitOfWork.js";
import { CreateAddressUseCase } from "../../application/use-cases/CreateAddressUseCase.js";
import { DeleteAddressUseCase } from "../../application/use-cases/DeleteAddressUseCase.js";
import { GetAddressByIdUseCase } from "../../application/use-cases/GetAddressByIdUseCase.js";
import { GetAllAddressesUseCase } from "../../application/use-cases/GetAllAddressesUseCase.js";
import { MakeAddressDefaultUseCase } from "../../application/use-cases/MakeAddressDefaultUseCase.js";
import { UpdateAddressUseCase } from "../../application/use-cases/UpdateAddressUseCase.js";
import { AddressController } from "../../interface-adapters/controllers/AddressController.js";
import { AddressModel } from "../persistence/mongoose/models/AddressModel.js";
import { MongoAddressUnitOfWork } from "../persistence/mongoose/MongoAddressUnitOfWork.js";
import { MongoAddressRepository } from "../persistence/mongoose/repositories/MongoAddressRepository.js";

export class AddressModule {
  private static addressRepository: IAddressRepository;
  private static unitOfWork: IAddressUnitOfWork;

  static getAddressRepository(): IAddressRepository {
    if (!this.addressRepository) {
      this.addressRepository = new MongoAddressRepository(AddressModel);
    }
    return this.addressRepository;
  }

  static getUnitOfWork(): IAddressUnitOfWork {
    return new MongoAddressUnitOfWork();
  }

  static getCreateAddressUseCase(): CreateAddressUseCase {
    return new CreateAddressUseCase(this.getUnitOfWork());
  }

  static getGetAllAddressesUseCase(): GetAllAddressesUseCase {
    return new GetAllAddressesUseCase(this.getAddressRepository());
  }

  static getGetAddressByIdUseCase(): GetAddressByIdUseCase {
    return new GetAddressByIdUseCase(this.getAddressRepository());
  }

  static getUpdateAddressUseCase(): UpdateAddressUseCase {
    return new UpdateAddressUseCase(this.getUnitOfWork());
  }

  static getMakeAddressDefaultUseCase(): MakeAddressDefaultUseCase {
    return new MakeAddressDefaultUseCase(this.getUnitOfWork());
  }

  static getDeleteAddressUseCase(): DeleteAddressUseCase {
    return new DeleteAddressUseCase(this.getUnitOfWork());
  }

  static getAddressController(): AddressController {
    return new AddressController(
      this.getCreateAddressUseCase(),
      this.getGetAllAddressesUseCase(),
      this.getGetAddressByIdUseCase(),
      this.getUpdateAddressUseCase(),
      this.getMakeAddressDefaultUseCase(),
      this.getDeleteAddressUseCase()
    );
  }
}