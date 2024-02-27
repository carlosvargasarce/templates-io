import { UserProps } from '@/types/user';
import { IUser } from '../models/IUser';

class Moderator extends IUser {
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
