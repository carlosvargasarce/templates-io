import { StorageService } from './StorageService';

export class AuthService {
  private storageService: StorageService;

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  //El siguiente método es usado porque localStorage no puede correr del lado del servidor
  private isClientSide() {
    return typeof window !== 'undefined';
  }

  public login(email: string, password: string): boolean {
    const users = this.storageService.getUsers();
    // TODO:IMPLEMENTAR MAYOR SEGURIDAD EN CONTRASEÑA
    const user = users.find(
      (user) => user.email === email && user.password === password
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
