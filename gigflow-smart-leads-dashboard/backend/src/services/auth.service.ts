import { User } from '../models/User.model';
import { signToken } from '../utils/jwt.util';
import { AppError } from '../middleware/error.middleware';
import { RegisterDto, LoginDto, AuthResponse } from '../types/auth.types';

export class AuthService {
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await User.findOne({ email: dto.email.toLowerCase() });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const user = await User.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role ?? 'sales',
    });

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await User.findOne({ email: dto.email.toLowerCase() }).select('+password');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Your account has been deactivated', 403);
    }

    const isPasswordValid = await user.comparePassword(dto.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}

export const authService = new AuthService();
