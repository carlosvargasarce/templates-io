'use client';

import Button from '@/components/Button/Button';
import Title from '@/components/Title/Title';
import { customStyles } from '@/constants/tableStylesOverrides';
import useToast from '@/hooks/useToast';
import UserManager from '@/lib/manager/UserManager';
import { UserProps } from '@/types/user';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import styles from './page.module.scss';

/**
 * Define la estructura de las columnas para la tabla de usuarios.
 * @type {TableColumn<UserProps>[]}
 */
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

/**
 * Componente de página que muestra una lista de usuarios y permite realizar acciones como eliminar o editar usuarios.
 */
export default function Page() {
  const [selectedRows, setSelectedRows] = useState<UserProps[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState<UserProps[]>([]);
  const [loader, setLoader] = useState(true);
  const [refreshDataTrigger, setRefreshDataTrigger] = useState(false);
  const userManager = new UserManager();
  const { notifyError } = useToast();

  useEffect(() => {
    const users = userManager.getAllUsers();
    setData(users);
    setLoader(false); // Desactiva el indicador de carga una vez que los datos están listos.
  }, [refreshDataTrigger]);

  /**
   * Maneja la selección de filas en la tabla de usuarios.
   * @param {any} state - Estado actual de las filas seleccionadas.
   */
  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  /**
   * Maneja la acción de eliminar usuarios seleccionados.
   */
  const handleDelete = () => {
    if (selectedRows.length === 0) {
      notifyError('No se ha seleccionado ningún usuario para eliminar');
      return;
    }

    userManager.deleteUser(selectedRows[0].id);
    setRefreshDataTrigger((current) => !current);
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
          noDataComponent={
            <div style={{ marginTop: '120px' }}>
              No hay usuarios registrados
            </div>
          }
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
