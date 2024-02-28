import { UserProps } from '@/types/user';
import UserFactory from '../factories/UserFactory';
import { StorageService } from '../storage/StorageService';

class UserManager {
  private storageService: StorageService;
  private userFactory: UserFactory;

  constructor() {
    this.storageService = StorageService.getInstance();
    this.userFactory = new UserFactory();
  }

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

  public getUserById(id: string): UserProps | undefined {
    return this.storageService.getUserById(id);
  }

  public getAllUsers(): UserProps[] {
    return this.storageService.getUsers();
  }

  public getActiveUser(): UserProps | null {
    return this.storageService.getActiveUser();
  }

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
}

export default UserManager;
