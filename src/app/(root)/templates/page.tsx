'use client';

import Title from '@/components/Title/Title';
import { customStyles } from '@/constants/tableStylesOverrides';
import { TemplateProps } from '@/types/template';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { templates } from './templates';

//Estructura de las columnas
const columns: TableColumn<TemplateProps>[] = [
  {
    name: 'Nombre',
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: 'Palabras Clave',
    selector: (row) => row.keywords.join(', '),
    sortable: true,
  },
  {
    name: 'Categoría',
    selector: (row) => row.category,
    sortable: true,
  }
];

export default function Page() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(templates);
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
      <Title color="primaryColor">Lista de templates</Title>
      {/* TODO: CREAR LOADER */}
      {loader ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          title="Lista de templates"
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
            singular: 'template',
            plural: 'items',
            message: 'seleccionado',
          }}
          paginationServer={true}
        />
      )}
    </main>
  );
}