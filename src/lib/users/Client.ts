import { UserProps } from '@/types/user';
import { IUser } from '../models/IUser';

class Client extends IUser {
  constructor({ id, name, email, password }: UserProps) {
    super({ id, name, email, password, role: 'Cliente', isEnabled: true });
  }

  habilitar(): void {
    this.IsEnabled = true;
  }

  deshabilitar(): void {
    this.IsEnabled = false;
  }

  // TODO: La idea de mantener métodos diferentes se mantuvo inicialmente pero funcionalmente no fue ejecutable porque habilitar/deshabilitar trabajan bajo la propiedad isEnabled, son métodos que van separados de la lógico del manejo de usuarios (idea Inicial), se van a explorar opciones para variar las 3 clases
}

export { Client };
