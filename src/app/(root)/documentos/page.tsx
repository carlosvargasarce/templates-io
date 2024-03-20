'use client';

import Button from '@/components/Button/Button';
import Title from '@/components/Title/Title';
import { customStyles } from '@/constants/tableStylesOverrides';
import useToast from '@/hooks/useToast';
import DocumentManager from '@/lib/manager/DocumentManager';
import TemplateManager from '@/lib/manager/TemplateManager';
import { DocumentProps } from '@/types/document';
import { TemplateProps } from '@/types/template';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import styles from './page.module.scss';

export default function Page() {
  const [selectedRows, setSelectedRows] = useState<DocumentProps[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [data, setData] = useState<DocumentProps[]>([]);
  const [loader, setLoader] = useState(true);
  const [refreshDataTrigger, setRefreshDataTrigger] = useState(false);
  const [templates, setTemplates] = useState<TemplateProps[]>([]);
  const templateManager = new TemplateManager();
  const [refreshTemplatesDataTrigger, setRefreshTemplatesDataTrigger] =
    useState(false);
  const documentManager = new DocumentManager();
  const { notifyError } = useToast();

  useEffect(() => {
    //Cargar los templates
    const data = templateManager.getAllTemplates();
    setTemplates(data);
    setLoader(false);
  }, [refreshTemplatesDataTrigger]);

  useEffect(() => {
    //Cargar los documentos
    const documents = documentManager.getAllDocuments();
    setData(documents);
    setLoader(false); // Desactiva el indicador de carga una vez que los datos están listos.
  }, [refreshDataTrigger]);

  /**
   * Maneja la selección de filas en la tabla de documentos.
   * @param {any} state - Estado actual de las filas seleccionadas.
   */
  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  /**
   * Maneja la acción de eliminar documentos seleccionados.
   */
  const handleDelete = () => {
    if (selectedRows.length === 0) {
      notifyError('No se ha seleccionado ningún documento para eliminar');
      return;
    }

    documentManager.deleteDocument(selectedRows[0].id);
    setRefreshDataTrigger((current) => !current);
    setSelectedRows([]);
    setToggleCleared((current) => !current);
  };

  /**
   * Define la estructura de las columnas para la tabla de documentos.
   * @type {TableColumn<DocumentProps>[]}
   */
  const columns: TableColumn<DocumentProps>[] = [
    {
      name: 'Nombre',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Templates Base',
      selector: (row) => {
        const templateNames = row.templates.slice(0, 2).map((templateId) => {
          const template = templates.find((t) => t.id === templateId);
          return template ? template.name : 'Template no encontrado';
        });

        if (templateNames.length === 0) {
          return 'Ningún template seleccionado';
        }

        return templateNames.join(', ');
      },
      sortable: true,
    },
    {
      name: 'Preview',
    },
  ];

  // TODO: CAMBIAR EL CHECKBOX POR UNO PROPIO (NICE TO HAVE) VER DOCUMENTACIÓN
  return (
    <main>
      <Title color="primaryColor">Lista de documentos</Title>
      <div className={styles.buttons}>
        {selectedRows.length > 0 && (
          <Button label="Eliminar" bgColor="danger" onClick={handleDelete} />
        )}
        <Link
          href={
            selectedRows.length > 0
              ? `/editar-documento/${selectedRows[0].id}`
              : '/crear-documento'
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
            <div style={{ marginTop: '120px' }}>No hay documentos creados</div>
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
          contextMessage={{
            singular: 'documento',
            plural: 'items',
            message: 'seleccionado',
          }}
        />
      )}
    </main>
  );
}
