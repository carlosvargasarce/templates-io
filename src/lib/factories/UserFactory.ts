import { UserProps } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../storage/StorageService';
import { Admin } from '../users/Admin';
import { Client } from '../users/Client';
import { Moderator } from '../users/Moderator';
import { IUserFactory } from './IUserFactory';

class UserFactory implements IUserFactory {
  createUser(userData: any, answers: string[]) {
    const id = uuidv4();
    let user;
    const role = this.determineRoleBasedOnAnswers(answers);
    const completeUserData = { ...userData, id, role };

    switch (role) {
      case 'Administrador':
        user = new Admin(completeUserData);
        break;
      case 'Moderador':
        user = new Moderator(completeUserData);
        break;
      case 'Cliente':
        user = new Client(completeUserData);
        break;
      default:
        throw new Error('Tipo de usuario desconocido');
    }

    const storageService = StorageService.getInstance();
    storageService.saveUser(user);

    return user;
  }

  // Este metodo no es comun para posibles variantes de la fabrica
  determineRoleBasedOnAnswers(answers: string[]): UserProps['role'] {
    if (answers[0] == '1') {
      return 'Cliente';
    } else if (answers[0] == '2' && answers[1] == '1') {
      return 'Administrador';
    } else {
      return 'Moderador';
    }
  }
}

export default UserFactory;
