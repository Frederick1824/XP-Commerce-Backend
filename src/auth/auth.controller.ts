import type { Request, Response } from 'express';
import { AppError } from '../shared/errors/app-error.js';
import type { AuthService } from './auth.service.js';
import type { AuthenticatedRequest } from './auth.middleware.js';

function asObject(body: unknown): Record<string, unknown> {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new AppError(400, 'INVALID_BODY', 'El cuerpo debe ser un objeto JSON');
  }

  return body as Record<string, unknown>;
}

function textField(
  body: Record<string, unknown>,
  key: string,
  minLength = 1
): string {
  const value = body[key];

  if (typeof value !== 'string' || value.trim().length < minLength) {
    throw new AppError(400, 'VALIDATION_ERROR', `Campo invalido: ${key}`);
  }

  return value.trim();
}

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = async (request: Request, response: Response): Promise<void> => {
    const body = asObject(request.body);
    const nombre = textField(body, 'nombre', 2);
    const email = textField(body, 'email', 5).toLowerCase();
    const password = textField(body, 'password', 8);

    if (!email.includes('@')) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Email invalido');
    }

    const usuario = await this.service.register({ nombre, email, password });
    response.status(201).json({ data: usuario });
  };

  login = async (request: Request, response: Response): Promise<void> => {
    const body = asObject(request.body);

    const result = await this.service.login({
      email: textField(body, 'email').toLowerCase(),
      password: textField(body, 'password')
    });

    response.status(200).json({ data: result });
  };

  refresh = (request: Request, response: Response): void => {
    const body = asObject(request.body);
    const refreshToken = textField(body, 'refreshToken');

    response.status(200).json({
      data: this.service.refresh(refreshToken)
    });
  };

  perfil = (request: Request, response: Response): void => {
    response.status(200).json({
      data: (request as AuthenticatedRequest).auth
    });
  };

  usuarios = (_request: Request, response: Response): void => {
    response.status(200).json({
      data: this.service.listarUsuarios()
    });
  };
}
