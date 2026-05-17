import { Router } from 'express';
import { leadsController } from '../controllers/leads.controller';
import { createLeadValidator, updateLeadValidator, leadQueryValidator } from '../validators/lead.validator';
import { validate } from '../middleware/error.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { isAdmin, isAdminOrSales } from '../middleware/rbac.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/leads/stats - Dashboard stats
router.get('/stats', isAdminOrSales, leadsController.getStats.bind(leadsController));

// GET /api/leads/export - CSV export
router.get('/export', isAdminOrSales, leadsController.exportCSV.bind(leadsController));

// GET /api/leads - Get all leads with filters & pagination
router.get('/', isAdminOrSales, leadQueryValidator, validate, leadsController.getAll.bind(leadsController));

// POST /api/leads - Create lead (admin only)
router.post('/', isAdmin, createLeadValidator, validate, leadsController.create.bind(leadsController));

// GET /api/leads/:id - Get single lead
router.get('/:id', isAdminOrSales, leadsController.getOne.bind(leadsController));

// PATCH /api/leads/:id - Update lead
router.patch('/:id', isAdminOrSales, updateLeadValidator, validate, leadsController.update.bind(leadsController));

// DELETE /api/leads/:id - Delete lead (admin only)
router.delete('/:id', isAdmin, leadsController.delete.bind(leadsController));

export default router;
