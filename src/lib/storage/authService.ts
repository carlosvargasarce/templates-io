import { StorageService } from './StorageService';

export class AuthService {
  private storageService: StorageService;

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  /**
   * Determina si el código se está ejecutando en el lado del cliente.
   * Esto es necesario porque localStorage solo está disponible en el navegador.
   * @returns {boolean} Verdadero si se está ejecutando en el lado del cliente, falso de lo contrario.
   */
  private isClientSide() {
    return typeof window !== 'undefined';
  }

  /**
   * Intenta iniciar sesión con un correo electrónico y contraseña dados.
   * Solo inicia sesión si el usuario está habilitado (`isEnabled` es verdadero).
   *
   * @param {string} email - El correo electrónico del usuario.
   * @param {string} password - La contraseña del usuario.
   * @returns {boolean} Verdadero si el inicio de sesión es exitoso, falso de lo contrario.
   */
  public login(email: string, password: string): boolean {
    const users = this.storageService.getUsers();
    // TODO:IMPLEMENTAR MAYOR SEGURIDAD EN CONTRASEÑA
    const user = users.find(
      (user) =>
        user.email === email && user.password === password && user.isEnabled
    );

    if (user && this.isClientSide()) {
      localStorage.setItem('activeUser', JSON.stringify(user));
      return true;
    }

    return false;
  }

  public logout(): void {
    localStorage.removeItem('activeUser');
  }
}
