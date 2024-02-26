type Role = 'Administrador' | 'Moderador' | 'Cliente';

export type UserProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};
