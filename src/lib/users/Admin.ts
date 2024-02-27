import { UserProps } from '@/types/user';
import { IUser } from '../models/IUser';

class Admin extends IUser {
  constructor({ id, name, email, password }: UserProps) {
    super({ id, name, email, password, role: 'Administrador' });
  }

  habilitar(): void {
    console.log('Habilitar Usuario.');
  }

  deshabilitar(): void {
    console.log('Deshabilitar Usuario.');
  }
}

export { Admin };
