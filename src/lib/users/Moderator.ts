import { User } from '../models/User';

class Moderator extends User {
  habilitar(): void {}

  deshabilitar(): void {}
}

export { Moderator };
