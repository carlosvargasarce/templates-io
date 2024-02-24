'use client';

import Button from '@/components/Button/Button';
import Title from '@/components/Title/Title';
import { customStyles } from '@/constants/tableStylesOverrides';
import { UserProps } from '@/types/user';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import styles from './page.module.scss';
import { users } from './users';

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

export default function Page() {
  const [selectedRows, setSelectedRows] = useState<UserProps[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(users);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(false);
  }, []);

  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  //TODO: CREAR COMPONENTE PARA MODAL
  const handleDelete = () => {
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
