import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../shared/errors/app-error.js';
import type { AuthRepository } from './auth.repository.js';
import type {
  AuthTokenPayload,
  LoginDto,
  RegisterDto,
  UsuarioPublico
} from './auth.types.js';

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async register(dto: RegisterDto): Promise<UsuarioPublico> {
    if (this.repository.buscarPorEmail(dto.email)) {
      throw new AppError(400, 'EMAIL_ALREADY_EXISTS', 'El email ya esta registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const usuario = this.repository.crear({
      nombre: dto.nombre,
      email: dto.email,
      passwordHash
    });

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role
    };
  }

  async login(dto: LoginDto) {
    const usuario = this.repository.buscarPorEmail(dto.email);

    if (!usuario || !(await bcrypt.compare(dto.password, usuario.passwordHash))) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Credenciales invalidas');
    }

    const payload: AuthTokenPayload = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role
    };

    const accessToken = jwt.sign(payload, this.getAccessSecret(), {
      expiresIn: '15m'
    });

    const refreshToken = jwt.sign(payload, this.getRefreshSecret(), {
      expiresIn: '7d'
    });

    this.repository.guardarRefreshToken(usuario.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role
      }
    };
  }

  refresh(token: string): { accessToken: string } {
    let payload: AuthTokenPayload;

    try {
      payload = jwt.verify(token, this.getRefreshSecret()) as AuthTokenPayload;
    } catch {
      throw new AppError(
        403,
        'INVALID_REFRESH_TOKEN',
        'Refresh token invalido o expirado'
      );
    }

    const usuario = this.repository.buscarPorId(payload.sub);

    if (!usuario || usuario.refreshToken !== token) {
      throw new AppError(
        403,
        'INVALID_REFRESH_TOKEN',
        'Refresh token revocado o invalido'
      );
    }

    return {
      accessToken: jwt.sign(
        { sub: usuario.id, email: usuario.email, role: usuario.role },
        this.getAccessSecret(),
        { expiresIn: '15m' }
      )
    };
  }

  verifyAccessToken(token: string): AuthTokenPayload {
    try {
      return jwt.verify(token, this.getAccessSecret()) as AuthTokenPayload;
    } catch {
      throw new AppError(
        403,
        'INVALID_ACCESS_TOKEN',
        'Token invalido o expirado'
      );
    }
  }

  listarUsuarios(): UsuarioPublico[] {
    return this.repository.listarPublicos();
  }

  private getAccessSecret(): string {
    const value = process.env.JWT_ACCESS_SECRET;
    if (!value) {
      throw new AppError(500, 'AUTH_CONFIG_ERROR', 'Falta JWT_ACCESS_SECRET');
    }
    return value;
  }

  private getRefreshSecret(): string {
    const value = process.env.JWT_REFRESH_SECRET;
    if (!value) {
      throw new AppError(500, 'AUTH_CONFIG_ERROR', 'Falta JWT_REFRESH_SECRET');
    }
    return value;
  }
}
