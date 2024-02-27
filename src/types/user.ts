export type Role = 'Administrador' | 'Moderador' | 'Cliente';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}
