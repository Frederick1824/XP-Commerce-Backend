export type Role = 'USER' | 'ADMIN';

export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  passwordHash: string;
  role: Role;
  refreshToken: string | null;
};

export type UsuarioPublico = Omit<Usuario, 'passwordHash' | 'refreshToken'>;

export type AuthTokenPayload = {
  sub: number;
  email: string;
  role: Role;
};

export type RegisterDto = {
  nombre: string;
  email: string;
  password: string;
  role?: Role;
};

export type LoginDto = {
  email: string;
  password: string;
};
