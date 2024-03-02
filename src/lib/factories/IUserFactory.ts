import { UserProps } from '@/types/user';
import { IUser } from '../models/IUser';

/**
 * Define la interfaz para una fábrica de usuarios.
 * Esta interfaz especifica los métodos requeridos para crear y reinstanciar usuarios.
 */
export interface IUserFactory {
  /**
   * Crea un nuevo usuario basado en los datos proporcionados y las respuestas a preguntas específicas.
   * Este método puede ser opcional dependiendo de la implementación concreta.
   *
   * @param {UserProps} userData - Los datos del usuario a ser creado.
   * @param {string[]} answers - Las respuestas a preguntas específicas que pueden influir en la creación del usuario.
   * @returns {IUser} Una nueva instancia de un usuario.
   */
  createUser?(userData: UserProps, answers: string[]): IUser;

  /**
   * Reinstancia un usuario a partir de los datos proporcionados.
   * Este método es útil para recuperar la funcionalidad de instancia después de deserializar el objeto, se uso ya que no contamos con Base de Datos y es necesario para localstorage.
   *
   * @param {UserProps} userData - Los datos del usuario a ser reinstanciado.
   * @returns {IUser} Una instancia del usuario con métodos y propiedades completamente funcionales.
   */
  instantiateUser?(userData: UserProps): IUser;
}
