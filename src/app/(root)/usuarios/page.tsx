'use client';

import Button from '@/components/Button/Button';
import Title from '@/components/Title/Title';
import { customStyles } from '@/constants/tableStylesOverrides';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import UserManager from '@/lib/manager/UserManager';
import { UserProps } from '@/types/user';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import styles from './page.module.scss';

//Estructura de las columnas
const columns: TableColumn<UserProps>[] = [
  {
    name: 'Nombre Completo',
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: 'Correo Electrónico',
    selector: (row) => row.email,
    sortable: true,
    hide: 768,
  },
  {
    name: 'Rol',
    selector: (row) => row.role,
    sortable: true,
  },
];

const userManager = new UserManager();
const users = userManager.getAllUsers();

export default function Page() {
  const router = useRouter();

  const [selectedRows, setSelectedRows] = useState<UserProps[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState<UserProps[]>([]);
  const [loader, setLoader] = useState(true);
  const [userManager, setUserManager] = useState<UserManager | null>(null);
  const [users, setUsers] = useState<UserProps[]>([]);

  const user = useRequireAuth();
  const userRole = user?.role || '';
  

  

  useEffect(() => {
    const userManagerInstance = new UserManager();
    const usersData = userManagerInstance.getAllUsers();
    setUserManager(userManagerInstance);
    setUsers(usersData);
    setData(usersData);
    setLoader(false);
  }, []);

  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  //TODO: CREAR COMPONENTE PARA MODAL
  const handleDelete = () => {

    if (selectedRows.length === 0) {
      console.error('No se ha seleccionado ningún usuario para eliminar');
      return;
    }

    const selectedUserIds = selectedRows.map((user) => user.id);
    const updatedData = data.filter((user) => !selectedUserIds.includes(user.id));
    setData(updatedData);

    setSelectedRows([]);

    console.log('Remover el usuario: ', selectedRows[0].name);
  };

  // TODO: CAMBIAR EL CHECKBOX POR UNO PROPIO (NICE TO HAVE) VER DOCUMENTACIÓN
  return (
    <main>
      <Title color="primaryColor">Lista de usuarios</Title>
      <div className={styles.buttons}>
        {selectedRows.length > 0 && (
          <Button label="Eliminar" bgColor="danger" onClick={handleDelete} />
        )}

        {userRole === 'Administrador' ? (
        <Link
          href={
            selectedRows.length > 0
              ? `/editar-usuario/${selectedRows[0].id}`
              : '/crear-usuario'
          }
        >
          <Button
            label={selectedRows.length > 0 ? 'Editar' : 'Crear'}
            bgColor="primaryColor"
          />
        </Link>
      ) : (
        // Si el usuario no es administrador, redirige al home
        <Button
        label="Ir al Home"
        bgColor="primaryColor"
        onClick={() => router.push('/')}
        />
      )}
      </div>

      {/* TODO: CREAR LOADER */}
      {loader ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          customStyles={customStyles as any}
          selectableRows
          selectableRowsSingle
          selectableRowsHighlight
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleCleared}
          pagination={true}
          paginationComponentOptions={{
            rowsPerPageText: 'Filas por página:',
            rangeSeparatorText: 'de',
            noRowsPerPage: false,
            selectAllRowsItem: false,
            selectAllRowsItemText: 'Todos',
          }}
        />
      )}
    </main>
  );
}
