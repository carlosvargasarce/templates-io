import { UserProps } from '@/types/user';
import { User } from '../models/User';

class Admin extends User {
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
