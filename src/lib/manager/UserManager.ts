import { UserProps } from '@/types/user';
import UserFactory from '../factories/UserFactory';
import { StorageService } from '../storage/StorageService';

/**
 * Gestiona las operaciones relacionadas con los usuarios.
 */
class UserManager {
  private storageService: StorageService;
  private userFactory: UserFactory;

  /**
   * Inicializa una nueva instancia de UserManager.
   */
  constructor() {
    this.storageService = StorageService.getInstance();
    this.userFactory = new UserFactory();
  }

  /**
   * Crea un nuevo usuario basado en los datos proporcionados y respuestas a preguntas específicas.
   *
   * @param {UserProps} userData - Los datos del usuario a crear.
   * @param {string[]} answers - Respuestas a preguntas específicas para determinar roles u opciones del usuario.
   * @returns {Promise<string>} Una promesa que resuelve con un mensaje de éxito o rechaza con un mensaje de error.
   */
  public createUser(userData: UserProps, answers: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const users = this.storageService.getUsers();
      const emailExists = users.some((user) => user.email === userData.email);

      if (emailExists) {
        reject('El correo electrónico ya está registrado.');
        return;
      }

      try {
        this.userFactory.createUser(userData, answers);
        resolve('Usuario creado con éxito.');
      } catch (error) {
        reject('Error al crear el usuario.');
      }
    });
  }

  /**
   * Obtiene un usuario por su ID.
   *
   * @param {string} id - El ID del usuario a buscar.
   * @returns {UserProps | undefined} Los datos del usuario si se encuentra, de lo contrario undefined.
   */
  public getUserById(id: string): UserProps | undefined {
    return this.storageService.getUserById(id);
  }

  /**
   * Obtiene todos los usuarios.
   *
   * @returns {UserProps[]} Un array con todos los usuarios.
   */
  public getAllUsers(): UserProps[] {
    return this.storageService.getUsers();
  }

  /**
   * Obtiene el usuario activo actualmente.
   *
   * @returns {UserProps | null} Los datos del usuario activo si existe, de lo contrario null.
   */
  public getActiveUser(): UserProps | null {
    return this.storageService.getActiveUser();
  }

  /**
   * Elimina un usuario por su ID.
   *
   * @param {string} id - El ID del usuario a eliminar.
   * @returns {Promise<string>} Una promesa que resuelve con un mensaje de éxito o rechaza con un mensaje de error.
   */
  public deleteUser(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const userToDelete = this.storageService.getUserById(id);

      const admins = this.storageService
        .getUsers()
        .filter((user) => user.role === 'Administrador');

      // Si el usuario es un administrador y es el último, rechaza la operación.
      if (userToDelete.role === 'Administrador' && admins.length <= 1) {
        reject('No se puede eliminar el único administrador de la plataforma.');
        return;
      }

      // Procede a eliminar el usuario.
      this.storageService.deleteUser(id);
      resolve('Usuario eliminado con éxito.');
    });
  }

  /**
   * Cambia el estado de habilitación de un usuario.
   *
   * @param {string} id - El ID del usuario a modificar.
   * @param {boolean} enable - Verdadero para habilitar, falso para deshabilitar.
   * @returns {Promise<string>} Una promesa que resuelve con un mensaje de éxito o rechaza con un mensaje de error.
   */
  public toggleUserEnabled(id: string, enable: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      const userObj = this.storageService.getUserById(id);

      console.log('USER', userObj);
      if (!userObj) {
        reject('Usuario no encontrado.');
        return;
      }

      if (userObj.role === 'Administrador' && !this.canToggleAdmin(userObj)) {
        reject(
          'No se puede deshabilitar el único administrador de la plataforma.'
        );
        return;
      }

      const user = this.userFactory.instantiateUser(userObj);

      //userObj.isEnabled = enable;

      if (enable) {
        console.log('Abling user');
        user.habilitar();
      } else {
        console.log('Disabling user');
        user.deshabilitar();
      }

      this.storageService.updateUser(user);

      //console.log('USER2', user);

      //this.storageService.updateUser(user);

      resolve(
        enable
          ? 'Usuario habilitado con éxito.'
          : 'Usuario deshabilitado con éxito.'
      );
    });
  }

  /**
   * Determina si es posible deshabilitar un administrador.
   *
   * @param {UserProps} user - Los datos del usuario administrador a verificar.
   * @returns {boolean} Verdadero si es posible deshabilitar, falso de lo contrario.
   */
  private canToggleAdmin(user: UserProps): boolean {
    const admins = this.storageService
      .getUsers()
      .filter((user) => user.role === 'Administrador' && user.isEnabled);

    return admins.length > 1 || this.getActiveUser()?.id !== user.id;
  }
}

export default UserManager;
