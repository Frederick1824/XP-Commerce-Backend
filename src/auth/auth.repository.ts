import type { Role, Usuario, UsuarioPublico } from './auth.types.js';

export class AuthRepository {
  private readonly usuarios: Usuario[] = [];
  private nextId = 1;

  buscarPorEmail(email: string): Usuario | undefined {
    return this.usuarios.find((usuario) => usuario.email === email);
  }

  buscarPorId(id: number): Usuario | undefined {
    return this.usuarios.find((usuario) => usuario.id === id);
  }

  crear(datos: {
    nombre: string;
    email: string;
    passwordHash: string;
    role?: Role;
  }): Usuario {
    const usuario: Usuario = {
      id: this.nextId++,
      nombre: datos.nombre,
      email: datos.email,
      passwordHash: datos.passwordHash,
      role: datos.role ?? 'USER',
      refreshToken: null
    };
    this.usuarios.push(usuario);
    return usuario;
  }

  guardarRefreshToken(usuarioId: number, refreshToken: string | null): void {
    const usuario = this.buscarPorId(usuarioId);
    if (usuario) usuario.refreshToken = refreshToken;
  }

  listarPublicos(): UsuarioPublico[] {
    return this.usuarios.map(({ passwordHash: _p, refreshToken: _r, ...usuario }) => usuario);
  }
}
