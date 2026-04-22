import { db } from '../../config/db';
import { RegisterInput, LoginInput } from './auth.schema';
import { ApiError } from '../../utils/ApiError';
import { hashPassword, comparePassword } from '../../utils/hashPassword';
import { generateTokens } from '../../utils/jwt';

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists', 'USER_EXISTS');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
        role: data.role,
      },
    });

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(data: LoginInput) {
    const user = await db.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await comparePassword(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async getMe(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
