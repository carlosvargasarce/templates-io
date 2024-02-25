import { User } from '../models/User';

class Admin extends User {
  habilitar(): void {}

  deshabilitar(): void {}
}

export { Admin };
