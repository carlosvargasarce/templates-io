export class StorageService {
  private static instance: StorageService;

  private constructor() {
    this.initializeLocalStorage();
  }

  private initializeLocalStorage(): void {
    console.log('Instancia local creada');
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }

    return StorageService.instance;
  }

  public saveUser(user: any) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsers(): any[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  public getUserById(id: string) {
    const users = this.getUsers();
    return users.find((user) => user.id === id);
  }

  public getActiveUser() {
    const activeUser = localStorage.getItem('activeUser');
    if (activeUser) {
      return JSON.parse(activeUser);
    }
    return null;
  }
}
