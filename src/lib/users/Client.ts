import { UserProps } from '@/types/user';
import { User } from '../models/User';

class Client extends User {
  constructor({ id, name, email, password }: UserProps) {
    super({ id, name, email, password, role: 'Cliente' });
  }

  habilitar(): void {
    console.log('Habilitar mi Template.');
  }

  deshabilitar(): void {
    console.log('Deshabilitar mi Template.');
  }
}

export { Client };
