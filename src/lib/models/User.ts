import { UserProps } from '@/types/user';

abstract class User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserProps['role'];

  constructor({ id, name, email, password, role }: UserProps) {
    this.id = id;
    this.name = name;
    this.email = email;
    // TODO: HASHEAR CONTRASEÑA
    this.password = password;
    this.role = role;
  }

  //Métodos abstractos
  abstract habilitar(): void;
  abstract deshabilitar(): void;
}

export { User };
