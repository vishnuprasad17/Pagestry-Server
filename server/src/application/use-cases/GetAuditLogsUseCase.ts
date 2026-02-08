import { PaginatedAuditLogsDto } from "../dto/AdminDto.js";
import { IAuditLogRepository } from "../ports/IAuditLogRepository.js";

export class GetAuditLogsUseCase {
  constructor(private readonly auditLogRepository: IAuditLogRepository) {}

  async execute(
    page: number,
    limit: number,
    filter?: string,
    search?: string
  ): Promise<PaginatedAuditLogsDto> {
    const { logs, total } = await this.auditLogRepository.findFiltered(
      page,
      limit,
      filter,
      search
    );

    return {
      auditLogs: logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }
}