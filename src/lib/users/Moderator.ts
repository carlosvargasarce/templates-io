import { UserProps } from '@/types/user';
import { User } from '../models/User';

class Moderator extends User {
  constructor({ id, name, email, password }: UserProps) {
    super({ id, name, email, password, role: 'Moderador' });
  }

  habilitar(): void {
    console.log('Habilitar un template en lista de revisión.');
  }

  deshabilitar(): void {
    console.log('Deshabilitar un template en lista de revisión.');
  }
}

export { Moderator };
