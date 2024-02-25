export const sidebarLinks = [
  {
    label: 'Inicio',
    route: '/',
    icon: 'Home',
    singular: '/',
    roles: ['Administrador', 'Moderador', 'Cliente'],
  },
  {
    label: 'Usuarios',
    route: 'usuarios',
    singular: 'usuario',
    icon: 'Every-user',
    roles: ['Administrador'],
  },
  {
    label: 'Templates',
    route: 'templates',
    singular: 'template',
    icon: 'Page-template',
    roles: ['Moderador', 'Cliente'],
  },
  {
    label: 'Documentos',
    route: 'documentos',
    singular: 'documento',
    icon: 'File-focus-one',
    roles: ['Cliente'],
  },
];
