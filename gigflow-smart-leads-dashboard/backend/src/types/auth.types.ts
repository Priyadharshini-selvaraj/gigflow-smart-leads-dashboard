export type UserRole = 'admin' | 'sales';

export interface IUserPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  token: string;
}

// Augment Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}
