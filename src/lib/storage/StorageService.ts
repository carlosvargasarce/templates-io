export class StorageService {
  private static instance: StorageService;

  private constructor() {
    this.initializeLocalStorage();
  }

  private initializeLocalStorage(): void {
    console.log('Instancia local creada');
  }

  //El siguiente método es usado porque localStorage no puede correr del lado del servidor
  private isClientSide() {
    return typeof window !== 'undefined';
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }

    return StorageService.instance;
  }

  public saveUser(user: any) {
    if (!this.isClientSide()) return;

    const users = this.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsers(): any[] {
    if (!this.isClientSide()) return [];

    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  public getUserById(id: string) {
    const users = this.getUsers();
    return users.find((user) => user.id === id);
  }

  public getActiveUser() {
    if (!this.isClientSide()) return null;

    const activeUser = localStorage.getItem('activeUser');
    if (activeUser) {
      return JSON.parse(activeUser);
    }
    return null;
  }

  public deleteUser(id: string): void {
    if (!this.isClientSide()) return;

    let users = this.getUsers();
    users = users.filter((user) => user.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
  }
}
