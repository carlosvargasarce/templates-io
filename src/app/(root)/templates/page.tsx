'use client';

import Button from '@/components/Button/Button';
import Title from '@/components/Title/Title';
import { customStyles } from '@/constants/tableStylesOverrides';
import { TemplateProps } from '@/types/template';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import styles from './page.module.scss';
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
  },
];

export default function Page() {
  const [selectedRows, setSelectedRows] = useState<TemplateProps[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState(templates);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(false);
  }, []);

  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  //TODO: CREAR COMPONENTE PARA MODAL
  const handleDelete = () => {
    console.log('Remover el template: ', selectedRows[0].name);
  };

  // TODO: CAMBIAR EL CHECKBOX POR UNO PROPIO (NICE TO HAVE) VER DOCUMENTACIÓN
  return (
    <main>
      <Title color="primaryColor">Lista de templates</Title>
      <div className={styles.buttons}>
        {selectedRows.length > 0 && (
          <Button label="Eliminar" bgColor="danger" onClick={handleDelete} />
        )}
        <Link
          href={
            selectedRows.length > 0
              ? `/editar-template/${selectedRows[0].id}`
              : '/crear-template'
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
          contextMessage={{
            singular: 'template',
            plural: 'items',
            message: 'seleccionado',
          }}
        />
      )}
    </main>
  );
}
