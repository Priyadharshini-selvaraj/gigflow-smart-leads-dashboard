import { Request, Response, NextFunction } from 'express';
import { leadsService } from '../services/leads.service';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response.util';
import { CreateLeadDto, UpdateLeadDto, LeadFilterQuery } from '../types/lead.types';

export class LeadsController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateLeadDto = req.body;
      const lead = await leadsService.createLead(dto, req.user!);
      sendCreated(res, lead, 'Lead created successfully');
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: LeadFilterQuery = {
        status: req.query.status as LeadFilterQuery['status'],
        source: req.query.source as LeadFilterQuery['source'],
        search: req.query.search as string,
        sort: (req.query.sort as LeadFilterQuery['sort']) ?? 'latest',
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      };

      const result = await leadsService.getLeads(filters, req.user!);
      sendPaginated(res, result.data, result.meta as Record<string, unknown>, 'Leads fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await leadsService.getLeadById(req.params.id, req.user!);
      sendSuccess(res, lead, 'Lead fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: UpdateLeadDto = req.body;
      const lead = await leadsService.updateLead(req.params.id, dto, req.user!);
      sendSuccess(res, lead, 'Lead updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await leadsService.deleteLead(req.params.id);
      sendSuccess(res, null, 'Lead deleted successfully');
    } catch (err) {
      next(err);
    }
  }

  async exportCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: LeadFilterQuery = {
        status: req.query.status as LeadFilterQuery['status'],
        source: req.query.source as LeadFilterQuery['source'],
        search: req.query.search as string,
      };

      const leads = await leadsService.getLeadsForExport(filters, req.user!);

      const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Source', 'Notes', 'Created At'];
      const rows = leads.map((l) => [
        l.name,
        l.email,
        l.phone ?? '',
        l.company ?? '',
        l.status,
        l.source,
        (l.notes ?? '').replace(/,/g, ';'),
        new Date(l.createdAt).toISOString(),
      ]);

      const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
      res.send(csv);
    } catch (err) {
      next(err);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await leadsService.getDashboardStats(req.user!);
      sendSuccess(res, stats, 'Stats fetched successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const leadsController = new LeadsController();
