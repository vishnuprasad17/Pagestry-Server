import { AuditLogResponseDto } from "../../../../application/dto/AdminDto.js";
import { IAuditLogRepository } from "../../../../application/ports/IAuditLogRepository.js";
import { AuditLog } from "../../../../domain/entities/AuditLog.js";
import { AuditLogMapper } from "../mappers/AuditLogMapper.js";
import { AuditLogModel } from "../models/AuditLogModel.js";

export class MongoAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly model: typeof AuditLogModel) {}

  async save(auditLog: AuditLog): Promise<AuditLog> {
    const persistenceData = AuditLogMapper.toPersistence(auditLog);
    const newDoc = new this.model(persistenceData);
    await newDoc.save();

    return new AuditLog(
      newDoc._id.toString(),
      auditLog.action,
      auditLog.targetUserId,
      auditLog.performedById
    )
  }

  async findFiltered(
    page: number,
    limit: number,
    filter?: string,
    search?: string
  ): Promise<{ logs: AuditLogResponseDto[], total: number }> {
    const skip = (page - 1) * limit;

    const basePipeline: any[] = [
      {
        $lookup: {
          from: "users",
          localField: "targetUser",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "performedBy",
          foreignField: "_id",
          as: "admin"
        }
      },
      { $unwind: { path: "$admin", preserveNullAndEmptyArrays: true } }
    ];

    if (filter === "BLOCK_USER") basePipeline.push({ $match: { action: "BLOCK_USER" } });
    if (filter === "UNBLOCK_USER") basePipeline.push({ $match: { action: "UNBLOCK_USER" } });

    if (search && search.trim() !== "") {
      basePipeline.push({
        $match: {
          $or: [
            { "user.name": { $regex: search, $options: "i" } },
            { "user.username": { $regex: search, $options: "i" } },
            { "admin.name": { $regex: search, $options: "i" } },
            { "admin.username": { $regex: search, $options: "i" } }
          ]
        }
      });
    }

    const logsPipeline = [...basePipeline,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ];

    const countPipeline = [...basePipeline, { $count: "count" }];

    const [logs, totalResult] = await Promise.all([
      this.model.aggregate(logsPipeline),
      this.model.aggregate(countPipeline)
    ]);

    const total = totalResult.length > 0 ? totalResult[0].count : 0;

    return {
      logs: logs.map(doc => AuditLogMapper.toDomain(doc)),
      total
    };
  }
}