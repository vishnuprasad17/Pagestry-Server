import { UserFilters } from "../../domain/value-objects/UserFilters.js";
import { PaginatedUsersDto } from "../dto/UserDto.js";
import { IUserRepository } from "../ports/IUserRepository.js";

export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    page: number,
    limit: number,
    filter?: string,
    sortBy?: string,
    searchQuery?: string
  ): Promise<PaginatedUsersDto> {
    const filters = new UserFilters(
      page,
      limit,
      filter as any,
      sortBy as any,
      searchQuery
    );

    const { users, total } = await this.userRepository.findFiltered(filters);

    return {
      users: users.map(user => ({
        id: user._id.toString(),
        firebaseUid: user.firebaseUid,
        name: user.name,
        username: user.username,
        isBlocked: user.isBlocked,
        createdAt: user.createdAt
      })),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalUsers: total
    };
  }
}