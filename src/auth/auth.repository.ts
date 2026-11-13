import bcrypt from 'bcrypt';
import type { Usuario, UsuarioPublico } from './auth.types.js';

export class AuthRepository {
  private readonly usuarios: Usuario[] = [];
  private nextId = 1;

  constructor() {
    const adminEmail = process.env.DEMO_ADMIN_EMAIL;
    const adminPassword = process.env.DEMO_ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      this.usuarios.push({
        id: this.nextId++,
        nombre: 'Administrador Demo',
        email: adminEmail.toLowerCase(),
        passwordHash: bcrypt.hashSync(adminPassword, 12),
        role: 'ADMIN',
        refreshToken: null
      });
    }
  }

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
  }): Usuario {
    const usuario: Usuario = {
      id: this.nextId++,
      nombre: datos.nombre,
      email: datos.email,
      passwordHash: datos.passwordHash,
      role: 'USER',
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
    return this.usuarios.map(
      ({ passwordHash: _passwordHash, refreshToken: _refreshToken, ...usuario }) =>
        usuario
    );
  }
}
