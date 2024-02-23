'use client';

import Title from '@/components/Title/Title';
import { customStyles } from '@/constants/tableStylesOverrides';
import { UserProps } from '@/types/user';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
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
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(users);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(false);
  }, []);

  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  // TODO: AÑADIR CONTEXTACTION APENAS SE CREE EL COMPONENTE DE BOTON
  // TODO: CAMBIAR EL CHECKBOX POR UNO PROPIO (NICE TO HAVE) VER DOCUMENTACIÓN
  const contextActions = useMemo(() => {
    return <button key="edit">Editar</button>;
  }, [data, selectedRows, toggleCleared]);

  return (
    <main>
      <Title color="primaryColor">Lista de usuarios</Title>
      {/* TODO: CREAR LOADER */}
      {loader ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          title="Lista de usuarios"
          columns={columns}
          data={data}
          customStyles={customStyles as any}
          selectableRows
          selectableRowsSingle
          selectableRowsHighlight
          //contextActions={contextActions}
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
          contextMessage={{
            singular: 'usuario',
            plural: 'items',
            message: 'seleccionado',
          }}
          paginationServer={true}
        />
      )}
    </main>
  );
}
