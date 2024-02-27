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

  public createUser(userData: UserProps, answers: string[]) {
    this.userFactory.createUser(userData, answers);
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

  public deleteUser(id: string): void {
    this.storageService.deleteUser(id);
  }
}

export default UserManager;
