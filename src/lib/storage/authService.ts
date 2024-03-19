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

  /**
   * Cierra la sesión del usuario activo.
   * Elimina la información del usuario activo del almacenamiento local, efectivamente "deslogueando" al usuario.
   * Esta función debe ser llamada cuando un usuario desea cerrar sesión de manera explícita.
   */
  public logout(): void {
    localStorage.removeItem('activeUser');
  }

  /**
   * Verifica si un usuario específico tiene el rol requerido.
   * Esta función busca entre los usuarios almacenados para encontrar uno que coincida con el correo electrónico dado
   * y que tenga el rol específico requerido. Además, se verifica que el usuario esté habilitado.
   *
   * @param {string} email - El correo electrónico del usuario a verificar.
   * @param {string} requiredRole - El rol requerido que se va a verificar contra el usuario.
   * @returns {boolean} Verdadero si se encuentra un usuario que coincida con el correo electrónico y el rol requeridos y que además esté habilitado; de lo contrario, falso.
   *
   **/
  public userHasRole(email: string, requiredRole: string): boolean {
    const users = this.storageService.getUsers();
    const user = users.find(
      (user) =>
        user.email === email && user.role === requiredRole && user.isEnabled
    );
    return user !== undefined;
  }

  /**
   * Verifica si hay un usuario activo con el rol requerido.
   *
   * Este método determina si el usuario activo actual (basado en la información almacenada
   * en localStorage) coincide con el correo electrónico proporcionado y tiene el rol requerido.
   * Es útil para simular la verificación de una sesión activa sin necesidad de re-autenticación.
   *
   * @param {string} email - El correo electrónico del usuario a verificar.
   * @param {string} requiredRole - El rol requerido que debe tener el usuario.
   * @returns {boolean} Verdadero si hay un usuario activo que coincide con el correo electrónico
   *                    y el rol requeridos; falso en caso contrario.
   */
  public isUserActiveAndHasRole(email: string, requiredRole: string): boolean {
    // Verifica si el código se está ejecutando en el lado del cliente.
    // localStorage solo está disponible en el navegador.
    if (!this.isClientSide()) {
      return false; // Retornamos falso directamente si no estamos en el cliente.
    }

    // Intenta obtener la información del usuario activo desde localStorage.
    const activeUserJson = localStorage.getItem('activeUser');
    if (!activeUserJson) {
      return false; // No hay información de un usuario activo, retornamos falso.
    }

    try {
      // Intenta parsear la información del usuario activo desde el string JSON.
      const activeUser = JSON.parse(activeUserJson);

      // Verifica si el correo electrónico y el rol del usuario activo coinciden con los proporcionados,
      // y además si el usuario está habilitado.
      return (
        activeUser.email === email &&
        activeUser.role === requiredRole &&
        activeUser.isEnabled
      );
    } catch (error) {
      // En caso de error al parsear la información, se registra el error y se retorna falso.
      console.error(
        'Error al parsear la información de activeUser desde localStorage:',
        error
      );
      return false;
    }
  }
}
