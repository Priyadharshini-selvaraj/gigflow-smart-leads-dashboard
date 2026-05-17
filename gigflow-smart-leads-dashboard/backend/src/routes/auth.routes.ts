import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { registerValidator, loginValidator } from '../validators/auth.validator';
import { validate } from '../middleware/error.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register
router.post('/register', registerValidator, validate, authController.register.bind(authController));

// POST /api/auth/login
router.post('/login', loginValidator, validate, authController.login.bind(authController));

// GET /api/auth/me
router.get('/me', authenticate, authController.getMe.bind(authController));

export default router;
