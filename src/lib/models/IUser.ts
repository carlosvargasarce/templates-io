import { UserProps } from '@/types/user';

/**
 * Clase IUser
 * Descripción: Esta clase representa a un usuario en el sistema.
 */
abstract class IUser {
  private id: string;
  private role: UserProps['role'];
  private name: string;
  private email: string;
  private password: string;
  private isEnabled: boolean;

  /**
   * Constructor de la clase IUser.
   * @param {UserProps} props - Propiedades para inicializar un usuario.
   */
  constructor({ id, name, email, password, role, isEnabled }: UserProps) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isEnabled = isEnabled;
  }

  // Getters y Setters
  get Id(): string {
    return this.id;
  }

  get Name(): string {
    return this.name;
  }

  set Name(value: string) {
    this.name = value;
  }

  get Role(): UserProps['role'] {
    return this.role;
  }

  set Role(newRole: UserProps['role']) {
    this.role = newRole;
  }

  get Email(): string {
    return this.email;
  }

  set Email(value: string) {
    this.email = value;
  }

  get Password(): string {
    return this.password;
  }

  set Password(value: string) {
    this.password = value;
  }

  get IsEnabled(): boolean {
    return this.isEnabled;
  }

  set IsEnabled(value: boolean) {
    this.isEnabled = value;
  }

  //Métodos abstractos
  abstract habilitar(): void;
  abstract deshabilitar(): void;
}

export { IUser };
