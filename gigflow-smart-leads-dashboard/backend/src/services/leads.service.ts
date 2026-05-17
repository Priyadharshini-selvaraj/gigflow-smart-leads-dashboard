import { FilterQuery } from 'mongoose';
import { Lead, ILead } from '../models/Lead.model';
import { AppError } from '../middleware/error.middleware';
import {
  CreateLeadDto,
  UpdateLeadDto,
  LeadFilterQuery,
  PaginatedLeads,
} from '../types/lead.types';
import { IUserPayload } from '../types/auth.types';

export class LeadsService {
  async createLead(dto: CreateLeadDto, user: IUserPayload): Promise<ILead> {
    const lead = await Lead.create({
      ...dto,
      createdBy: user.id,
      assignedTo: user.role === 'sales' ? user.id : dto.assignedTo,
    });
    return lead.populate(['createdBy', 'assignedTo']);
  }

  async getLeads(
    filters: LeadFilterQuery,
    user: IUserPayload
  ): Promise<PaginatedLeads<ILead>> {
    const { status, source, search, sort = 'latest', page = 1, limit = 10 } = filters;

    const query: FilterQuery<ILead> = {};

    // Sales users can only see their assigned leads
    if (user.role === 'sales') {
      query.assignedTo = user.id;
    }

    if (status) query.status = status;
    if (source) query.source = source;

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortOrder = sort === 'latest' ? -1 : 1;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Lead.find(query)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as ILead[],
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getLeadById(id: string, user: IUserPayload): Promise<ILead> {
    const lead = await Lead.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Sales can only view their assigned leads
    if (user.role === 'sales' && lead.assignedTo?.toString() !== user.id) {
      throw new AppError('Access denied', 403);
    }

    return lead;
  }

  async updateLead(id: string, dto: UpdateLeadDto, user: IUserPayload): Promise<ILead> {
    const lead = await Lead.findById(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Sales can only update their assigned leads
    if (user.role === 'sales' && lead.assignedTo?.toString() !== user.id) {
      throw new AppError('Access denied', 403);
    }

    // Sales users cannot change assignment
    const updateData = user.role === 'sales'
      ? { ...dto, assignedTo: undefined }
      : dto;

    const updated = await Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!updated) throw new AppError('Lead not found', 404);
    return updated;
  }

  async deleteLead(id: string): Promise<void> {
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
  }

  async getLeadsForExport(
    filters: LeadFilterQuery,
    user: IUserPayload
  ): Promise<ILead[]> {
    const { status, source, search } = filters;
    const query: FilterQuery<ILead> = {};

    if (user.role === 'sales') {
      query.assignedTo = user.id;
    }

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    return Lead.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .lean() as Promise<ILead[]>;
  }

  async getDashboardStats(user: IUserPayload) {
    const match: FilterQuery<ILead> = {};
    if (user.role === 'sales') {
      match.assignedTo = user.id;
    }

    const [statusCounts, sourceCounts, total, recentLeads] = await Promise.all([
      Lead.aggregate([
        { $match: match },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: match },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(match),
      Lead.find(match)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('assignedTo', 'name')
        .lean(),
    ]);

    return {
      total,
      byStatus: statusCounts.reduce(
        (acc: Record<string, number>, { _id, count }: { _id: string; count: number }) => {
          acc[_id] = count;
          return acc;
        },
        {}
      ),
      bySource: sourceCounts.reduce(
        (acc: Record<string, number>, { _id, count }: { _id: string; count: number }) => {
          acc[_id] = count;
          return acc;
        },
        {}
      ),
      recentLeads,
    };
  }
}

export const leadsService = new LeadsService();
