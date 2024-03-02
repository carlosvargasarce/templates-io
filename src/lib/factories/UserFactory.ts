import { UserProps } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../storage/StorageService';
import { Admin } from '../users/Admin';
import { Client } from '../users/Client';
import { Moderator } from '../users/Moderator';
import { IUserFactory } from './IUserFactory';

/**
 * Implementación de la fábrica de usuarios que crea instancias de usuarios según su rol.
 */
class UserFactory implements IUserFactory {
  /**
   * Crea un nuevo usuario basado en los datos proporcionados y respuestas a ciertas preguntas.
   *
   * @param {UserProps} userData - Los datos básicos del usuario a ser creado.
   * @param {string[]} answers - Respuestas a preguntas que ayudan a determinar el rol del usuario.
   * @returns {Admin | Moderator | Client} Una nueva instancia de usuario según el rol determinado.
   * @throws {Error} Lanza un error si el tipo de usuario es desconocido.
   */
  createUser(userData: UserProps, answers: string[]) {
    const id = uuidv4();
    let user;
    const role = this.determineRoleBasedOnAnswers(answers);
    const completeUserData = { ...userData, id };

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

  /**
   * Determina el rol del usuario basado en las respuestas proporcionadas.
   *
   * @param {string[]} answers - Las respuestas a las preguntas proporcionadas durante el proceso de creación.
   * @returns {UserProps['role']} El rol del usuario determinado por sus respuestas.
   */
  determineRoleBasedOnAnswers(answers: string[]): UserProps['role'] {
    if (answers[0] == '1') {
      return 'Cliente';
    } else if (answers[0] == '2' && answers[1] == '1') {
      return 'Administrador';
    } else {
      return 'Moderador';
    }
  }

  //El siguiente método es únicamente por no contar con una base de datos dedicada.

  /**
   * Reinstancia un usuario a partir de los datos proporcionados.
   * Útil para recuperar una instancia de usuario con métodos después de deserializar.
   *
   * @param {UserProps} userData - Los datos del usuario a ser reinstanciado.
   * @returns {Admin | Moderator | Client} Una nueva instancia del usuario según el rol.
   * @throws {Error} Lanza un error si el tipo de usuario es desconocido.
   */
  instantiateUser(userData: UserProps) {
    let user;

    switch (userData.role) {
      case 'Administrador':
        user = new Admin({ ...userData });
        break;
      case 'Moderador':
        user = new Moderator({ ...userData });
        break;
      case 'Cliente':
        user = new Client({ ...userData });
        break;
      default:
        throw new Error('Tipo de usuario desconocido');
    }
    return user;
  }
}

export default UserFactory;
